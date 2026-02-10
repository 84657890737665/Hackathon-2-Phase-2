'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useRewardSystem } from '@/lib/hooks/useRewardSystem';

interface TaskCardProps {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TaskCard({
  id,
  title,
  description,
  completed,
  createdAt,
  onToggleComplete,
  onDelete,
}: TaskCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { triggerCelebration, fetchProfile } = useRewardSystem();

  const handleToggleComplete = async () => {
    if (!completed) {
      // Task being completed - trigger visual celebration!
      triggerCelebration();
    }

    onToggleComplete(id);

    // In a real app, you'd get the user_id from context/session
    // For now we assume we refresh stats after a short delay or depend on the parent to refresh
    // I'll add a small hack to fetch stats if we have access to user_id
  };

  return (
    <div
      className={cn(
        "card-base p-5 group",
        completed && "bg-gradient-to-br from-accent-50 to-white opacity-75",
        isDeleting && "animate-scale-in"
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-3">
        {/* Checkbox */}
        <button
          onClick={handleToggleComplete}
          className={cn(
            "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 self-start",
            completed
              ? "bg-gradient-button border-primary-600"
              : "border-primary-400 hover:border-primary-600 hover:bg-primary-50"
          )}
        >
          {completed && (
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3
            className={cn(
              "text-lg font-semibold break-words transition-all",
              completed && "line-through text-neutral-400"
            )}
          >
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-sm text-neutral-600 mt-2 line-clamp-2">
              {description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-2">
            <span>📅</span>
            <span>{createdAt}</span>
          </div>
        </div>

        {/* Actions - moved to top right on larger screens */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity sm:opacity-100 sm:self-start">
          <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            ✏️
          </button>
          <button
            onClick={() => onDelete(id)}
            className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}