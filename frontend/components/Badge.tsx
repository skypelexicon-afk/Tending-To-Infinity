'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface BadgeProps {
  badge_name: string;
  milestone_days: number;
  badge_shape: string;
  animation_type: string;
  description: string;
  earned_at?: string;
  isEarned: boolean;
}

export default function Badge({
  badge_name,
  milestone_days,
  badge_shape,
  animation_type,
  description,
  earned_at,
  isEarned,
}: BadgeProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Badge shape SVG paths and colors
  const getBadgeShape = () => {
    const shapeClass = isEarned
      ? 'fill-gradient-to-br from-yellow-400 to-orange-500'
      : 'fill-gray-300';

    switch (badge_shape) {
      case 'circle':
        return (
          <circle cx="50" cy="50" r="40" className={isEarned ? 'fill-yellow-400' : 'fill-gray-300'} />
        );
      case 'flame':
        return (
          <path
            d="M50 10 C50 10, 30 30, 30 50 C30 65, 40 75, 50 75 C60 75, 70 65, 70 50 C70 30, 50 10, 50 10 Z M50 35 C50 35, 45 45, 45 52 C45 58, 47 62, 50 62 C53 62, 55 58, 55 52 C55 45, 50 35, 50 35 Z"
            className={isEarned ? 'fill-orange-500' : 'fill-gray-300'}
          />
        );
      case 'star':
        return (
          <path
            d="M50 15 L57 40 L85 40 L62 55 L70 80 L50 65 L30 80 L38 55 L15 40 L43 40 Z"
            className={isEarned ? 'fill-yellow-400' : 'fill-gray-300'}
          />
        );
      case 'crystal':
        return (
          <path
            d="M50 10 L70 30 L70 70 L50 90 L30 70 L30 30 Z M50 10 L50 90 M30 30 L70 70 M70 30 L30 70"
            className={isEarned ? 'fill-purple-400 stroke-purple-600' : 'fill-gray-300'}
            strokeWidth="2"
          />
        );
      case 'infinity':
        return (
          <path
            d="M20 50 C20 35, 30 25, 40 25 C50 25, 50 35, 50 50 C50 35, 50 25, 60 25 C70 25, 80 35, 80 50 C80 65, 70 75, 60 75 C50 75, 50 65, 50 50 C50 65, 50 75, 40 75 C30 75, 20 65, 20 50 Z"
            className={isEarned ? 'fill-blue-500' : 'fill-gray-300'}
          />
        );
      case 'diamond':
        return (
          <path
            d="M50 15 L75 35 L75 65 L50 85 L25 65 L25 35 Z"
            className={isEarned ? 'fill-cyan-400' : 'fill-gray-300'}
          />
        );
      case 'shield':
        return (
          <path
            d="M50 10 L80 25 L80 55 C80 70, 65 85, 50 90 C35 85, 20 70, 20 55 L20 25 Z"
            className={isEarned ? 'fill-red-500' : 'fill-gray-300'}
          />
        );
      case 'crown':
        return (
          <path
            d="M20 70 L20 60 L30 45 L35 55 L50 35 L65 55 L70 45 L80 60 L80 70 Z M25 65 L75 65 L75 75 L25 75 Z"
            className={isEarned ? 'fill-yellow-500' : 'fill-gray-300'}
          />
        );
      case 'hexagon':
        return (
          <path
            d="M50 15 L75 30 L75 70 L50 85 L25 70 L25 30 Z"
            className={isEarned ? 'fill-indigo-500' : 'fill-gray-300'}
          />
        );
      case 'pentagon':
        return (
          <path
            d="M50 10 L85 40 L70 80 L30 80 L15 40 Z"
            className={isEarned ? 'fill-pink-500' : 'fill-gray-300'}
          />
        );
      case 'octagon':
        return (
          <path
            d="M30 15 L70 15 L85 30 L85 70 L70 85 L30 85 L15 70 L15 30 Z"
            className={isEarned ? 'fill-purple-600' : 'fill-gray-300'}
          />
        );
      default:
        return (
          <circle cx="50" cy="50" r="40" className={isEarned ? 'fill-gray-500' : 'fill-gray-300'} />
        );
    }
  };

  // Animation variants based on animation_type
  const getAnimation = () => {
    if (!isEarned || !isHovered) return {};

    switch (animation_type) {
      case 'glow':
        return {
          filter: [
            'drop-shadow(0 0 8px rgba(255, 200, 0, 0.8))',
            'drop-shadow(0 0 20px rgba(255, 200, 0, 1))',
            'drop-shadow(0 0 8px rgba(255, 200, 0, 0.8))',
          ],
        };
      case 'flicker':
        return {
          opacity: [1, 0.8, 1, 0.9, 1],
          scale: [1, 1.05, 1, 1.03, 1],
        };
      case 'burst':
        return {
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        };
      case 'shine':
        return {
          filter: [
            'brightness(1)',
            'brightness(1.5)',
            'brightness(1)',
          ],
        };
      case 'pulse':
        return {
          scale: [1, 1.1, 1, 1.05, 1],
        };
      case 'sparkle':
        return {
          rotate: [0, 10, -10, 5, -5, 0],
          scale: [1, 1.1, 1],
        };
      case 'glow-wave':
        return {
          filter: [
            'drop-shadow(0 0 5px rgba(100, 200, 255, 0.5))',
            'drop-shadow(0 0 15px rgba(100, 200, 255, 1))',
            'drop-shadow(0 0 5px rgba(100, 200, 255, 0.5))',
          ],
        };
      case 'radiant':
        return {
          scale: [1, 1.15, 1],
          filter: [
            'brightness(1)',
            'brightness(1.8)',
            'brightness(1)',
          ],
        };
      case 'rotate-glow':
        return {
          rotate: [0, 360],
          filter: [
            'drop-shadow(0 0 8px rgba(150, 100, 255, 0.8))',
            'drop-shadow(0 0 20px rgba(150, 100, 255, 1))',
          ],
        };
      case 'cosmic':
        return {
          scale: [1, 1.2, 1],
          rotate: [0, 360],
          filter: ['hue-rotate(0deg)', 'hue-rotate(360deg)'],
        };
      case 'prismatic':
        return {
          filter: [
            'hue-rotate(0deg) saturate(1)',
            'hue-rotate(120deg) saturate(1.5)',
            'hue-rotate(240deg) saturate(1.5)',
            'hue-rotate(360deg) saturate(1)',
          ],
          scale: [1, 1.15, 1],
        };
      default:
        return { scale: [1, 1.1, 1] };
    }
  };

  return (
    <motion.div
      className="relative flex flex-col items-center gap-2 p-4"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      data-testid={`badge-${badge_name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <motion.div
        className="relative w-24 h-24"
        animate={getAnimation()}
        transition={{
          duration: 1.5,
          repeat: isHovered && isEarned ? Infinity : 0,
          ease: 'easeInOut',
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full ${!isEarned ? 'opacity-40' : ''}`}
        >
          {getBadgeShape()}
        </svg>

        {!isEarned && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl">🔒</div>
          </div>
        )}
      </motion.div>

      <div className="text-center max-w-[120px]">
        <h4 className={`font-bold text-sm ${isEarned ? 'text-gray-800' : 'text-gray-400'}`}>
          {badge_name}
        </h4>
        <p className="text-xs text-gray-500">{milestone_days} days</p>
      </div>

      {/* Tooltip on hover */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full mb-2 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl z-10 w-48"
          data-testid={`badge-tooltip-${badge_name.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <p className="font-semibold mb-1">{badge_name}</p>
          <p className="text-gray-300">{description}</p>
          {earned_at && (
            <p className="text-gray-400 mt-1">
              Earned: {new Date(earned_at).toLocaleDateString()}
            </p>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
