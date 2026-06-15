"use client";

import React from "react";
import { motion } from "framer-motion";
import ComparisonTable from "@/components/compare/ComparisonTable";

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] pt-6 pb-16 md:pt-8 md:pb-24 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <h1 className="text-[40px] font-semibold tracking-tight text-[var(--text-primary)]">
            Compare Plans
          </h1>
          <p className="mt-3 text-[18px] text-[var(--text-secondary)] max-w-xl">
            See which features each plan includes, side by side.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <ComparisonTable />
      </div>
    </div>
  );
}
