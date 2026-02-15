'use client';

import { useEffect } from 'react';
import { useRewardSystem } from '@/lib/hooks/useRewardSystem';
import { AchievementBadge } from '@/components/rewards/AchievementBadge';
import { RewardHistory } from '@/components/rewards/RewardHistory';
import { useSession } from '@/lib/jwt-client';

export default function AchievementsPage() {
  const session = useSession();
  const userId = session?.data?.user?.id;

  const {
    achievements,
    availableAchievements,
    completionHistory,
    points,
    streak,
    totalTasksCompleted,
    isLoading,
    fetchProfile,
    fetchAchievements,
    fetchHistory
  } = useRewardSystem();

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
      fetchAchievements(userId);
      fetchHistory(userId);
    }
  }, [userId, fetchProfile, fetchAchievements, fetchHistory]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
          Your Achievements
        </h1>
        <p className="text-neutral-600">
          Track your progress and unlock new milestones
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-200">
          <div className="text-3xl font-bold text-primary-700">{points}</div>
          <div className="text-neutral-600">Points Earned</div>
        </div>
        <div className="bg-gradient-to-br from-warm-50 to-accent-50 rounded-xl p-6 border border-warm-200">
          <div className="text-3xl font-bold text-warm-700">{streak}</div>
          <div className="text-neutral-600">Day Streak</div>
        </div>
        <div className="bg-gradient-to-br from-accent-50 to-primary-50 rounded-xl p-6 border border-accent-200">
          <div className="text-3xl font-bold text-accent-700">
            {achievements.length}
          </div>
          <div className="text-neutral-600">Badges Unlocked</div>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-neutral-900 mb-6">Your Milestone Badges</h2>
        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <AchievementBadge
                key={achievement.id}
                title={achievement.name}
                description={achievement.description}
                icon={achievement.icon}
                unlocked={true}
                requirement={achievement.requirement_value}
                current={achievement.requirement_value}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300">
            <p className="text-neutral-500">Unlock your first badge by completing tasks!</p>
          </div>
        )}
      </div>

      {/* Available Achievements */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Available Milestones</h2>
          <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
            Progress Tracking
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableAchievements.filter(a => !a.unlocked).map((achievement) => (
            <AchievementBadge
              key={achievement.id}
              title={achievement.name}
              description={achievement.description}
              icon={achievement.icon}
              unlocked={false}
              requirement={achievement.requirement_value}
              current={achievement.current_progress || 0}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
        {/* Progress Categories */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Skill Progression</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-card border border-neutral-100">
              <h3 className="text-xl font-semibold text-neutral-800 mb-4">Task Completion Mastery</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-neutral-600 font-medium">Grand Master Level</span>
                    <span className="text-primary-600 font-bold">
                      {totalTasksCompleted}/100
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-button h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${Math.min(100, (totalTasksCompleted / 100) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-card border border-neutral-100">
              <h3 className="text-xl font-semibold text-neutral-800 mb-4">Consistency Discipline</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2 text-sm">
                    <span className="text-neutral-600 font-medium">Daily Streak Heat</span>
                    <span className="text-warm-600 font-bold">{streak} days</span>
                  </div>
                  <div className="w-full bg-neutral-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-warm-500 to-warm-600 h-full rounded-full transition-all duration-1000 ease-out shadow-lg shadow-warm-100"
                      style={{ width: `${Math.min(100, (streak / 30) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reward History Sidebar */}
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Recent Rewards</h2>
          <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            <RewardHistory history={completionHistory} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {/* Achievement Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Keep Going!</h3>
        <p className="text-blue-700">
          Complete more tasks to earn points and unlock achievements. Maintain your streak to earn special badges!
        </p>
      </div>
    </div>
  );
}