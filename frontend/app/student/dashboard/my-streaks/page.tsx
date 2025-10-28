'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import BadgeGallery from '@/components/BadgeGallery';
import StreakCalendar from '@/components/StreakCalendar';
import { useStreakStore } from '@/store/useStreakStore';

export default function MyStreaksPage() {
  const { streak, fetchStreak } = useStreakStore();

  useEffect(() => {
    fetchStreak();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4" data-testid="streaks-page-title">
            🔥 Your Learning Streak
          </h1>
          <p className="text-gray-600 text-lg">
            Track your daily progress and earn amazing badges!
          </p>
        </div>

        {/* Current Streak Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl shadow-2xl p-8 mb-8 text-white"
          data-testid="current-streak-card"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-6xl mb-2">🔥</div>
              <div className="text-5xl font-bold mb-2" data-testid="current-streak-display">
                {streak?.current_streak || 0}
              </div>
              <div className="text-lg opacity-90">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-2">🏆</div>
              <div className="text-5xl font-bold mb-2" data-testid="longest-streak-display">
                {streak?.longest_streak || 0}
              </div>
              <div className="text-lg opacity-90">Best Streak</div>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-2">📚</div>
              <div className="text-5xl font-bold mb-2" data-testid="total-days-display">
                {streak?.total_days_active || 0}
              </div>
              <div className="text-lg opacity-90">Total Days</div>
            </div>
          </div>
        </motion.div>

        {/* Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <BadgeGallery />
        </motion.div>

        {/* Calendar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StreakCalendar />
        </motion.div>
      </motion.div>
    </div>
  );
}
