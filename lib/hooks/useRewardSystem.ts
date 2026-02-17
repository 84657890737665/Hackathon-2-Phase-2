
'use client';

import { create } from 'zustand';
import { secureFetch } from '@/lib/jwt-client';

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
  points_reward: number;
  current_progress?: number;
  percentage_complete?: number;
  unlocked: boolean;
}

interface CompletionHistory {
  id: number;
  task_id: number;
  task_title: string;
  points_awarded: number;
  streak_incremented: boolean;
  achievement_unlocked_ids: number[];
  completed_at: string;
}

interface RewardState {
  points: number;
  streak: number;
  totalTasksCompleted: number;
  completionRate: number;
  executionVelocity: number;
  focusConsistency: number;
  collaborationEfficiency: number;
  showCelebration: boolean;
  celebrationMessage: string;
  achievements: Achievement[];
  availableAchievements: Achievement[];
  completionHistory: CompletionHistory[];
  isLoading: boolean;

  fetchProfile: (userId: number) => Promise<void>;
  fetchAchievements: (userId: number) => Promise<void>;
  fetchHistory: (userId: number) => Promise<void>;
  triggerCelebration: () => void;
  hideCelebration: () => void;
}

const messages = [
  "Great execution! 📊",
  "Productivity boost! 🚀",
  "Focus maintained! 💼",
  "Performance optimized! ⚙️",
  "Task completed! ✅",
  "Efficiency gained! ⚡",
  "Progress noted! 📈",
];

export const useRewardSystem = create<RewardState>((set, get) => ({
  points: 0,
  streak: 0,
  totalTasksCompleted: 0,
  completionRate: 0,
  executionVelocity: 0,
  focusConsistency: 0,
  collaborationEfficiency: 0,
  showCelebration: false,
  celebrationMessage: '',
  achievements: [],
  availableAchievements: [],
  completionHistory: [],
  isLoading: false,

  fetchProfile: async (userId: number) => {
    set({ isLoading: true });
    try {
      const response = await secureFetch(`/api/${userId}/performance/profile`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to fetch performance profile: ${response.status} - ${errorText}`);
        return;
      }

      const data = await response.json();
      set({
        points: data.points_balance,
        streak: data.streak_count,
        totalTasksCompleted: data.total_tasks_completed,
        completionRate: data.completion_rate,
        executionVelocity: data.execution_velocity,
        focusConsistency: data.focus_consistency,
        collaborationEfficiency: data.collaboration_efficiency,
      });
    } catch (error) {
      console.error('Failed to fetch performance profile:', error);
      // Don't throw the error, just log it to prevent React crashes
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAchievements: async (userId: number) => {
    try {
      // Fetch unlocked
      const unlockedRes = await secureFetch(`/api/${userId}/gamification/achievements`);
      if (unlockedRes.ok) {
        const unlocked = await unlockedRes.json();
        set({ achievements: unlocked });
      } else {
        const errorText = await unlockedRes.text();
        console.error(`Failed to fetch unlocked achievements: ${unlockedRes.status} - ${errorText}`);
      }

      // Fetch available/progress
      const availableRes = await secureFetch(`/api/${userId}/gamification/achievements/available`);
      if (availableRes.ok) {
        const available = await availableRes.json();
        set({ availableAchievements: available });
      } else {
        const errorText = await availableRes.text();
        console.error(`Failed to fetch available achievements: ${availableRes.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
      // Don't throw the error, just log it to prevent React crashes
    }
  },

  fetchHistory: async (userId: number) => {
    try {
      const response = await secureFetch(`/api/${userId}/gamification/history`);
      if (response.ok) {
        const data = await response.json();
        set({ completionHistory: data.completions });
      } else {
        const errorText = await response.text();
        console.error(`Failed to fetch completion history: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('Failed to fetch completion history:', error);
      // Don't throw the error, just log it to prevent React crashes
    }
  },

  triggerCelebration: () => {
    // In enterprise mode, we don't show playful celebrations
    // Instead, we can log productivity achievements or update metrics
    // For now, we'll just update the productivity score
    set(state => ({
      points: state.points + 1,
      showCelebration: true,
      celebrationMessage: "Task completed successfully"
    }));

    // Hide the celebration after a short delay
    setTimeout(() => {
      set({ showCelebration: false });
    }, 2000);
  },

  hideCelebration: () => set({ showCelebration: false }),
}));