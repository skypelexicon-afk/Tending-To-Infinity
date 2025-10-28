'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useStreakStore } from '@/store/useStreakStore';

export default function StreakCalendar() {
  const { history, fetchHistory, isLoading } = useStreakStore();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [days, setDays] = useState(90);

  useEffect(() => {
    fetchHistory(days);
  }, [days]);

  const getDateColor = (wasActive: boolean, daysAgo: number) => {
    if (!wasActive) return 'bg-gray-200';
    
    // Gradient based on recency
    if (daysAgo < 7) return 'bg-orange-500';
    if (daysAgo < 14) return 'bg-orange-400';
    if (daysAgo < 30) return 'bg-orange-300';
    if (daysAgo < 60) return 'bg-orange-200';
    return 'bg-orange-100';
  };

  // Create a map of dates to activity
  const activityMap = new Map(
    history.map((h) => [
      new Date(h.activity_date).toDateString(),
      h.was_active,
    ])
  );

  // Generate last N days
  const generateCalendarDays = () => {
    const daysArray = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toDateString();
      const wasActive = activityMap.get(dateString) || false;
      
      daysArray.push({
        date,
        dateString,
        wasActive,
        daysAgo: i,
      });
    }
    
    return daysArray;
  };

  const calendarDays = generateCalendarDays();
  
  // Group by weeks for better visualization
  const weeks: typeof calendarDays[] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6" data-testid="streak-calendar">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              📅 Streak History
            </h2>
            <p className="text-gray-600 text-sm">
              Your daily learning activity
            </p>
          </div>
          
          {/* Time Range Selector */}
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            data-testid="days-selector"
          >
            <option value={30}>Last 30 days</option>
            <option value={60}>Last 60 days</option>
            <option value={90}>Last 90 days</option>
            <option value={180}>Last 6 months</option>
            <option value={365}>Last year</option>
          </select>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="w-4 h-4 bg-orange-100 rounded"></div>
            <div className="w-4 h-4 bg-orange-200 rounded"></div>
            <div className="w-4 h-4 bg-orange-300 rounded"></div>
            <div className="w-4 h-4 bg-orange-400 rounded"></div>
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex flex-col gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex gap-1">
                {week.map((day, dayIndex) => (
                  <motion.div
                    key={dayIndex}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (weekIndex * 7 + dayIndex) * 0.01 }}
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                    className="relative group"
                  >
                    <div
                      className={`w-5 h-5 md:w-6 md:h-6 rounded ${getDateColor(
                        day.wasActive,
                        day.daysAgo
                      )} cursor-pointer transition-all`}
                      onMouseEnter={() => setSelectedDate(day.dateString)}
                      onMouseLeave={() => setSelectedDate(null)}
                      data-testid={`calendar-day-${day.dateString}`}
                    />
                    
                    {/* Tooltip */}
                    {selectedDate === day.dateString && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 shadow-xl z-20 whitespace-nowrap pointer-events-none"
                        data-testid="calendar-tooltip"
                      >
                        <div className="font-semibold">
                          {day.date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="text-gray-300">
                          {day.wasActive ? '✅ Active' : '⭕ No activity'}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600" data-testid="active-days-count">
            {history.filter((h) => h.was_active).length}
          </div>
          <div className="text-sm text-gray-600">Active Days</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600" data-testid="inactive-days-count">
            {days - history.filter((h) => h.was_active).length}
          </div>
          <div className="text-sm text-gray-600">Missed Days</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600" data-testid="activity-rate">
            {history.length > 0
              ? Math.round((history.filter((h) => h.was_active).length / days) * 100)
              : 0}
            %
          </div>
          <div className="text-sm text-gray-600">Activity Rate</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600" data-testid="current-month-days">
            {history.filter((h) => {
              const date = new Date(h.activity_date);
              const now = new Date();
              return (
                h.was_active &&
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear()
              );
            }).length}
          </div>
          <div className="text-sm text-gray-600">This Month</div>
        </div>
      </div>
    </div>
  );
}
