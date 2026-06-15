"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { Product } from "@/lib/types";
import Button from "@/components/ui/button";

const allFeatureKeys: { key: keyof Product["supports"]; label: string }[] = [
  { key: "salaryIncome", label: "Salary / Employment (T4)" },
  { key: "studentIncome", label: "Student Tuition (T2202)" },
  { key: "medicalExpenses", label: "Medical Expenses" },
  { key: "donations", label: "Charitable Donations" },
  { key: "employmentExpenses", label: "Employment Expenses" },
  { key: "investmentIncome", label: "Investment Income" },
  { key: "capitalGains", label: "Capital Gains" },
  { key: "foreignIncome", label: "Foreign Income" },
  { key: "rentalIncome", label: "Rental Income" },
  { key: "freelanceIncome", label: "Freelance Income (T2125)" },
  { key: "gigWorkIncome", label: "Gig Work" },
  { key: "businessExpenses", label: "Business Expenses" },
  { key: "homeOfficeExpenses", label: "Home Office" },
  { key: "vehicleExpenses", label: "Vehicle Expenses" },
  { key: "expertHelp", label: "Expert Help" },
  { key: "fullService", label: "Full Service" },
  { key: "corporateFiling", label: "Corporate Filing (T2)" },
  { key: "nilCorporateReturn", label: "Nil Corporate Return" },
];

const emptyProduct: Product = {
  id: "",
  name: "",
  price: 0,
  currency: "CAD",
  description: "",
  bestFor: [],
  supports: Object.fromEntries(allFeatureKeys.map(({ key }) => [key, false])) as Product["supports"],
};

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product?: Product | null; // null or undefined = add mode
}

export default function ProductFormModal({ isOpen, onClose, onSave, product }: ProductFormModalProps) {
  const isEdit = !!product;
  const [form, setForm] = useState<Product>(emptyProduct);
  const [bestForInput, setBestForInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setForm({ ...product, supports: { ...product.supports } });
    } else {
      setForm({ ...emptyProduct, supports: { ...emptyProduct.supports } });
    }
    setBestForInput("");
    setError("");
  }, [product, isOpen]);

  const handleSave = () => {
    if (!form.id.trim()) { setError("Product ID is required"); return; }
    if (!form.name.trim()) { setError("Product name is required"); return; }
    if (!form.description.trim()) { setError("Description is required"); return; }
    if (form.bestFor.length === 0) { setError("At least one 'Best For' tag is required"); return; }
    onSave(form);
    onClose();
  };

  const addBestFor = () => {
    const val = bestForInput.trim();
    if (val && !form.bestFor.includes(val)) {
      setForm({ ...form, bestFor: [...form.bestFor, val] });
    }
    setBestForInput("");
  };

  const removeBestFor = (tag: string) => {
    setForm({ ...form, bestFor: form.bestFor.filter((t) => t !== tag) });
  };

  const toggleFeature = (key: keyof Product["supports"]) => {
    setForm({ ...form, supports: { ...form.supports, [key]: !form.supports[key] } });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto py-8 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-[var(--surface)] border border-[var(--border)] rounded-[20px] shadow-2xl z-10 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--border)]">
            <h2 className="text-[20px] font-semibold text-[var(--text-primary)]">
              {isEdit ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.06)] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-8 py-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="px-4 py-3 rounded-[10px] border border-[rgba(248,113,113,0.3)] bg-[rgba(248,113,113,0.08)] text-[13px] text-[var(--error)]">
                {error}
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.08em] mb-2">Product ID</label>
                <input
                  type="text"
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  disabled={isEdit}
                  placeholder="e.g. premium-plus"
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--background)] py-2.5 px-3 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors disabled:opacity-50"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.08em] mb-2">Product Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Premium Plus"
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--background)] py-2.5 px-3 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.08em] mb-2">Price (CAD)</label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  min={0}
                  className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--background)] py-2.5 px-3 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.08em] mb-2">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Describe this product..."
                className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--background)] py-2.5 px-3 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
              />
            </div>

            {/* Best For Tags */}
            <div>
              <label className="block text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.08em] mb-2">Best For</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={bestForInput}
                  onChange={(e) => setBestForInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addBestFor(); } }}
                  placeholder="Add a tag (e.g. Students, Freelancers)"
                  className="flex-1 rounded-[10px] border border-[var(--border)] bg-[var(--background)] py-2 px-3 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
                <Button size="sm" variant="ghost" onClick={addBestFor} className="gap-1">
                  <Plus className="h-3.5 w-3.5" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {form.bestFor.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[12px] font-medium bg-[rgba(34,211,238,0.08)] border border-[rgba(34,211,238,0.2)] text-[var(--accent)]">
                    {tag}
                    <button onClick={() => removeBestFor(tag)} className="text-[var(--accent)] hover:text-white transition-colors">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Feature Toggles */}
            <div>
              <label className="block text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-[0.08em] mb-3">Supported Features</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allFeatureKeys.map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleFeature(key)}
                    className={`flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[13px] font-medium border transition-all text-left ${
                      form.supports[key]
                        ? "border-[rgba(52,211,153,0.3)] bg-[rgba(52,211,153,0.06)] text-[var(--success)]"
                        : "border-[var(--border)] bg-[var(--background)] text-[var(--text-muted)] hover:border-[var(--border-hover)]"
                    }`}
                  >
                    <div className={`h-4 w-4 rounded-[4px] border-2 flex items-center justify-center shrink-0 transition-all ${
                      form.supports[key] ? "border-[var(--success)] bg-[var(--success)]" : "border-[var(--border)]"
                    }`}>
                      {form.supports[key] && (
                        <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-8 py-5 border-t border-[var(--border)]">
            <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={handleSave}>
              {isEdit ? "Save Changes" : "Add Product"}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
