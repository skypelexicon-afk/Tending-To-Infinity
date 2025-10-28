import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchApi } from '@/lib/doFetch';

interface StreakData {
  current_streak: number;
  longest_streak: number;
  total_days_active: number;
  last_active_date: string | null;
}

interface Badge {
  badge_name: string;
  milestone_days: number;
  badge_shape: string;
  animation_type: string;
  description: string;
  earned_at?: string;
}

interface StreakHistory {
  id: number;
  activity_date: string;
  was_active: boolean;
}

interface StreakState {
  streak: StreakData | null;
  earnedBadges: Badge[];
  allBadges: Badge[];
  history: StreakHistory[];
  isLoading: boolean;
  error: string | null;
}

interface StreakActions {
  fetchStreak: () => Promise<void>;
  updateStreak: () => Promise<void>;
  fetchBadges: () => Promise<void>;
  fetchHistory: (days?: number) => Promise<void>;
  clearError: () => void;
}

export const useStreakStore = create<StreakState & StreakActions>()(
  persist(
    (set, get) => ({
      streak: null,
      earnedBadges: [],
      allBadges: [],
      history: [],
      isLoading: false,
      error: null,

      fetchStreak: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetchApi.get<{ success: boolean; streak: StreakData }>(
            'api/streaks/my-streak'
          );
          set({ streak: res.streak, isLoading: false });
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Failed to fetch streak';
          set({ error, isLoading: false });
        }
      },

      updateStreak: async () => {
        try {
          const res = await fetchApi.post<
            {}, 
            { success: boolean; streak: StreakData; newBadges?: Badge[]; message: string }
          >('api/streaks/update', {});
          
          set({ streak: res.streak });
          
          // If new badges were earned, fetch all badges
          if (res.newBadges && res.newBadges.length > 0) {
            await get().fetchBadges();
          }
          
          return res;
        } catch (err) {
          console.error('Failed to update streak:', err);
        }
      },

      fetchBadges: async () => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetchApi.get<{ 
            success: boolean; 
            earnedBadges: Badge[]; 
            allBadges: Badge[] 
          }>('api/streaks/my-badges');
          
          set({ 
            earnedBadges: res.earnedBadges, 
            allBadges: res.allBadges,
            isLoading: false 
          });
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Failed to fetch badges';
          set({ error, isLoading: false });
        }
      },

      fetchHistory: async (days = 90) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetchApi.get<{ 
            success: boolean; 
            history: StreakHistory[] 
          }>(`api/streaks/history?days=${days}`);
          
          set({ history: res.history, isLoading: false });
        } catch (err) {
          const error = err instanceof Error ? err.message : 'Failed to fetch history';
          set({ error, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'streak-storage',
      partialize: (state) => ({
        streak: state.streak,
        earnedBadges: state.earnedBadges,
        allBadges: state.allBadges,
      }),
    }
  )
);
