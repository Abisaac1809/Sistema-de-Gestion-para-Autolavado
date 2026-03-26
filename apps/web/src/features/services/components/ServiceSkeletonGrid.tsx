export function ServiceSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg border bg-white p-4 animate-pulse flex flex-col gap-3"
        >
          {/* Name + badge row */}
          <div className="flex items-start justify-between gap-2">
            <div className="h-5 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded-full shrink-0" />
          </div>

          {/* Description */}
          <div className="h-4 w-full bg-gray-200 rounded" />

          {/* Price */}
          <div className="h-6 w-20 bg-gray-200 rounded" />

          {/* Button row */}
          <div className="h-8 w-full bg-gray-200 rounded pt-1" />
        </div>
      ))}
    </div>
  );
}
