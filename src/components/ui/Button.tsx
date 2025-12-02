import { ButtonHTMLAttributes } from 'react';
import { themeClasses } from '../../styles/theme';
import { cn } from '../../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

const sizeClasses = {
  small: 'px-3 py-1.5 text-sm',
  medium: 'px-4 py-2 text-base',
  large: 'px-6 py-3 text-lg',
};

const iconSizeClasses = {
  small: 'p-2',
  medium: 'p-3',
  large: 'p-4',
};

export const Button = ({ 
  variant = 'primary', 
  size = 'medium',
  className,
  children,
  ...props 
}: ButtonProps) => {
  const baseClasses = 'rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500';
  const variantClass = themeClasses.button[variant];
  const sizeClass = variant === 'icon' ? iconSizeClasses[size] : sizeClasses[size];

  return (
    <button
      className={cn(baseClasses, variantClass, sizeClass, className)}
      {...props}
    >
      {children}
    </button>
  );
};
