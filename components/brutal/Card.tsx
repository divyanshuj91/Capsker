import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "yellow" | "pink" | "green" | "blue" | "purple";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const bgColors = {
      default: "bg-white",
      yellow: "bg-[#FFE800]/15",
      pink: "bg-[#FF66C4]/15",
      green: "bg-[#00F084]/15",
      blue: "bg-[#38BDF8]/15",
      purple: "bg-[#A78BFA]/15",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "border-2 border-black p-5 shadow-[4px_4px_0px_0px_#000000]",
          bgColors[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-xl font-black tracking-tight text-black", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";
