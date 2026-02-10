'use client';

import { useState, useEffect } from 'react';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskListSkeleton } from '@/components/tasks/TaskListSkeleton';
import { EmptyState } from '@/components/tasks/EmptyState';
import { TaskCreateModal } from '@/components/tasks/TaskCreateModal';
import { taskApi, Task, ApiError } from '@/lib/api/taskService';
import { useAuth } from '@/components/AuthProvider';
import { useRewardSystem } from '@/lib/hooks/useRewardSystem';
import { toast } from 'react-hot-toast';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { useSession } = useAuth();
  const session = useSession();
  const sessionLoading = false; // Synchronous session for now

  useEffect(() => {
    if (session?.data?.user) {
      fetchTasks();
      useRewardSystem.getState().fetchProfile(session.data.user.id);
    }
  }, [session]);

  const fetchTasks = async () => {
    if (!session?.data?.user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await taskApi.getTasks(session.data.user.id);
      setTasks(fetchedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      let errorMessage = 'Failed to load tasks';

      if (err instanceof ApiError) {
        errorMessage = err.message;
        if (err.statusCode === 401) {
          window.location.href = '/signin';
          return;
        }
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (title: string, description: string) => {
    if (!session?.data?.user?.id) return;

    try {
      const newTask = await taskApi.createTask(session.data.user.id, { title, description });
      setTasks([newTask, ...tasks]);
      toast.success('Task created successfully!');
    } catch (err) {
      console.error('Error creating task:', err);
      let errorMessage = 'Failed to create task';
      if (err instanceof ApiError) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    }
  };

  const handleToggleComplete = async (id: number) => {
    if (!session?.data?.user?.id) return;

    try {
      const updatedTask = await taskApi.toggleTaskCompletion(session.data.user.id, id);
      setTasks(tasks.map(task =>
        task.id === id ? updatedTask : task
      ));

      const taskTitle = tasks.find(t => t.id === id)?.title || 'Task';
      toast.success(`${taskTitle} ${updatedTask.completed ? 'completed' : 'marked as incomplete'}!`);

      // Refresh gamification profile from server
      if (updatedTask.completed) {
        useRewardSystem.getState().fetchProfile(session.data.user.id);
      }
    } catch (err) {
      console.error('Error toggling task completion:', err);
      let errorMessage = 'Failed to update task';
      if (err instanceof ApiError) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!session?.data?.user?.id) return;

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.deleteTask(session.data.user.id, id);
        setTasks(tasks.filter(task => task.id !== id));
        toast.success('Task deleted successfully!');
      } catch (err) {
        console.error('Error deleting task:', err);
        let errorMessage = 'Failed to delete task';
        if (err instanceof ApiError) {
          errorMessage = err.message;
        }
        toast.error(errorMessage);
      }
    }
  };

  if (sessionLoading) {
    return <TaskListSkeleton />;
  }

  if (!session?.data?.user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Please sign in to view your tasks</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            All Tasks
          </h1>
          <p className="text-neutral-600">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 button-primary"
        >
          + New Task
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <TaskListSkeleton />
      ) : tasks.length === 0 ? (
        <EmptyState onCreateTask={() => setIsCreateModalOpen(true)} />
      ) : (
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
        />
      )}

      <TaskCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateTask}
      />
    </div>
  );
}