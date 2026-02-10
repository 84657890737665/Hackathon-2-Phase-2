'use client';

import { useEffect } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { useRewardSystem } from '@/lib/hooks/useRewardSystem';

export function CompletionCelebration() {
  const { width, height } = useWindowSize();
  const { showCelebration, celebrationMessage, hideCelebration } = useRewardSystem();

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(hideCelebration, 3000);
      return () => clearTimeout(timer);
    }
  }, [showCelebration, hideCelebration]);

  if (!showCelebration) return null;

  return (
    <>
      <Confetti
        width={width}
        height={height}
        numberOfPieces={60}
        recycle={false}
        colors={['#5B68DB', '#14B8A6', '#FF9800', '#6B7FDB', '#2DD4BF', '#FFB74D']}
        gravity={0.3}
        wind={0}
      />
      
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-modal p-8 animate-bounce-in border-2 border-primary-200">
          <p className="text-4xl font-bold text-gradient whitespace-nowrap">
            {celebrationMessage}
          </p>
        </div>
      </div>
    </>
  );
}