export function TaskListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-white rounded-xl p-5 shadow-card">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-6 h-6 rounded-md bg-neutral-200 animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:1000px_100%]" />
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-neutral-200 rounded animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:1000px_100%]" />
            </div>
          </div>
          <div className="ml-9 space-y-2">
            <div className="h-4 bg-neutral-200 rounded animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:1000px_100%]" />
            <div className="h-4 bg-neutral-200 rounded w-2/3 animate-shimmer bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:1000px_100%]" />
          </div>
        </div>
      ))}
    </div>
  );
}