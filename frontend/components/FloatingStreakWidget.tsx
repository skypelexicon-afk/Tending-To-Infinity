'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStreakStore } from '@/store/useStreakStore';
import { useAuthStore } from '@/store/useAuthStore';
import { X } from 'lucide-react';

export default function FloatingStreakWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  const { user, isAuthenticated } = useAuthStore();
  const { streak, fetchStreak } = useStreakStore();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'student') {
      fetchStreak();
    }
  }, [isAuthenticated, user]);

  // Don't show for non-students or non-authenticated users
  if (!isAuthenticated || user?.role !== 'student' || !isVisible) {
    return null;
  }

  const currentStreak = streak?.current_streak || 0;
  
  const getStreakEmoji = (streak: number) => {
    if (streak === 0) return '🌱';
    if (streak < 7) return '🔥';
    if (streak < 14) return '⚡';
    if (streak < 30) return '💎';
    if (streak < 60) return '♾️';
    if (streak < 120) return '👑';
    return '🏆';
  };

  const getMotivationalText = (streak: number) => {
    if (streak === 0) return 'Start your streak!';
    if (streak === 1) return 'Great start!';
    if (streak < 7) return 'Keep it up!';
    if (streak < 14) return 'You\'re on fire!';
    if (streak < 30) return 'Amazing consistency!';
    if (streak < 60) return 'Unstoppable!';
    if (streak < 120) return 'Legendary!';
    return 'You\'re a master!';
  };

  return (
    <AnimatePresence>
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 9999,
          touchAction: 'none',
        }}
        className="cursor-move"
        data-testid="floating-streak-widget"
      >
        <div
          onMouseEnter={() => !isDragging && setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className="relative"
        >
          {/* Collapsed Icon */}
          <motion.div
            animate={{
              scale: isExpanded ? 0 : 1,
              opacity: isExpanded ? 0 : 1,
            }}
            className="absolute inset-0"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:shadow-xl transition-shadow">
              <div className="text-center">
                <div className="text-2xl" data-testid="streak-emoji">{getStreakEmoji(currentStreak)}</div>
                <div className="text-xs font-bold text-white" data-testid="streak-count">{currentStreak}</div>
              </div>
            </div>
          </motion.div>

          {/* Expanded Card */}
          <motion.div
            animate={{
              scale: isExpanded ? 1 : 0,
              opacity: isExpanded ? 1 : 0,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-2xl shadow-2xl p-4 min-w-[280px] pointer-events-auto"
            data-testid="streak-expanded-card"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
              data-testid="close-streak-widget"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="text-4xl" data-testid="streak-emoji-expanded">{getStreakEmoji(currentStreak)}</div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg" data-testid="current-streak-title">
                  {currentStreak} Day Streak
                </h3>
                <p className="text-sm text-gray-500" data-testid="motivational-text">
                  {getMotivationalText(currentStreak)}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Current: {currentStreak}</span>
                <span data-testid="longest-streak">Longest: {streak?.longest_streak || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((currentStreak / ((streak?.longest_streak || 1))) * 100, 100)}%`,
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
                  data-testid="streak-progress-bar"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-orange-50 rounded-lg p-2">
                <div className="text-lg font-bold text-orange-600" data-testid="total-days">
                  {streak?.total_days_active || 0}
                </div>
                <div className="text-xs text-gray-600">Total Days</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-2">
                <div className="text-lg font-bold text-blue-600" data-testid="best-streak">
                  {streak?.longest_streak || 0}
                </div>
                <div className="text-xs text-gray-600">Best Streak</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
