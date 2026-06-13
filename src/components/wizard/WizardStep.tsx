"use client";

import React from "react";
import { motion } from "framer-motion";

interface WizardStepProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function WizardStep({ title, subtitle, children }: WizardStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h2 className="text-[24px] font-semibold tracking-tight text-[var(--text-primary)]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[15px] text-[var(--text-secondary)]">
            {subtitle}
          </p>
        )}
      </div>

      <div className="pt-2">{children}</div>
    </motion.div>
  );
}
