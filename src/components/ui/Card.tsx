import { themeClasses } from '../../styles/theme';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className, onClick }: CardProps) => {
  return (
    <div
      className={cn(
        themeClasses.card,
        'rounded-lg shadow-lg overflow-hidden',
        onClick && 'cursor-pointer hover:shadow-xl transition-shadow',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
