"use client";

import React, { useState, useEffect } from "react";
import { Check, X, ArrowRight } from "lucide-react";
import { products } from "@/lib/products";
import { Product } from "@/lib/types";
import Link from "next/link";
import Button from "@/components/ui/button";

const features: { key: keyof Product["supports"]; label: string; category: string }[] = [
  { key: "salaryIncome", label: "Salary / Employment (T4)", category: "Income Sources" },
  { key: "studentIncome", label: "Student Tuition (T2202)", category: "Income Sources" },
  { key: "investmentIncome", label: "Investments & Dividends", category: "Income Sources" },
  { key: "capitalGains", label: "Capital Gains", category: "Income Sources" },
  { key: "rentalIncome", label: "Rental Property Income", category: "Income Sources" },
  { key: "foreignIncome", label: "Foreign Income & Assets", category: "Income Sources" },
  { key: "freelanceIncome", label: "Freelance Income (T2125)", category: "Income Sources" },
  { key: "gigWorkIncome", label: "Gig Work (Uber, Skip)", category: "Income Sources" },
  
  { key: "medicalExpenses", label: "Medical Deductions", category: "Deductions" },
  { key: "donations", label: "Charitable Donations", category: "Deductions" },
  { key: "employmentExpenses", label: "Employment Expenses", category: "Deductions" },
  { key: "businessExpenses", label: "Business Write-offs", category: "Deductions" },
  { key: "homeOfficeExpenses", label: "Home Office Claims", category: "Deductions" },
  { key: "vehicleExpenses", label: "Vehicle Claims", category: "Deductions" },
  
  { key: "expertHelp", label: "Live Expert Chat/Video", category: "Expert & Filings" },
  { key: "fullService", label: "Full Expert Filing Service", category: "Expert & Filings" },
  { key: "corporateFiling", label: "T2 Corporate Returns", category: "Expert & Filings" },
  { key: "nilCorporateReturn", label: "Nil Corporate Returns", category: "Expert & Filings" },
];

export default function ComparisonTable() {
  const [recommendedId, setRecommendedId] = useState<string | null>(null);

  useEffect(() => {
    const savedId = localStorage.getItem("taxwise_recommended_id");
    if (savedId) {
      setRecommendedId(savedId);
    }
  }, []);

  const categories = Array.from(new Set(features.map((f) => f.category)));

  return (
    <div className="w-full">
      {/* Recommended Banner */}
      {recommendedId && (
        <div className="mb-6 flex items-center justify-between p-4 rounded-[12px] border border-[rgba(59,130,246,0.25)] bg-[rgba(59,130,246,0.1)]">
          <div className="flex items-center gap-2 text-[14px] text-[var(--primary)] font-medium">
            <span>Your recommended product is highlighted based on your wizard results.</span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("taxwise_recommended_id");
              setRecommendedId(null);
            }}
            className="text-[12px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table Wrapper */}
      <div className="w-full overflow-x-auto no-scrollbar rounded-[16px] border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full min-w-[900px] border-collapse text-left">
          {/* Header Row */}
          <thead className="sticky top-0 z-10 bg-[var(--surface)] border-b border-[var(--border)]">
            <tr>
              <th className="p-5 text-[12px] font-medium text-[var(--text-muted)] uppercase tracking-[0.08em] w-[200px] sticky left-0 bg-[var(--surface)] z-20">
                Features
              </th>
              {products.map((product) => {
                const isRecommended = product.id === recommendedId;
                return (
                  <th
                    key={product.id}
                    className={`p-5 text-center relative ${
                      isRecommended
                        ? "bg-[rgba(59,130,246,0.08)] border-x border-[rgba(59,130,246,0.2)]"
                        : ""
                    }`}
                  >
                    {isRecommended && (
                      <span className="absolute top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[var(--primary)] text-white text-[10px] font-medium rounded-[4px]">
                        Recommended
                      </span>
                    )}
                    <h4 className={`text-[14px] font-semibold text-[var(--text-primary)] ${isRecommended ? "mt-4" : ""}`}>
                      {product.name}
                    </h4>
                    <p className={`mt-1 text-[16px] font-bold ${isRecommended ? "text-[var(--primary)]" : "text-[var(--text-secondary)]"}`}>
                      ${product.price}
                    </p>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <React.Fragment key={category}>
                {/* Category Header Row */}
                <tr className="bg-[rgba(255,255,255,0.02)]">
                  <td
                    colSpan={products.length + 1}
                    className="p-4 px-5 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.08em] sticky left-0 bg-[rgba(255,255,255,0.02)]"
                  >
                    {category}
                  </td>
                </tr>

                {/* Feature rows */}
                {features
                  .filter((f) => f.category === category)
                  .map((feature, idx) => (
                    <tr
                      key={feature.key}
                      className={`transition-colors hover:bg-[rgba(255,255,255,0.02)] ${
                        idx % 2 === 0 ? "bg-transparent" : "bg-[rgba(255,255,255,0.01)]"
                      }`}
                    >
                      <td className="p-4 px-5 text-[14px] font-medium text-[var(--text-primary)] sticky left-0 bg-inherit">
                        {feature.label}
                      </td>
                      {products.map((product) => {
                        const isSupported = product.supports[feature.key];
                        const isRecommended = product.id === recommendedId;
                        return (
                          <td
                            key={product.id}
                            className={`p-4 text-center ${
                              isRecommended
                                ? "bg-[rgba(59,130,246,0.08)] border-x border-[rgba(59,130,246,0.2)]"
                                : ""
                            }`}
                          >
                            {isSupported ? (
                              <div className="mx-auto flex h-5 w-5 items-center justify-center">
                                <Check className="h-4 w-4 text-[var(--success)]" strokeWidth={2.5} />
                              </div>
                            ) : (
                              <div className="mx-auto flex h-5 w-5 items-center justify-center">
                                <X className="h-3.5 w-3.5 text-[var(--error)] opacity-50" strokeWidth={2} />
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
              </React.Fragment>
            ))}

            {/* CTA Row */}
            <tr className="border-t border-[var(--border)]">
              <td className="p-5 px-5 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.08em] sticky left-0 bg-[var(--surface)]">
                Select
              </td>
              {products.map((product) => {
                const isRecommended = product.id === recommendedId;
                return (
                  <td
                    key={product.id}
                    className={`p-5 text-center ${
                      isRecommended
                        ? "bg-[rgba(59,130,246,0.08)] border-x border-[rgba(59,130,246,0.2)]"
                        : ""
                    }`}
                  >
                    <Link href="/recommend">
                      <Button
                        variant={isRecommended ? "primary" : "ghost"}
                        size="sm"
                        className="gap-1.5"
                      >
                        <span>Select</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
