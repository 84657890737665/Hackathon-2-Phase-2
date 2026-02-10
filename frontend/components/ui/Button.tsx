import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export function Button({ 
  children, 
  className, 
  variant = 'default', 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-all',
        variant === 'default' && 'bg-gradient-button text-white hover:shadow-md',
        variant === 'outline' && 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}