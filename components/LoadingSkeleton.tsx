export function NewsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 animate-pulse">
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="h-5 w-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
        <div className="ml-auto h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      <div className="space-y-2 mb-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
      </div>
      <div className="space-y-1.5 mb-3">
        <div className="h-3 bg-gray-100 dark:bg-gray-700/60 rounded w-full" />
        <div className="h-3 bg-gray-100 dark:bg-gray-700/60 rounded w-3/4" />
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-5 w-12 bg-gray-100 dark:bg-gray-700/60 rounded-full" />
        ))}
      </div>
    </div>
  );
}

export function AnalysisPanelSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden animate-pulse">
      <div className="h-20 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-900 dark:to-indigo-900" />
      <div className="flex border-b border-gray-100 dark:border-gray-700">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex-1 h-10 bg-gray-50 dark:bg-gray-700/30 border-r border-gray-100 dark:border-gray-700 last:border-0" />
        ))}
      </div>
      <div className="p-5 space-y-4">
        <div className="h-20 bg-gray-100 dark:bg-gray-700/50 rounded-xl" />
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 dark:bg-gray-700/50 rounded-xl" />
          ))}
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-gray-100 dark:bg-gray-700/50 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
