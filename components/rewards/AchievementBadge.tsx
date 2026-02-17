'use client';

import { cn } from '@/lib/utils';

interface AchievementBadgeProps {
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number;
  current: number;
}

export function AchievementBadge({
  title,
  description,
  icon,
  unlocked,
  requirement,
  current,
}: AchievementBadgeProps) {
  const progress = Math.min((current / requirement) * 100, 100);
  
  return (
    <div
      className={cn(
        "relative p-6 rounded-xl border-2 transition-all duration-300",
        unlocked
          ? "bg-gradient-to-br from-primary-50 to-accent-50 border-primary-300 shadow-card"
          : "bg-neutral-50 border-neutral-200 opacity-60"
      )}
    >
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="font-bold text-lg text-neutral-900 mb-1">{title}</h3>
      <p className="text-sm text-neutral-600 mb-3">{description}</p>
      
      {!unlocked && (
        <div className="space-y-1">
          <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-button transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-neutral-500">
            {current} / {requirement}
          </p>
        </div>
      )}
      
      {unlocked && (
        <div className="absolute -top-2 -right-2 bg-gradient-button text-white text-xs font-bold px-3 py-1 rounded-full shadow-primary animate-bounce-in">
          Unlocked!
        </div>
      )}
    </div>
  );
}