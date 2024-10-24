import React, { forwardRef, ReactNode } from "react";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`h-full overflow-y-auto ${className}`} // Added height and overflow styles
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
