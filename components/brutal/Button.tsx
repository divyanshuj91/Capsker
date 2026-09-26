import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-bold tracking-wide transition-all border-2 border-black select-none disabled:opacity-50 disabled:pointer-events-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
  {
    variants: {
      variant: {
        primary: "bg-[#FFE800] text-black shadow-[4px_4px_0px_0px_#000] hover:bg-[#ffe31a]",
        secondary: "bg-white text-black shadow-[4px_4px_0px_0px_#000] hover:bg-neutral-100",
        danger: "bg-[#FF66C4] text-black shadow-[4px_4px_0px_0px_#000] hover:bg-[#ff4da6]",
        success: "bg-[#00F084] text-black shadow-[4px_4px_0px_0px_#000] hover:bg-[#00d676]",
        info: "bg-[#38BDF8] text-black shadow-[4px_4px_0px_0px_#000] hover:bg-[#22aef0]",
        purple: "bg-[#A78BFA] text-black shadow-[4px_4px_0px_0px_#000] hover:bg-[#906efa]",
        outline: "bg-transparent text-black border-2 border-black hover:bg-black/5",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
