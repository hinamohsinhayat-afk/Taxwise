"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Search, X, CheckCircle, AlertTriangle,
  Package, User, Building2, Headphones, Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Feature Labels ────────────────────────────────────────────────
const featureLabels: Record<string, string> = {
  salaryIncome: "Salary (T4)",
  studentIncome: "Student (T2202)",
  medicalExpenses: "Medical",
  donations: "Donations",
  employmentExpenses: "Employment Exp.",
  investmentIncome: "Investments",
  capitalGains: "Capital Gains",
  foreignIncome: "Foreign Income",
  rentalIncome: "Rental",
  freelanceIncome: "Freelance (T2125)",
  gigWorkIncome: "Gig Work",
  businessExpenses: "Business Exp.",
  homeOfficeExpenses: "Home Office",
  vehicleExpenses: "Vehicle",
  expertHelp: "Expert Help",
  fullService: "Full Service",
  corporateFiling: "Corporate T2",
  nilCorporateReturn: "Nil Return",
};

// ── Badges ────────────────────────────────────────────────────────
export function FeatureBadge({ featureKey, supported = true, className }: {
  featureKey: string; supported?: boolean; className?: string;
}) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[11px] font-medium border transition-colors",
      supported
        ? "bg-[rgba(52,211,153,0.08)] border-[rgba(52,211,153,0.2)] text-[var(--success)]"
        : "bg-[rgba(248,113,113,0.08)] border-[rgba(248,113,113,0.2)] text-[var(--error)]",
      className,
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", supported ? "bg-[var(--success)]" : "bg-[var(--error)]")} />
      {featureLabels[featureKey] || featureKey}
    </span>
  );
}

export function ValidationBadge({ valid, errors = [], className }: {
  valid: boolean; errors?: string[]; className?: string;
}) {
  if (valid) {
    return (
      <span className={cn(
        "inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[11px] font-medium bg-[rgba(52,211,153,0.08)] border border-[rgba(52,211,153,0.2)] text-[var(--success)]",
        className,
      )}>
        <CheckCircle className="h-3 w-3" />
        Valid
      </span>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[11px] font-medium bg-[rgba(251,191,36,0.08)] border border-[rgba(251,191,36,0.2)] text-[var(--warning)] w-fit">
        <AlertTriangle className="h-3 w-3" />
        {errors.length} Issue{errors.length !== 1 ? "s" : ""}
      </span>
      {errors.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-0.5">
          {errors.map((err, i) => (
            <span key={i} className="text-[10px] text-[var(--text-muted)] bg-[rgba(255,255,255,0.03)] rounded-[4px] px-1.5 py-0.5">
              {err}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Search ────────────────────────────────────────────────────────
export function SearchBar({ value, onChange, className }: {
  value: string; onChange: (v: string) => void; className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
      <input
        type="text"
        placeholder="Search by name, ID, or feature..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[10px] border border-[var(--border)] bg-[var(--surface)] py-2.5 pl-10 pr-10 text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[rgba(59,130,246,0.2)] transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.1)] transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

// ── Filters ───────────────────────────────────────────────────────
export type FilterOption = "all" | "personal" | "corporate" | "expert" | "self-employed";

const filters: { value: FilterOption; label: string }[] = [
  { value: "all", label: "All Products" },
  { value: "personal", label: "Personal" },
  { value: "corporate", label: "Corporate" },
  { value: "expert", label: "Expert" },
  { value: "self-employed", label: "Self-Employed" },
];

export function FilterBar({ active, onChange, className }: {
  active: FilterOption; onChange: (f: FilterOption) => void; className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {filters.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-[10px] px-3.5 py-2 text-[13px] font-medium border transition-all duration-200",
            active === opt.value
              ? "bg-[var(--primary)] border-[var(--primary)] text-white shadow-[0_0_16px_rgba(59,130,246,0.25)]"
              : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Stats Dashboard ───────────────────────────────────────────────
type StatProps = {
  label: string; value: number; icon: React.ElementType;
  iconColor: string; iconBg: string; borderColor: string;
};

function StatCard({ label, value, icon: Icon, iconColor, iconBg, borderColor }: StatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-[var(--surface)] rounded-[16px] p-5 border transition-all duration-200 hover:translate-y-[-2px]",
        borderColor,
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] font-medium text-[var(--text-muted)] uppercase tracking-[0.08em]">{label}</p>
          <p className="mt-2 text-[28px] font-bold text-[var(--text-primary)] leading-none">{value}</p>
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-[10px]", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>
    </motion.div>
  );
}

export function StatsCards({ stats }: {
  stats: { total: number; personal: number; corporate: number; expert: number; selfEmployed: number; validationIssues: number };
}) {
  const hasIssues = stats.validationIssues > 0;
  const cards: StatProps[] = [
    { label: "Total Products", value: stats.total, icon: Package, iconColor: "text-[var(--primary)]", iconBg: "bg-[rgba(59,130,246,0.12)]", borderColor: "border-[var(--border)]" },
    { label: "Personal Tax", value: stats.personal, icon: User, iconColor: "text-[#a78bfa]", iconBg: "bg-[rgba(167,139,250,0.12)]", borderColor: "border-[var(--border)]" },
    { label: "Corporate", value: stats.corporate, icon: Building2, iconColor: "text-[var(--accent)]", iconBg: "bg-[rgba(34,211,238,0.12)]", borderColor: "border-[var(--border)]" },
    { label: "Expert Support", value: stats.expert, icon: Headphones, iconColor: "text-[#fb923c]", iconBg: "bg-[rgba(251,146,60,0.12)]", borderColor: "border-[var(--border)]" },
    { label: "Self-Employed", value: stats.selfEmployed, icon: Briefcase, iconColor: "text-[#f472b6]", iconBg: "bg-[rgba(244,114,182,0.12)]", borderColor: "border-[var(--border)]" },
    {
      label: "Validation Issues", value: stats.validationIssues, icon: AlertTriangle,
      iconColor: hasIssues ? "text-[var(--error)]" : "text-[var(--success)]",
      iconBg: hasIssues ? "bg-[rgba(248,113,113,0.12)]" : "bg-[rgba(52,211,153,0.12)]",
      borderColor: hasIssues ? "border-[rgba(248,113,113,0.25)]" : "border-[rgba(52,211,153,0.25)]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((c) => <StatCard key={c.label} {...c} />)}
    </div>
  );
}

export { featureLabels };
