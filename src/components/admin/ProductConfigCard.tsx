"use client";

import React from "react";
import { motion } from "framer-motion";
import { DollarSign, Target, FileText, Tag, Pencil, Trash2 } from "lucide-react";
import { Product } from "@/lib/types";
import { ValidationResult, getSupportedFeatures, getUnsupportedFeatures } from "@/lib/product-validation";
import { FeatureBadge, ValidationBadge } from "./admin-ui";

export default function ProductConfigCard({ product, validation, index, onEdit, onDelete }: {
  product: Product; validation: ValidationResult; index: number;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}) {
  const supported = getSupportedFeatures(product);
  const unsupported = getUnsupportedFeatures(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-[var(--surface)] border border-[var(--border)] rounded-[16px] p-6 hover:border-[var(--border-hover)] transition-all duration-200"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1.5">
            <h3 className="text-[18px] font-semibold text-[var(--text-primary)] truncate">{product.name}</h3>
            <ValidationBadge valid={validation.valid} errors={validation.errors} />
          </div>
          <div className="flex items-center gap-2 text-[12px] text-[var(--text-muted)] font-mono">
            <Tag className="h-3 w-3" />
            <span>{product.id}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-baseline gap-1.5">
            <DollarSign className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-[24px] font-bold text-[var(--primary)] leading-none">{product.price}</span>
            <span className="text-[12px] text-[var(--text-muted)]">CAD</span>
          </div>
          <div className="flex items-center gap-1 ml-2 pl-2 border-l border-[var(--border)]">
            {onEdit && (
              <button
                onClick={() => onEdit(product)}
                className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[rgba(59,130,246,0.1)] transition-colors"
                title="Edit product"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(product)}
                className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[var(--text-muted)] hover:text-[var(--error)] hover:bg-[rgba(248,113,113,0.1)] transition-colors"
                title="Delete product"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4 pb-4 border-b border-[var(--border)]">
        <div className="flex items-start gap-2">
          <FileText className="h-3.5 w-3.5 text-[var(--text-muted)] mt-0.5 shrink-0" />
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">{product.description}</p>
        </div>
      </div>

      <div className="mb-4 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 mb-2">
          <Target className="h-3.5 w-3.5 text-[var(--accent)]" />
          <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.08em]">Best For</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {product.bestFor.map((item) => (
            <span key={item} className="inline-flex items-center rounded-[6px] px-2.5 py-1 text-[11px] font-medium bg-[rgba(34,211,238,0.08)] border border-[rgba(34,211,238,0.2)] text-[var(--accent)]">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.08em]">Supported Features</span>
          <span className="text-[11px] font-medium text-[var(--success)] bg-[rgba(52,211,153,0.08)] rounded-[4px] px-1.5 py-0.5">{supported.length}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {supported.length > 0
            ? supported.map((f) => <FeatureBadge key={f} featureKey={f} supported />)
            : <span className="text-[11px] text-[var(--text-muted)]">No supported features</span>
          }
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.08em]">Unsupported Features</span>
          <span className="text-[11px] font-medium text-[var(--error)] bg-[rgba(248,113,113,0.08)] rounded-[4px] px-1.5 py-0.5">{unsupported.length}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {unsupported.length > 0
            ? unsupported.map((f) => <FeatureBadge key={f} featureKey={f} supported={false} />)
            : <span className="text-[11px] text-[var(--text-muted)]">All features supported</span>
          }
        </div>
      </div>
    </motion.div>
  );
}
