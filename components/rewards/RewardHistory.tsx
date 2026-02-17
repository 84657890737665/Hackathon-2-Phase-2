'use client';

import { cn } from '@/lib/utils';

interface CompletionHistory {
    id: number;
    task_id: number;
    task_title: string;
    points_awarded: number;
    streak_incremented: boolean;
    achievement_unlocked_ids: number[];
    completed_at: string;
}

interface RewardHistoryProps {
    history: CompletionHistory[];
    isLoading?: boolean;
}

export function RewardHistory({ history, isLoading }: RewardHistoryProps) {
    if (isLoading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-neutral-200 rounded-xl" />
                ))}
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="text-center py-10 bg-neutral-50 rounded-2xl border border-neutral-100">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-neutral-200 rounded-full mb-3">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-neutral-400">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                </div>
                <p className="text-neutral-500">No reward history yet. Complete some tasks!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {history.map((item, index) => (
                <div
                    key={item.id}
                    className="relative pl-8 pb-4 group"
                >
                    {/* Timeline Connector */}
                    {index !== history.length - 1 && (
                        <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-neutral-200 group-hover:bg-primary-300 transition-colors" />
                    )}

                    {/* Status Icon */}
                    <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-white border-2 border-primary-500 flex items-center justify-center z-10">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-primary-600">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>

                    <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-sm hover:shadow-card transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-neutral-900 line-clamp-1">{item.task_title}</h4>
                            <span className="text-xs text-neutral-500 font-medium">
                                {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(item.completed_at))}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md text-xs font-bold">
                                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-3 h-3">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                                +{item.points_awarded} Points
                            </div>

                            {item.streak_incremented && (
                                <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-0.5 rounded-md text-xs font-bold">
                                    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="w-3 h-3">
                                        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 3.5 2.5 6 .5 2.5-1 4.5-3.5 6.5" />
                                        <path d="M17.5 14.5c.4 1.2-.6 2.5-2 2.5s-2-1-2-2.5c0-1.38.5-2 1-3 1.072-2.143.224-4.054 2-6 .5 2.5 2 3.5 2.5 6" />
                                    </svg>
                                    Streak Continued!
                                </div>
                            )}

                            {item.achievement_unlocked_ids.length > 0 && (
                                <div className="flex items-center gap-1.5 text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md text-xs font-bold">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                                        <path d="M4 22h16" />
                                        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                                        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                                        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                                    </svg>
                                    {item.achievement_unlocked_ids.length} Achievement Unlocked
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
