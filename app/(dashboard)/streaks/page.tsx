'use client';

import { useRewardSystem } from '@/lib/hooks/useRewardSystem';
import { useAuth } from '@/components/AuthProvider';
import { useEffect } from 'react';

export default function StreaksPage() {
    const { useSession } = useAuth();
    const session = useSession();
    const userId = session?.data?.user?.id;
    const { streak, totalTasksCompleted, fetchProfile } = useRewardSystem();

    useEffect(() => {
        if (userId) {
            fetchProfile(userId);
        }
    }, [userId, fetchProfile]);

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
                    Your Momentum
                </h1>
                <p className="text-neutral-600">
                    Stay consistent and watch your progress soar
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Current Streak Card */}
                <div className="bg-white/40 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                    <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">🔥</div>
                    <h2 className="text-xl font-semibold text-neutral-800 mb-4">Current Streak</h2>
                    <div className="flex items-baseline gap-2">
                        <span className="text-7xl font-bold text-orange-600 leading-none">{streak}</span>
                        <span className="text-xl font-medium text-neutral-500 uppercase tracking-wider">Days</span>
                    </div>
                    <p className="mt-6 text-neutral-600">
                        You've been productive for {streak} consecutive days. Keep it up!
                    </p>
                    <div className="mt-8 h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-400 to-red-500 transition-all duration-1000"
                            style={{ width: `${Math.min(100, (streak / 30) * 100)}%` }}
                        />
                    </div>
                    <p className="mt-2 text-xs text-neutral-400 text-right">Progress to 30-day Master Badge</p>
                </div>

                {/* Total Tasks Card */}
                <div className="bg-white/40 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-300">
                    <div className="absolute top-0 right-0 p-8 text-6xl opacity-10 group-hover:opacity-20 transition-opacity">✅</div>
                    <h2 className="text-xl font-semibold text-neutral-800 mb-4">Lifetime Completion</h2>
                    <div className="flex items-baseline gap-2">
                        <span className="text-7xl font-bold text-primary-600 leading-none">{totalTasksCompleted}</span>
                        <span className="text-xl font-medium text-neutral-500 uppercase tracking-wider">Tasks</span>
                    </div>
                    <p className="mt-6 text-neutral-600">
                        A total of {totalTasksCompleted} tasks completed. Every step counts!
                    </p>
                    <div className="mt-8 h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-400 to-accent-500 transition-all duration-1000"
                            style={{ width: `${Math.min(100, (totalTasksCompleted / 100) * 100)}%` }}
                        />
                    </div>
                    <p className="mt-2 text-xs text-neutral-400 text-right">Progress to 100-task Legend Badge</p>
                </div>
            </div>

            {/* Motivational Section */}
            <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl p-12 border border-indigo-100/30 text-center">
                <h3 className="text-2xl font-bold text-neutral-800 mb-4">Consistency is Key</h3>
                <p className="text-neutral-600 max-w-2xl mx-auto mb-8">
                    The secret to getting ahead is getting started. The secret of getting started is breaking your complex overwhelming tasks into small manageable tasks, and then starting on the first one.
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/50 backdrop-blur-sm rounded-full text-indigo-600 font-semibold border border-indigo-100 shadow-sm">
                    <span>✨</span>
                    <span>Next Milestone: Reach 7-day streak</span>
                </div>
            </div>
        </div>
    );
}
