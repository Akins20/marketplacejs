const SkeletonCard = () => {
  return (
    <div className="w-64 bg-gray-200 dark:bg-gray-700 animate-pulse shadow-lg rounded-2xl overflow-hidden">
      <div className="h-60 bg-gray-300 dark:bg-gray-600"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
