"use client";

import React, { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart"> {
  variant?: "primary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50",
          {
            // Primary Variant
            "bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] hover:shadow-[0_0_24px_rgba(59,130,246,0.45)]":
              variant === "primary",
            // Ghost Variant
            "bg-transparent border border-[rgba(255,255,255,0.12)] text-[var(--text-primary)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.24)]":
              variant === "ghost",
            // Destructive Variant
            "bg-[rgba(248,113,113,0.12)] border border-[rgba(248,113,113,0.35)] text-[var(--error)] hover:bg-[rgba(248,113,113,0.18)]":
              variant === "destructive",
          },
          {
            "px-3 py-2 text-xs rounded-[8px]": size === "sm",
            "px-6 py-3 text-sm rounded-[10px]": size === "md",
            "px-8 py-4 text-base rounded-[10px]": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
