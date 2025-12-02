import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

const variantClasses = {
  default: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
  primary: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  secondary: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
};

export const Badge = ({ children, className, variant = 'default' }: BadgeProps) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
