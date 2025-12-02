import { themeClasses } from '../../styles/theme';
import { cn } from '../../utils/cn';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <div className={cn(themeClasses.page, 'overflow-hidden flex flex-col', className)}>
      {children}
    </div>
  );
};
