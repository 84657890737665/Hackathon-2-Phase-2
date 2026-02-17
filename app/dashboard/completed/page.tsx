'use client';

import { useState, useEffect } from 'react';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskListSkeleton } from '@/components/tasks/TaskListSkeleton';
import { EmptyState } from '@/components/tasks/EmptyState';
import { taskApi, Task, ApiError } from '@/lib/api/taskService';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'react-hot-toast';

export default function CompletedTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { useSession } = useAuth();
  const session = useSession();
  const sessionLoading = false;

  useEffect(() => {
    if (session?.data?.user) {
      fetchTasks();
    }
  }, [session]);

  const fetchTasks = async () => {
    if (!session?.data?.user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await taskApi.getTasks(session.data.user.id);
      // Filter to only completed tasks
      const completedTasks = fetchedTasks.filter(task => task.completed);
      setTasks(completedTasks);
    } catch (err) {
      console.error('Error fetching completed tasks:', err);
      let errorMessage = 'Failed to load completed tasks';

      if (err instanceof ApiError) {
        errorMessage = err.message;
        if (err.statusCode === 401) {
          // Redirect to login if unauthorized
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

  const handleToggleComplete = async (id: number) => {
    if (!session?.data?.user?.id) return;

    try {
      // Toggle the task back to incomplete
      const updatedTask = await taskApi.toggleTaskCompletion(session.data.user.id, id);
      // Refresh the list to reflect the change
      fetchTasks();

      const taskTitle = tasks.find(t => t.id === id)?.title || 'Task';
      toast.success(`${taskTitle} marked as incomplete!`);
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
        // Refresh the list to reflect the change
        fetchTasks();
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

  // Show loading state while checking session
  if (sessionLoading) {
    return <TaskListSkeleton />;
  }

  // Redirect to login if not authenticated
  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p>Please sign in to view your completed tasks</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
            Completed Tasks
          </h1>
          <p className="text-neutral-600">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} completed
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {loading ? (
        <TaskListSkeleton />
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No completed tasks yet"
          description="Complete tasks to see them appear here"
          showImage={false}
        />
      ) : (
        <TaskList
          tasks={tasks}
          onToggleComplete={handleToggleComplete}
          onDelete={handleDeleteTask}
          userId={session.data.user.id}
        />
      )}
    </div>
  );
}