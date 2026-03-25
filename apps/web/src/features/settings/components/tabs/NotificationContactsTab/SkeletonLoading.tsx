export default function SkeletonLoading() {
    return (
        <div className="space-y-4 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-6 w-48 bg-gray-200 rounded" />
            <div className="h-9 w-36 bg-gray-200 rounded-md" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg" />
          ))}
        </div>
      );
}