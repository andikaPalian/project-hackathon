import { forwardRef } from 'react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';

export const GradientButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          'gradient-primary text-primary-foreground shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-105',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

GradientButton.displayName = 'GradientButton';