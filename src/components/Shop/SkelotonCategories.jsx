const SkeletonCategories = () => {
  return (
    <div className="w-full flex justify-center items-center p-6">
      <div className="relative w-[80%] mx-auto md:mx-20">
        <div className="flex overflow-hidden justify-center space-x-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="w-40 p-2 mx-2">
              <div className="block bg-gray-200 rounded-lg shadow-md">
                <div className="relative h-36 bg-gray-300 rounded-md"></div>
                <div className="h-4 bg-gray-300 my-2 w-3/4 mx-auto rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonCategories;
