"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, AlertTriangle, ArrowRight, MessageSquare } from "lucide-react";
import { RecommendationResult as ResultType } from "@/lib/types";
import { products } from "@/lib/products";
import ProductCard from "@/components/products/ProductCard";
import Button from "@/components/ui/button";
import Link from "next/link";

interface RecommendationResultProps {
  result: ResultType;
  onRestart: () => void;
  onUpgrade?: (productId: string) => void;
}

export default function RecommendationResult({ result, onRestart, onUpgrade }: RecommendationResultProps) {
  useEffect(() => {
    if (result.recommendedProductId) {
      localStorage.setItem("taxwise_recommended_id", result.recommendedProductId);
    }
  }, [result.recommendedProductId]);

  const recommendedProduct = products.find((p) => p.id === result.recommendedProductId) || products[0];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-[32px] font-semibold tracking-tight text-[var(--text-primary)]">
          {result.recommendedProductName}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-[24px] font-bold text-[var(--text-primary)]">
            ${result.price}
          </span>
          <span className={`px-3 py-1 rounded-[6px] text-[12px] font-medium ${
            result.confidence === "high" 
              ? "bg-[rgba(52,211,153,0.15)] text-[var(--success)] border border-[rgba(52,211,153,0.35)]"
              : result.confidence === "medium"
              ? "bg-[rgba(251,191,36,0.15)] text-[var(--warning)] border border-[rgba(251,191,36,0.35)]"
              : "bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)] border border-[var(--border)]"
          }`}>
            {result.confidence === "high" ? "High Confidence" : result.confidence === "medium" ? "Medium Confidence" : "Low Confidence"}
          </span>
        </div>
      </div>

      {/* Product Card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <ProductCard product={recommendedProduct} highlighted={true} />
      </motion.div>

      {/* Reasons */}
      <div className="space-y-4">
        <h3 className="text-[14px] font-medium text-[var(--text-muted)] uppercase tracking-[0.08em]">
          Why this matches
        </h3>
        <ul className="space-y-3">
          {result.reasons.map((reason, idx) => (
            <li key={idx} className="flex gap-3 text-[15px] text-[var(--text-secondary)]">
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shrink-0 mt-2.5" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Optional Upgrade */}
      {result.optionalUpgrade && (
        <div className="p-5 rounded-[16px] border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-medium text-[var(--primary)] uppercase tracking-[0.08em]">
                Optional Upgrade
              </span>
              <h4 className="text-[16px] font-semibold text-[var(--text-primary)]">
                {result.optionalUpgrade.productName}
              </h4>
              <p className="text-[14px] text-[var(--text-secondary)]">
                {result.optionalUpgrade.reason}
              </p>
            </div>
            {onUpgrade ? (
              <Button
                onClick={() => onUpgrade(result.optionalUpgrade!.productId)}
                size="sm"
                className="shrink-0 gap-1.5"
              >
                <span>Upgrade</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Link href={`/recommend?upgrade=${result.optionalUpgrade.productId}`} className="shrink-0">
                <Button size="sm" className="gap-1.5">
                  <span>Upgrade</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Warnings */}
      {result.warnings && result.warnings.length > 0 && (
        <div className="p-4 rounded-[12px] border border-[rgba(251,191,36,0.25)] bg-[rgba(251,191,36,0.08)]">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-[var(--warning)] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-[14px] font-medium text-[var(--warning)]">Warning</span>
              <ul className="list-disc pl-4 space-y-1">
                {result.warnings.map((w, idx) => (
                  <li key={idx} className="text-[14px] text-[var(--text-secondary)]">{w}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button onClick={onRestart} variant="ghost" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          <span>Start Over</span>
        </Button>
        <Link href="/assistant" className="flex-1">
          <Button className="w-full gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Ask AI Assistant</span>
          </Button>
        </Link>
      </div>

      {/* Disclaimer */}
      <p className="text-[12px] text-[var(--text-muted)] italic">
        {result.disclaimer}
      </p>
    </div>
  );
}
