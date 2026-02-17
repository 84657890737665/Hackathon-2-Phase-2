'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRewardSystem } from '@/lib/hooks/useRewardSystem';

export function CompletionCelebration() {
  const { showCelebration, celebrationMessage, hideCelebration } = useRewardSystem();

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(hideCelebration, 2000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration, hideCelebration]);

  if (!showCelebration) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-xl shadow-lg border border-neutral-200 px-6 py-4"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">✅</span>
          <p className="text-sm font-medium text-neutral-800">
            {celebrationMessage}
          </p>
        </div>
      </motion.div>
    </div>
  );
}