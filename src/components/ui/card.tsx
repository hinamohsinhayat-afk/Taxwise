"use client";

import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps
  extends Omit<HTMLMotionProps<"div">, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  hoverEffect?: boolean;
  variant?: "default" | "glass";
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = true, variant = "default", children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={hoverEffect ? { y: -2 } : undefined}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "rounded-[16px] p-7 transition-all duration-200",
          {
            // Default variant
            "bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--border-hover)]":
              variant === "default",
            // Glass variant (for hero only)
            "bg-[rgba(255,255,255,0.03)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.08)]":
              variant === "glass",
          },
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = "Card";

export default Card;
