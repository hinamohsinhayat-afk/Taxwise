"use client";

import React from "react";
import { Product } from "@/lib/types";
import { ValidationResult, getSupportedFeatures, getUnsupportedFeatures } from "@/lib/product-validation";
import { ValidationBadge } from "./admin-ui";

export default function ProductConfigTable({ products, validations }: {
  products: Product[]; validations: ValidationResult[];
}) {
  if (!products.length) return null;

  return (
    <div className="w-full overflow-x-auto rounded-[16px] border border-[var(--border)] bg-[var(--surface)]">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead className="border-b border-[var(--border)]">
          <tr>
            {["Product ID", "Product Name", "Price", "Best For", "Supported", "Unsupported", "Validation"].map((h) => (
              <th key={h} className="p-4 text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.08em]">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {products.map((product, i) => {
            const v = validations[i] || { valid: true, errors: [] };
            const supported = getSupportedFeatures(product);
            const unsupported = getUnsupportedFeatures(product);

            return (
              <tr key={product.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                <td className="p-4">
                  <span className="text-[12px] font-mono text-[var(--text-muted)]">{product.id}</span>
                </td>
                <td className="p-4">
                  <span className="text-[14px] font-medium text-[var(--text-primary)]">{product.name}</span>
                </td>
                <td className="p-4">
                  <span className="text-[14px] font-semibold text-[var(--primary)]">${product.price}</span>
                  <span className="text-[11px] text-[var(--text-muted)] ml-1">CAD</span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {product.bestFor.slice(0, 2).map((item) => (
                      <span key={item} className="inline-flex items-center rounded-[4px] px-2 py-0.5 text-[10px] font-medium bg-[rgba(34,211,238,0.08)] border border-[rgba(34,211,238,0.15)] text-[var(--accent)]">
                        {item}
                      </span>
                    ))}
                    {product.bestFor.length > 2 && (
                      <span className="text-[10px] text-[var(--text-muted)]">+{product.bestFor.length - 2}</span>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--success)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                    {supported.length}
                  </span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--error)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--error)]" />
                    {unsupported.length}
                  </span>
                </td>
                <td className="p-4">
                  <ValidationBadge valid={v.valid} errors={v.errors} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
