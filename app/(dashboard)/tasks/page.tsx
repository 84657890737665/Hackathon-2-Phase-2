'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRewardSystem } from '@/lib/hooks/useRewardSystem';
import { useAuth } from '@/components/AuthProvider';
import { taskApi, Task, ApiError } from '@/lib/api/taskService';
import { toast } from 'react-hot-toast';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'due_date' | 'priority' | 'created_at' | 'title'>('due_date');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddTitle, setQuickAddTitle] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [commandPaletteQuery, setCommandPaletteQuery] = useState('');

  const { useSession } = useAuth();
  const session = useSession();
  const { triggerCelebration, fetchProfile } = useRewardSystem();
  const quickAddRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }

      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setQuickAddOpen(false);
      }

      if (e.key === 'n' && e.ctrlKey) {
        e.preventDefault();
        setQuickAddOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus quick add when opened
  useEffect(() => {
    if (quickAddOpen && quickAddRef.current) {
      quickAddRef.current.focus();
    }
  }, [quickAddOpen]);

  // Fetch tasks
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

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddTitle.trim() || !session?.data?.user?.id) return;

    try {
      const newTask = await taskApi.createTask(session.data.user.id, {
        title: quickAddTitle,
        description: ''
      });
      setTasks([newTask, ...tasks]);
      setQuickAddTitle('');
      setQuickAddOpen(false);
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

  const handleToggleComplete = async (taskId: number) => {
    if (!session?.data?.user?.id) return;

    // Find the task to get current state
    const taskToToggle = tasks.find(t => t.id === taskId);
    if (!taskToToggle) return;

    try {
      const updatedTask = await taskApi.toggleTaskCompletion(
        session.data.user.id,
        taskId,
        !taskToToggle.completed
      );

      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ));

      if (updatedTask.completed) {
        triggerCelebration();
        fetchProfile(session.data.user.id);
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

  const handleDeleteTask = async (taskId: number) => {
    if (!session?.data?.user?.id) return;

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskApi.deleteTask(session.data.user.id, taskId);
        setTasks(tasks.filter(task => task.id !== taskId));
        if (selectedTask?.id === taskId) {
          setSelectedTask(null);
        }
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

  const handleUpdateTask = async (taskId: number, updates: Partial<Task>) => {
    if (!session?.data?.user?.id) return;

    try {
      const updatedTask = await taskApi.updateTask(session.data.user.id, taskId, updates);
      setTasks(tasks.map(task =>
        task.id === taskId ? updatedTask : task
      ));
      setSelectedTask(updatedTask);
      toast.success('Task updated successfully!');
    } catch (err) {
      console.error('Error updating task:', err);
      let errorMessage = 'Failed to update task';
      if (err instanceof ApiError) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    }
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      const matchesFilter = filter === 'all' ||
        (filter === 'active' && !task.completed) ||
        (filter === 'completed' && task.completed);

      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'due_date') {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === 'created_at') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  // Command palette options
  const commandPaletteOptions = [
    { id: 'create-task', label: 'Create new task', action: () => setQuickAddOpen(true) },
    { id: 'filter-active', label: 'Show active tasks', action: () => setFilter('active') },
    { id: 'filter-completed', label: 'Show completed tasks', action: () => setFilter('completed') },
    { id: 'filter-all', label: 'Show all tasks', action: () => setFilter('all') },
    { id: 'sort-due-date', label: 'Sort by due date', action: () => setSortBy('due_date') },
    { id: 'sort-priority', label: 'Sort by priority', action: () => setSortBy('priority') },
    { id: 'sort-created', label: 'Sort by creation date', action: () => setSortBy('created_at') },
    { id: 'sort-title', label: 'Sort by title', action: () => setSortBy('title') },
  ];

  const filteredCommands = commandPaletteQuery
    ? commandPaletteOptions.filter(option =>
      option.label.toLowerCase().includes(commandPaletteQuery.toLowerCase())
    )
    : commandPaletteOptions;

  return (
    <div className="flex h-screen bg-white">
      {/* Command Palette Overlay */}
      <AnimatePresence>
        {isCommandPaletteOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCommandPaletteOpen(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl border border-neutral-200 w-full max-w-md mx-4 overflow-hidden"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-neutral-200">
                <div className="flex items-center gap-3">
                  <span className="text-lg">⌨️</span>
                  <input
                    type="text"
                    value={commandPaletteQuery}
                    onChange={(e) => setCommandPaletteQuery(e.target.value)}
                    placeholder="Type a command or search..."
                    className="flex-1 h-10 px-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {filteredCommands.map(option => (
                  <button
                    key={option.id}
                    onClick={() => {
                      option.action();
                      setIsCommandPaletteOpen(false);
                      setCommandPaletteQuery('');
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Sidebar - Filters and Views */}
      <div className="w-64 bg-neutral-50 border-r border-neutral-200 flex flex-col">
        <div className="p-4 border-b border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">Taskflow</h2>
          <p className="text-sm text-neutral-600">Work Simplified</p>
        </div>

        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-neutral-700 mb-2">FILTERS</h3>
            <div className="space-y-1">
              <button
                onClick={() => setFilter('all')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${filter === 'all' ? 'bg-primary-100 text-primary-700' : 'hover:bg-neutral-100'}`}
              >
                All Tasks
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${filter === 'active' ? 'bg-primary-100 text-primary-700' : 'hover:bg-neutral-100'}`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${filter === 'completed' ? 'bg-primary-100 text-primary-700' : 'hover:bg-neutral-100'}`}
              >
                Completed
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-neutral-700 mb-2">SORT BY</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSortBy('due_date')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${sortBy === 'due_date' ? 'bg-primary-100 text-primary-700' : 'hover:bg-neutral-100'}`}
              >
                Due Date
              </button>
              <button
                onClick={() => setSortBy('priority')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${sortBy === 'priority' ? 'bg-primary-100 text-primary-700' : 'hover:bg-neutral-100'}`}
              >
                Priority
              </button>
              <button
                onClick={() => setSortBy('created_at')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${sortBy === 'created_at' ? 'bg-primary-100 text-primary-700' : 'hover:bg-neutral-100'}`}
              >
                Created Date
              </button>
              <button
                onClick={() => setSortBy('title')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${sortBy === 'title' ? 'bg-primary-100 text-primary-700' : 'hover:bg-neutral-100'}`}
              >
                Title
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-neutral-700 mb-2">STATISTICS</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Total Tasks</span>
                <span className="font-medium">{tasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Completed</span>
                <span className="font-medium">{tasks.filter(t => t.completed).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Completion Rate</span>
                <span className="font-medium">
                  {tasks.length > 0
                    ? `${Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%`
                    : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar - Search and Quick Actions */}
        <div className="p-4 border-b border-neutral-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-neutral-900">Tasks</h1>

              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="h-10 w-64 px-4 pl-10 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">🔍</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="px-3 py-2 text-sm text-neutral-600 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2"
              >
                <span>⌘K</span>
                <span>Command</span>
              </button>

              <button
                onClick={() => setQuickAddOpen(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
              >
                <span>+ New Task</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Add Bar */}
        <AnimatePresence>
          {quickAddOpen && (
            <motion.div
              className="p-4 border-b border-neutral-200 bg-gradient-to-r from-primary-50 to-white"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleCreateTask} className="flex gap-3">
                <input
                  ref={quickAddRef}
                  type="text"
                  value={quickAddTitle}
                  onChange={(e) => setQuickAddTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="flex-1 h-12 px-4 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setQuickAddOpen(false);
                    }
                  }}
                />
                <button
                  type="submit"
                  className="h-12 px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setQuickAddOpen(false)}
                  className="h-12 px-4 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task Table Header */}
        <div className="px-6 py-3 border-b border-neutral-200 bg-neutral-50 text-sm font-medium text-neutral-700 grid grid-cols-12 gap-4">
          <div className="col-span-1">Complete</div>
          <div className="col-span-5">Task</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-1">Tags</div>
          <div className="col-span-1">Actions</div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-neutral-500">
              Loading tasks...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              {error}
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">
              {searchQuery ? 'No tasks match your search' : 'No tasks found'}
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`p-4 grid grid-cols-12 gap-4 items-center hover:bg-neutral-50 transition-colors ${selectedTask?.id === task.id ? 'bg-primary-50' : ''
                    }`}
                  onClick={() => setSelectedTask(task)}
                >
                  {/* Checkbox */}
                  <div className="col-span-1 flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleComplete(task.id);
                      }}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${task.completed
                        ? 'bg-primary-600 border-primary-600'
                        : 'border-neutral-300 hover:border-primary-500'
                        }`}
                    >
                      {task.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {/* Task Title */}
                  <div className="col-span-5">
                    <div className={`font-medium ${task.completed ? 'line-through text-neutral-400' : 'text-neutral-900'}`}>
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-sm text-neutral-600 mt-1 line-clamp-1">
                        {task.description}
                      </div>
                    )}
                  </div>

                  {/* Priority */}
                  <div className="col-span-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.priority === 'urgent'
                      ? 'bg-red-100 text-red-800'
                      : task.priority === 'high'
                        ? 'bg-orange-100 text-orange-800'
                        : task.priority === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="col-span-2">
                    {task.due_date ? (
                      <div className="text-sm">
                        <div>{new Date(task.due_date).toLocaleDateString()}</div>
                        <div className="text-xs text-neutral-500">
                          {new Date(task.due_date) < new Date() && !task.completed
                            ? 'Overdue'
                            : 'Scheduled'}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-neutral-400">No due date</span>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="col-span-1">
                    {task.tags.length > 0 && (
                      <div className="flex gap-1">
                        {task.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-1 rounded text-xs bg-neutral-100 text-neutral-700">
                            {tag}
                          </span>
                        ))}
                        {task.tags.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-neutral-100 text-neutral-500">
                            +{task.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTask(task.id);
                      }}
                      className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Detail Panel */}
      {selectedTask && (
        <div className="w-96 border-l border-neutral-200 bg-white flex flex-col">
          <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
            <h3 className="font-semibold text-neutral-900">Task Details</h3>
            <button
              onClick={() => setSelectedTask(null)}
              className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="mb-6">
              <h4 className="text-lg font-medium text-neutral-900 mb-2">{selectedTask.title}</h4>
              {selectedTask.description && (
                <p className="text-neutral-700">{selectedTask.description}</p>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-neutral-700 mb-1">Priority</h5>
                <select
                  value={selectedTask.priority}
                  onChange={(e) => handleUpdateTask(selectedTask.id, { priority: e.target.value as any })}
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <h5 className="text-sm font-medium text-neutral-700 mb-1">Due Date</h5>
                <input
                  type="date"
                  value={selectedTask.due_date ? new Date(selectedTask.due_date).toISOString().split('T')[0] : ''}
                  onChange={(e) => handleUpdateTask(selectedTask.id, { due_date: e.target.value })}
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <h5 className="text-sm font-medium text-neutral-700 mb-1">Tags</h5>
                <input
                  type="text"
                  value={selectedTask.tags.join(', ')}
                  onChange={(e) => handleUpdateTask(selectedTask.id, { tags: e.target.value.split(',').map(tag => tag.trim()) })}
                  placeholder="Enter tags separated by commas"
                  className="w-full h-10 px-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <h5 className="text-sm font-medium text-neutral-700 mb-1">Status</h5>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${selectedTask.completed
                    ? 'bg-success-100 text-success-800'
                    : 'bg-warning-100 text-warning-800'
                    }`}>
                    {selectedTask.completed ? 'Completed' : 'In Progress'}
                  </span>
                  <button
                    onClick={() => handleToggleComplete(selectedTask.id)}
                    className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                  >
                    {selectedTask.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                  </button>
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium text-neutral-700 mb-1">Created</h5>
                <p className="text-sm text-neutral-600">
                  {new Date(selectedTask.created_at).toLocaleString()}
                </p>
              </div>

              <div>
                <h5 className="text-sm font-medium text-neutral-700 mb-1">Updated</h5>
                <p className="text-sm text-neutral-600">
                  {new Date(selectedTask.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-neutral-200">
            <button
              onClick={() => handleDeleteTask(selectedTask.id)}
              className="w-full py-2.5 px-4 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
            >
              Delete Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
}