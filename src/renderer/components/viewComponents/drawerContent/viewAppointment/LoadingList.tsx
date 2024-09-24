function LoadingList() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3, 4, 5].map(() => (
        <div
          className="w-full h-10 bg-gray-200 rounded-lg animate-pulse flex items-center justify-center font-medium text-gray-600 text-sm"
          style={{ animationDelay: '0.2s' }}
        >
          Loading...
        </div>
      ))}
    </div>
  );
}

export default LoadingList;
