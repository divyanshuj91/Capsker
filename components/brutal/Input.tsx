import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full border-2 border-black bg-white px-3 py-2 text-sm font-medium text-black placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFE800] focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 shadow-[2px_2px_0px_0px_#000000]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
