"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number; // 0 to 100
  className?: string;
}

export default function Progress({ value, className }: ProgressProps) {
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={cn("h-[2px] w-full bg-[#1e293b] overflow-hidden", className)}>
      <motion.div
        className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
        initial={{ width: 0 }}
        animate={{ width: `${clampedValue}%` }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      />
    </div>
  );
}
