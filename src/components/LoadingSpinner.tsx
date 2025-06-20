
import { Snowflake } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner = ({ message = "Loading...", size = 'md' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-16 w-16', 
    lg: 'h-24 w-24'
  };

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className={`animate-spin rounded-full border-b-2 border-christmas-green-600 ${sizeClasses[size]}`}></div>
        <Snowflake className={`absolute inset-0 m-auto text-christmas-green-400 ${sizeClasses[size]} animate-pulse`} />
      </div>
      <p className="mt-4 text-christmas-brown-600 text-center">{message}</p>
    </div>
  );
};
