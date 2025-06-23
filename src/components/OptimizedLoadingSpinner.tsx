
interface OptimizedLoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const OptimizedLoadingSpinner = ({ 
  message = "Loading...", 
  size = 'md' 
}: OptimizedLoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Simplified spinner */}
        <div className={`animate-spin rounded-full border-2 border-christmas-green-200 border-t-christmas-green-600 ${sizeClasses[size]}`}></div>
      </div>
      <p className="mt-4 text-christmas-brown-600 text-center text-sm">{message}</p>
    </div>
  );
};
