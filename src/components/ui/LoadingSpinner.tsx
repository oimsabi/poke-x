import { themeClasses } from '../../styles/theme';
import { cn } from '../../utils/cn';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  className?: string;
}

const sizeClasses = {
  small: 'w-8 h-8 border-2',
  medium: 'w-12 h-12 border-3',
  large: 'w-16 h-16 border-4',
};

const textSizeClasses = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-xl',
};

export const LoadingSpinner = ({ 
  size = 'medium', 
  message,
  className 
}: LoadingSpinnerProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div 
        className={cn(
          sizeClasses[size],
          'border-blue-500 border-t-transparent rounded-full animate-spin',
          message && 'mb-4'
        )}
      />
      {message && (
        <p className={cn(themeClasses.loading, textSizeClasses[size])}>
          {message}
        </p>
      )}
    </div>
  );
};
