import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { TeamStatus } from "@/types";

const badgeVariants = cva(
  "inline-flex items-center border-2 border-black px-2.5 py-0.5 text-xs font-black uppercase tracking-wider select-none shadow-[2px_2px_0px_0px_#000000]",
  {
    variants: {
      variant: {
        default: "bg-white text-black",
        unconfirmed: "bg-[#FB923C] text-black",
        contacted: "bg-[#38BDF8] text-black",
        confirmed: "bg-[#00F084] text-black",
        checked_in: "bg-[#00F084] text-black font-extrabold",
        waitlisted: "bg-[#FB923C] text-black",
        disqualified: "bg-[#FF66C4] text-black",
        yellow: "bg-[#FFE800] text-black",
        purple: "bg-[#A78BFA] text-black",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export function StatusBadge({ status }: { status: TeamStatus }) {
  const variantMap: Record<TeamStatus, VariantProps<typeof badgeVariants>["variant"]> = {
    UNCONFIRMED: "unconfirmed",
    CONTACTED: "contacted",
    CONFIRMED: "confirmed",
    CHECKED_IN: "checked_in",
    WAITLISTED: "waitlisted",
    DISQUALIFIED: "disqualified",
  };

  const labelMap: Record<TeamStatus, string> = {
    UNCONFIRMED: "Unconfirmed",
    CONTACTED: "Contacted",
    CONFIRMED: "Confirmed",
    CHECKED_IN: "Checked In",
    WAITLISTED: "Waitlisted",
    DISQUALIFIED: "Disqualified",
  };

  return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>;
}
