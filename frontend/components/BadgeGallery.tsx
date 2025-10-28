'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStreakStore } from '@/store/useStreakStore';
import Badge from './Badge';

export default function BadgeGallery() {
  const { earnedBadges, allBadges, fetchBadges, isLoading } = useStreakStore();

  useEffect(() => {
    fetchBadges();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  const earnedBadgeNames = new Set(earnedBadges.map((b) => b.badge_name));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6" data-testid="badge-gallery">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🏆 Your Badges
        </h2>
        <p className="text-gray-600">
          Earn badges by maintaining your learning streak!
        </p>
        <div className="mt-3 flex items-center gap-4 text-sm">
          <span className="text-orange-600 font-semibold">
            {earnedBadges.length} / {allBadges.length} Earned
          </span>
          <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${(earnedBadges.length / allBadges.length) * 100}%`,
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {allBadges.map((badge, index) => {
          const earnedBadge = earnedBadges.find((b) => b.badge_name === badge.badge_name);
          const isEarned = earnedBadgeNames.has(badge.badge_name);

          return (
            <motion.div
              key={badge.badge_name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Badge
                badge_name={badge.badge_name}
                milestone_days={badge.milestone_days}
                badge_shape={badge.badge_shape}
                animation_type={badge.animation_type}
                description={badge.description}
                earned_at={earnedBadge?.earned_at}
                isEarned={isEarned}
              />
            </motion.div>
          );
        })}
      </div>

      {earnedBadges.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-lg font-semibold">Start your streak to earn badges!</p>
          <p className="text-sm mt-2">Log in daily to build your learning momentum.</p>
        </div>
      )}
    </div>
  );
}
