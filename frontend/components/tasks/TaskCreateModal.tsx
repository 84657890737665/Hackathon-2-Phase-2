'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TaskCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, description: string) => void;
}

export function TaskCreateModal({ isOpen, onClose, onCreate }: TaskCreateModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    await onCreate(title, description);
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        />

        {/* Modal */}
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
            <h2 className="text-2xl font-bold text-neutral-900">
              Create New Task
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
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
                onClick={onClose}
                className="flex-1 h-12 px-6 text-neutral-600 font-medium rounded-lg hover:bg-neutral-100 transition-all"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting || !title.trim()}
                className={cn(
                  "flex-1 h-12 px-6 button-primary",
                  (isSubmitting || !title.trim()) && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSubmitting ? 'Creating...' : 'Create Task'}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}