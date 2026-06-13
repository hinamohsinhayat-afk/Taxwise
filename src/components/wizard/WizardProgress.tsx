"use client";

import React from "react";
import Progress from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  stepNames: string[];
}

export default function WizardProgress({ currentStep, totalSteps, stepNames }: WizardProgressProps) {
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="space-y-4">
      {/* Progress bar at top */}
      <Progress value={progressPercent} />

      {/* Step dots and label */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {stepNames.map((_, index) => {
            const stepNum = index + 1;
            const isActive = currentStep === stepNum;
            const isCompleted = currentStep > stepNum;

            return (
              <div
                key={index}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  {
                    "bg-[var(--primary)]": isActive,
                    "bg-[var(--primary)] opacity-50": isCompleted,
                    "bg-[var(--surface)] border border-[var(--border)]": !isActive && !isCompleted,
                  }
                )}
              />
            );
          })}
        </div>
        <span className="text-[13px] text-[var(--text-muted)]">
          Step {currentStep} of {totalSteps} — {stepNames[currentStep - 1]}
        </span>
      </div>
    </div>
  );
}
