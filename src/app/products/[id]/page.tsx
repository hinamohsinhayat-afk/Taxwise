"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, X, ArrowRight } from "lucide-react";
import { products } from "@/lib/products";
import { Product } from "@/lib/types";
import Button from "@/components/ui/button";

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
  expertHelp: "Expert Help (Chat/Video)",
  fullService: "Full Service Filing",
  corporateFiling: "Corporate Filing (T2)",
  nilCorporateReturn: "Nil Corporate Return",
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-[32px] font-semibold text-[var(--text-primary)]">Product not found</h1>
          <p className="mt-3 text-[var(--text-secondary)]">The plan you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/products" className="mt-6 inline-flex items-center gap-2 text-[var(--primary)] hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Back to all plans
          </Link>
        </div>
      </div>
    );
  }

  const isMostPopular = product.id === "self-employed";
  const supportedFeatures = Object.entries(product.supports).filter(([, v]) => v) as [keyof Product["supports"], boolean][];
  const unsupportedFeatures = Object.entries(product.supports).filter(([, v]) => !v) as [keyof Product["supports"], boolean][];

  return (
    <div className="min-h-screen bg-[var(--background)] py-16 md:py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-[14px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors mb-10"
        >
          <ArrowLeft className="h-4 w-4" />
          All plans
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`relative bg-[var(--surface)] border rounded-[20px] p-8 md:p-10 ${
            isMostPopular
              ? "border-[var(--primary)] shadow-[0_0_60px_rgba(59,130,246,0.18)]"
              : "border-[var(--border)]"
          }`}
        >
          {/* Most Popular badge */}
          {isMostPopular && (
            <div className="absolute -top-3.5 left-8 px-3 py-1.5 bg-[var(--primary)] text-white text-[11px] font-medium tracking-[0.08em] uppercase rounded-[6px]">
              Most Popular
            </div>
          )}

          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight text-[var(--text-primary)]">
                {product.name}
              </h1>
              <p className="mt-3 text-[16px] text-[var(--text-secondary)] leading-relaxed max-w-xl">
                {product.description}
              </p>
            </div>
            <div
              className={`shrink-0 px-4 py-2 rounded-[10px] text-[18px] font-semibold ${
                product.price === 0
                  ? "bg-[var(--accent-soft)] text-[var(--accent)] border border-[rgba(34,211,238,0.35)]"
                  : "bg-[rgba(59,130,246,0.15)] text-[#93c5fd] border border-[rgba(59,130,246,0.35)]"
              }`}
            >
              {product.price === 0 ? "Free" : `$${product.price} CAD`}
            </div>
          </div>

          {/* Best for */}
          {product.bestFor.length > 0 && (
            <div className="mt-8">
              <h2 className="text-[12px] font-medium tracking-[0.1em] uppercase text-[var(--text-muted)] mb-3">
                Best for
              </h2>
              <div className="flex flex-wrap gap-2">
                {product.bestFor.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 bg-[rgba(59,130,246,0.1)] border border-[rgba(59,130,246,0.25)] text-[#93c5fd] text-[13px] font-medium rounded-[8px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="my-8 border-t border-[var(--border)]" />

          {/* Supported features */}
          <div>
            <h2 className="text-[12px] font-medium tracking-[0.1em] uppercase text-[var(--text-muted)] mb-4">
              What&apos;s included
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {supportedFeatures.map(([key]) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(34,197,94,0.15)]">
                    <Check className="h-3 w-3 text-[var(--success)]" />
                  </div>
                  <span className="text-[14px] text-[var(--text-secondary)]">{featureLabels[key]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Unsupported features */}
          {unsupportedFeatures.length > 0 && (
            <div className="mt-8">
              <h2 className="text-[12px] font-medium tracking-[0.1em] uppercase text-[var(--text-muted)] mb-4">
                Not included
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unsupportedFeatures.map(([key]) => (
                  <div key={key} className="flex items-center gap-3 opacity-50">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(255,255,255,0.05)]">
                      <X className="h-3 w-3 text-[var(--text-muted)]" />
                    </div>
                    <span className="text-[14px] text-[var(--text-muted)] line-through">{featureLabels[key]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-10 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row gap-3">
            <Link href={`/recommend?plan=${product.id}`} className="flex-1">
              <Button className="w-full gap-2 group">
                <span>Start with {product.name}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link href="/compare" className="flex-1">
              <Button variant="ghost" className="w-full">
                Compare all plans
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
