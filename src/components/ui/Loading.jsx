import { cn } from "@/utils/cn";

const Loading = ({ className, type = "cards", count = 6, columns = 4 }) => {
  if (type === "board-detail") {
    return (
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-6 shimmer">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
          <div className="h-10 bg-gray-300 rounded w-32"></div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="h-10 bg-gray-200 rounded w-24 shimmer"></div>
          <div className="h-10 bg-gray-200 rounded w-32 shimmer"></div>
          <div className="h-10 bg-gray-200 rounded w-28 shimmer"></div>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-card border shimmer">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

if (type === "post-detail") {
    return (
      <div className={cn("max-w-7xl mx-auto", className)}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Back Navigation */}
            <div className="flex items-center gap-4 shimmer">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
              <div className="h-6 bg-gray-200 rounded w-40"></div>
            </div>

            {/* Post Header */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-card border shimmer">
              <div className="flex gap-4 md:gap-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-card border shimmer">
              <div className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-card border shimmer">
              <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-white rounded-lg p-6 shadow-card border shimmer sticky top-6">
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

if (type === "kanban") {
    return (
      <div className={cn("grid gap-6", `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`, className)}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div key={colIndex} className="bg-white rounded-xl border-2 border-gray-200">
            {/* Column Header Skeleton */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-200 rounded shimmer"></div>
                  <div className="h-5 bg-gray-200 rounded w-24 shimmer"></div>
                </div>
                <div className="w-8 h-6 bg-gray-200 rounded shimmer"></div>
              </div>
            </div>
            {/* Column Cards Skeleton */}
            <div className="p-4 space-y-3">
              {Array.from({ length: 3 }).map((_, cardIndex) => (
                <div key={cardIndex} className="bg-white rounded-lg border-2 border-gray-200 p-4 shimmer">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-5 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-2 bg-gray-200 rounded w-full mb-4"></div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-6", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-6 shadow-card border shimmer"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="flex gap-2 mt-4">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;