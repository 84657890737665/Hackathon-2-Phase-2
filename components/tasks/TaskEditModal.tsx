'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { taskApi, Task, ApiError } from '@/lib/api/taskService';
import { toast } from 'react-hot-toast';

interface TaskEditModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}

export function TaskEditModal({ task, isOpen, onClose, onSave }: TaskEditModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when task changes or modal opens
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!task) return;
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    setIsLoading(true);

    try {
      // Create updated task object
      const updatedTask = {
        ...task,
        title: title.trim(),
        description: description.trim()
      };

      // Call the onSave callback which is handled by the parent component
      onSave(updatedTask);
      toast.success('Task updated successfully!');
      handleClose();
    } catch (err) {
      console.error('Error updating task:', err);
      let errorMessage = 'Failed to update task';
      if (err instanceof ApiError) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  if (!isOpen || !task) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        />
        
        <motion.div 
          className="relative bg-white rounded-2xl shadow-modal max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8"
          initial={{ 
            opacity: 0, 
            scale: 0.95,
            y: 20
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: 0
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.95,
            y: 20
          }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 300,
            duration: 0.35
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-neutral-900">Edit Task</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              ✕
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Task Title *
              </label>
              <motion.input
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full h-12 px-4 rounded-lg border-2 border-neutral-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Description (optional)
              </label>
              <motion.textarea
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 focus:border-primary-400 focus:ring-4 focus:ring-primary-100 transition-all outline-none resize-none"
              />
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-3 pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1 h-12 px-6 text-neutral-600 font-medium rounded-lg hover:bg-neutral-100 transition-all disabled:opacity-50"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading || !title.trim()}
                className={`flex-1 h-12 px-6 button-primary ${(isLoading || !title.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Updating...' : 'Update Task'}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}