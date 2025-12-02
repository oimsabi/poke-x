import { themeClasses } from '../../styles/theme';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({ message, icon, className }: EmptyStateProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8', className)}>
      {icon && <div className="mb-4">{icon}</div>}
      <p className={cn(themeClasses.text.secondary, 'text-xl')}>
        {message}
      </p>
    </div>
  );
};
