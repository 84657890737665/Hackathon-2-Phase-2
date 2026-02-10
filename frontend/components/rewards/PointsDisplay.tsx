'use client';

import { useRewardSystem } from '@/lib/hooks/useRewardSystem';

export function PointsDisplay() {
  const { points } = useRewardSystem();
  
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-accent-50 rounded-full border border-primary-200 transition-all hover:scale-105">
      <span className="text-xl">⭐</span>
      <span className="font-bold text-neutral-800">
        {points} point{points !== 1 ? 's' : ''}
      </span>
    </div>
  );
}