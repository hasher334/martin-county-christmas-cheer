
interface SimpleLoadingSpinnerProps {
  message?: string;
}

export const SimpleLoadingSpinner = ({ 
  message = "Loading..." 
}: SimpleLoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-christmas-green-200 border-t-christmas-green-600"></div>
      <p className="mt-4 text-christmas-brown-600 text-center text-sm">{message}</p>
    </div>
  );
};
