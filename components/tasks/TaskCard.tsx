'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRewardSystem } from '@/lib/hooks/useRewardSystem';

import { Task } from '@/lib/api/taskService';

interface TaskCardProps {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  userId: number;
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (task: Task) => void;
}

export function TaskCard({
  id,
  title,
  description,
  completed,
  createdAt,
  userId,
  onToggleComplete,
  onDelete,
  onEdit,
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

  const handleDelete = () => {
    setIsDeleting(true);
    // Delay the actual deletion until the animation completes
    setTimeout(() => {
      onDelete(id);
    }, 300);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className={cn(
        "bg-white rounded-xl border border-neutral-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 group",
        completed && "bg-neutral-50 border-neutral-100 opacity-80"
      )}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-start gap-3">
        {/* Status Indicator */}
        <div className={cn(
          "w-1 rounded-full mt-1 transition-colors duration-200",
          completed ? "bg-success-500 h-6" : "bg-primary-500 h-8"
        )}></div>

        {/* Checkbox */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleToggleComplete}
          className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-0.5",
            completed
              ? "bg-success-500 border-success-500"
              : "border-neutral-300 hover:border-primary-500 hover:bg-primary-50"
          )}
        >
          {completed && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-3 h-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
        </motion.button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <motion.h3
            animate={{
              color: completed ? "#9CA3AF" : "#1F2937"
            }}
            transition={{ duration: 0.3 }}
            className={cn(
              "font-medium break-words transition-colors",
              completed && "line-through"
            )}
          >
            {title}
          </motion.h3>

          {/* Description */}
          {description && (
            <motion.p
              animate={{ opacity: completed ? 0.6 : 1 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-neutral-600 mt-1 line-clamp-2"
            >
              {description}
            </motion.p>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
            <div className="flex items-center gap-1">
              <span>📅</span>
              <span>{createdAt}</span>
            </div>
            {completed && (
              <div className="flex items-center gap-1">
                <span>✅</span>
                <span>Completed</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit({ id, title, description, completed, created_at: createdAt, user_id: userId } as Task)}
              className="p-1.5 text-neutral-500 hover:text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
              aria-label="Edit task"
            >
              ✏️
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleDelete}
            className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
            aria-label="Delete task"
          >
            🗑️
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}