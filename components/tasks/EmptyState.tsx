interface EmptyStateProps {
  onCreateTask?: () => void;
  title?: string;
  description?: string;
  showImage?: boolean;
}

export function EmptyState({
  onCreateTask,
  title = 'No tasks yet. You\'re all set!',
  description = 'Create your first task to get started on your goals and start building your streak',
  showImage = true
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      {showImage && (
        <div className="relative mb-8">
          {/* Gradient circle background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full blur-3xl opacity-50 scale-150" />

          {/* Icon */}
          <div className="relative text-8xl animate-float">✨</div>
        </div>
      )}

      <h2 className="text-3xl font-bold text-neutral-800 mb-3 text-center">
        {title}
      </h2>

      <p className="text-lg text-neutral-600 mb-8 max-w-md text-center">
        {description}
      </p>

      {onCreateTask && (
        <button
          onClick={onCreateTask}
          className="px-8 py-4 button-primary text-lg"
        >
          + Create Your First Task
        </button>
      )}
    </div>
  );
}