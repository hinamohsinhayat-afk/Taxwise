"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products } from "@/lib/products";
import ProductCard from "./ProductCard";
import { ArrowUpDown } from "lucide-react";

type FilterType = "all" | "personal" | "self-employed" | "corporate" | "expert";
type SortType = "price-asc" | "price-desc";

export default function ProductGrid() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeSort, setActiveSort] = useState<SortType>("price-asc");

  const filteredProducts = products.filter((product) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "personal") {
      return !product.supports.corporateFiling;
    }
    if (activeFilter === "self-employed") {
      return product.supports.freelanceIncome || product.supports.gigWorkIncome;
    }
    if (activeFilter === "corporate") {
      return product.supports.corporateFiling;
    }
    if (activeFilter === "expert") {
      return product.supports.expertHelp || product.supports.fullService;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (activeSort === "price-asc") {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  const filterTabs: { value: FilterType; label: string }[] = [
    { value: "all", label: "All" },
    { value: "personal", label: "Personal" },
    { value: "self-employed", label: "Self-Employed" },
    { value: "corporate", label: "Corporate" },
    { value: "expert", label: "Expert" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-8">
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveFilter(tab.value)}
              className={`px-4 py-2 text-[13px] font-medium rounded-[10px] border transition-all duration-200 ${
                activeFilter === tab.value
                  ? "bg-[var(--primary)] border-[var(--primary)] text-white"
                  : "bg-transparent border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:bg-[var(--surface)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <button
          onClick={() => setActiveSort(activeSort === "price-asc" ? "price-desc" : "price-asc")}
          className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-[var(--text-secondary)] border border-[var(--border)] rounded-[10px] hover:border-[var(--border-hover)] hover:bg-[var(--surface)] transition-all"
        >
          <ArrowUpDown className="h-4 w-4" />
          <span>Price: {activeSort === "price-asc" ? "Low to High" : "High to Low"}</span>
        </button>
      </div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {sortedProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              variants={itemVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <ProductCard 
                product={product} 
                highlighted={product.id === "self-employed"}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-[var(--text-secondary)] text-[15px]">No products found matching the criteria.</p>
        </div>
      )}
    </div>
  );
}
