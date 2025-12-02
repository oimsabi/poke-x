import { themeClasses } from '../../styles/theme';
import { cn } from '../../utils/cn';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage = ({ message, className }: ErrorMessageProps) => {
  return (
    <div className={cn('flex items-center justify-center p-4', className)}>
      <p className={cn(themeClasses.error, 'text-xl')}>
        Error: {message}
      </p>
    </div>
  );
};
