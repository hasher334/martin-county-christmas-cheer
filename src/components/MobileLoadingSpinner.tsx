
export const MobileLoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-christmas-cream to-background flex items-center justify-center mobile-optimized">
      <div className="text-center space-y-4">
        {/* Christmas-themed loading spinner */}
        <div className="relative mx-auto w-16 h-16">
          <div className="absolute inset-0 border-4 border-christmas-green-200 rounded-full animate-pulse"></div>
          <div className="absolute inset-2 border-4 border-christmas-red-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <div className="space-y-2">
          <p className="text-christmas-green-800 font-bold text-lg font-christmas">
            Spreading Christmas Cheer...
          </p>
          <p className="text-christmas-brown-600 text-sm font-nunito">
            Loading your magical experience
          </p>
        </div>
      </div>
    </div>
  );
};
