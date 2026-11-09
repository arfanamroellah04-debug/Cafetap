import React from 'react';

export function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse" aria-label="Memuat menu digital...">
      {/* Skeleton Banner */}
      <div className="h-32 rounded-2xl skeleton-shimmer border border-stone-200/60" />

      {/* Skeleton Categories */}
      <div className="flex items-center gap-2 overflow-hidden py-1">
        <div className="h-9 w-20 rounded-xl skeleton-shimmer shrink-0" />
        <div className="h-9 w-32 rounded-xl skeleton-shimmer shrink-0" />
        <div className="h-9 w-28 rounded-xl skeleton-shimmer shrink-0" />
        <div className="h-9 w-36 rounded-xl skeleton-shimmer shrink-0" />
      </div>

      {/* Skeleton Menu Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="flex flex-col bg-white rounded-2xl overflow-hidden border border-stone-200/60 shadow-xs"
          >
            <div className="aspect-4/3 w-full skeleton-shimmer" />
            <div className="p-3.5 space-y-2">
              <div className="h-4 w-3/4 rounded-md skeleton-shimmer" />
              <div className="h-3 w-full rounded-md skeleton-shimmer" />
              <div className="pt-2 flex justify-between items-center">
                <div className="h-4 w-16 rounded-md skeleton-shimmer" />
                <div className="h-7 w-14 rounded-lg skeleton-shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
