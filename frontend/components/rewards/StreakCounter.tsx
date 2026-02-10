'use client';

import { useRewardSystem } from '@/lib/hooks/useRewardSystem';

export function StreakCounter() {
  const { streak } = useRewardSystem();
  
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-warm-50 to-accent-50 rounded-full border border-warm-200 transition-all hover:scale-105">
      <span className="text-2xl animate-float">🔥</span>
      <span className="font-bold text-neutral-800">
        {streak} day{streak !== 1 ? 's' : ''} streak
      </span>
    </div>
  );
}