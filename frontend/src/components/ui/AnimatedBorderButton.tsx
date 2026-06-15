import React from 'react';
import { cn } from '../../lib/utils';

interface AnimatedBorderButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  containerClassName?: string;
  as?: 'button' | 'a';
  href?: string;
}

export const AnimatedBorderButton = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, AnimatedBorderButtonProps>(
  ({ children, className, containerClassName, as = 'button', href, ...props }, ref) => {
    const content = (
      <>
        {/* Animated Border Overlay - Spinning Conic Gradient */}
        <div className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
          <div className="absolute inset-[-100%] animate-spin [animation-duration:4s] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_50%,var(--color-accent-primary)_75%,var(--color-accent-electric)_100%)] opacity-100" />
        </div>
        
        {/* Inner Button Surface (covers the middle of the gradient so only the border shows) */}
        <div className="absolute inset-[1px] bg-surface rounded-[inherit] pointer-events-none transition-colors group-hover:bg-surface/80" />
        
        <div className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </div>
      </>
    );

    const baseClasses = cn(
      "relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium transition-colors rounded group",
      "text-text-primary",
      className
    );

    if (as === 'a' || href) {
      return (
        <a 
          href={href} 
          className={baseClasses} 
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...(props as any)}
        >
          {content}
        </a>
      );
    }

    return (
      <button 
        className={baseClasses} 
        ref={ref as React.Ref<HTMLButtonElement>}
        {...props}
      >
        {content}
      </button>
    );
  }
);
AnimatedBorderButton.displayName = 'AnimatedBorderButton';
