'use client';

import { TaskCard } from './TaskCard';
import { AnimatePresence } from 'framer-motion';

import { Task } from '@/lib/api/taskService';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit?: (task: Task) => void;
  userId: number;
}

export function TaskList({ tasks, onToggleComplete, onDelete, onEdit, userId }: TaskListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <TaskCard
            id={task.id}
            title={task.title}
            description={task.description}
            completed={task.completed}
            createdAt={new Date(task.created_at).toLocaleDateString()}
            userId={userId}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onEdit={onEdit || (() => { })}
          />
        </div>
      ))}
    </div>
  );
}