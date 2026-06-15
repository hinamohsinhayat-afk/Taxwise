"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import Button from "@/components/ui/button";
import { Product } from "@/lib/types";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  highlighted?: boolean;
}

const featureLabels: Record<keyof Product["supports"], string> = {
  salaryIncome: "Salary / Employment (T4)",
  studentIncome: "Student Tuition (T2202)",
  medicalExpenses: "Medical Deductions",
  donations: "Charitable Donations",
  employmentExpenses: "Employment Expenses",
  investmentIncome: "Investment Income",
  capitalGains: "Capital Gains",
  foreignIncome: "Foreign Income",
  rentalIncome: "Rental Income",
  freelanceIncome: "Freelance Income (T2125)",
  gigWorkIncome: "Gig Work",
  businessExpenses: "Business Expenses",
  homeOfficeExpenses: "Home Office",
  vehicleExpenses: "Vehicle Expenses",
  expertHelp: "Expert Help",
  fullService: "Full Service",
  corporateFiling: "Corporate Filing",
  nilCorporateReturn: "Nil Corporate Return",
};

export default function ProductCard({ product, highlighted = false }: ProductCardProps) {
  const [showAll, setShowAll] = useState(false);
  
  const supportedFeatures = Object.entries(product.supports)
    .filter(([, supported]) => supported) as [keyof Product["supports"], boolean][];
  
  const displayFeatures = showAll ? supportedFeatures : supportedFeatures.slice(0, 5);
  const hasMore = supportedFeatures.length > 5;

  return (
    <motion.div
      whileHover={{ scale: 1.06, y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`relative bg-[var(--surface)] border rounded-[16px] p-7 transition-shadow duration-300 hover:border-[var(--border-hover)] hover:shadow-[0_0_30px_rgba(59,130,246,0.35),0_0_60px_rgba(34,211,238,0.15)] ${
        highlighted 
          ? "border-[var(--primary)] shadow-[0_0_40px_rgba(59,130,246,0.2)]" 
          : "border-[var(--border)]"
      }`}
    >
      {/* Most Popular badge */}
      {highlighted && (
        <div className="absolute -top-3 left-6 px-3 py-1 bg-[var(--primary)] text-white text-[11px] font-medium tracking-[0.08em] uppercase rounded-[6px]">
          Most Popular
        </div>
      )}

      {/* Price badge top right */}
      <div className={`absolute top-6 right-6 px-2.5 py-1 rounded-[6px] text-[12px] font-medium ${
        product.price === 0 
          ? "bg-[var(--accent-soft)] text-[var(--accent)] border border-[rgba(34,211,238,0.35)]" 
          : "bg-[rgba(59,130,246,0.15)] text-[#93c5fd] border border-[rgba(59,130,246,0.35)]"
      }`}>
        {product.price === 0 ? "Free" : `$${product.price}`}
      </div>

      {/* Product name */}
      <h3 className="text-[20px] font-semibold text-[var(--text-primary)] pr-16">
        {product.name}
      </h3>

      {/* Best for label */}
      {product.bestFor.length > 0 && (
        <div className="mt-3">
          <span className="text-[12px] font-medium tracking-[0.08em] uppercase text-[var(--text-muted)]">
            Best for
          </span>
          <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
            {product.bestFor[0]}
          </p>
        </div>
      )}

      {/* Divider */}
      <div className="my-5 border-t border-[var(--border)]" />

      {/* Features checklist */}
      <div className="space-y-2.5">
        {displayFeatures.map(([key]) => (
          <div key={key} className="flex items-center gap-2.5">
            <Check className="h-4 w-4 text-[var(--success)] shrink-0" />
            <span className="text-[14px] text-[var(--text-secondary)]">
              {featureLabels[key]}
            </span>
          </div>
        ))}
        
        {hasMore && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="flex items-center gap-1 text-[13px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors mt-2"
          >
            <span>Show more</span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* CTA Button */}
      <div className="mt-6 pt-5 border-t border-[var(--border)]">
        <Link href={`/products/${product.id}`} className="block">
          <Button variant="ghost" className="w-full">
            Learn More
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
