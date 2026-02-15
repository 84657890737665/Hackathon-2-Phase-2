'use client';

import { useRewardSystem } from '@/lib/hooks/useRewardSystem';

export function StreakCounter() {
  const { streak } = useRewardSystem();

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 rounded-lg border border-neutral-200 transition-all">
      <span className="text-lg">📊</span>
      <div className="text-sm font-medium text-neutral-700">
        <div className="text-xs text-neutral-500">Consistency</div>
        <div className="font-semibold">{streak} days</div>
      </div>
    </div>
  );
}