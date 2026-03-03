type LoadingIndicatorProps = {
  rows?: number;
};

export function LoadingIndicator({ rows = 5 }: LoadingIndicatorProps) {
  return (
    <div className="w-full">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-gray-100 rounded-lg h-16 mb-3 px-4 flex items-center gap-4"
        >
          {/* Name column ~40% */}
          <div className="h-4 bg-gray-200 rounded w-[40%]" />
          {/* Category column ~20% */}
          <div className="h-4 bg-gray-200 rounded w-[20%]" />
          {/* Stock column ~10% */}
          <div className="h-4 bg-gray-200 rounded w-[10%]" />
          {/* Price column ~15% */}
          <div className="h-4 bg-gray-200 rounded w-[15%]" />
          {/* Actions column ~15% */}
          <div className="h-4 bg-gray-200 rounded w-[15%]" />
        </div>
      ))}
    </div>
  );
}
