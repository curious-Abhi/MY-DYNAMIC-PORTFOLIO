import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, defaultValue, value, ...props }, ref) => {
  // Determine the value to use based on defaultValue or value prop
  const inputValue = value !== null && value !== undefined ? value : defaultValue !== null && defaultValue !== undefined ? defaultValue : "";

  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      value={inputValue} // Use the determined value here
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
