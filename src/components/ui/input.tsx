import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.ComponentProps<"input"> &
  Partial<{
    startAdornment: React.ReactNode;
    endAdornment: React.ReactNode;
  }>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startAdornment, endAdornment, ...props }, ref) => {
    // Ensure startAdornment and endAdornment are valid React nodes
    if (startAdornment && !React.isValidElement(startAdornment)) {
      console.error("startAdornment must be a valid React element");
      return null;
    }
    if (endAdornment && !React.isValidElement(endAdornment)) {
      console.error("endAdornment must be a valid React element");
      return null;
    }

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-12 w-full border border-gray-300 border-input bg-background px-4 py-3 text-md ring-offset-background file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-100",
            className
          )}
          ref={ref}
          {...props}
        />
        {startAdornment && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            {startAdornment}
          </div>
        )}
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {endAdornment}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
