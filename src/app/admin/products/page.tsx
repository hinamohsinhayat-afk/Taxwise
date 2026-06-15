"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Table as TableIcon, LayoutGrid, PackageOpen, Plus, RotateCcw } from "lucide-react";
import { useProducts } from "@/lib/useProducts";
import { validateAllProducts, getProductStats, getSupportedFeatures, exportProductsAsJson } from "@/lib/product-validation";
import { Product } from "@/lib/types";
import Button from "@/components/ui/button";
import { StatsCards, SearchBar, FilterBar } from "@/components/admin/admin-ui";
import type { FilterOption } from "@/components/admin/admin-ui";
import ProductConfigTable from "@/components/admin/ProductConfigTable";
import ProductConfigCard from "@/components/admin/ProductConfigCard";
import ProductFormModal from "@/components/admin/ProductFormModal";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";

export default function AdminPage() {
  const { products, addProduct, updateProduct, deleteProduct, resetToDefaults } = useProducts();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterOption>("all");
  const [view, setView] = useState<"table" | "card">("table");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);

  const validations = useMemo(() => validateAllProducts(products), [products]);
  const stats = useMemo(() => getProductStats(products), [products]);

  const filtered = useMemo(() => {
    let result = products;

    if (filter === "personal") {
      result = result.filter((p) => !p.supports.corporateFiling && !p.supports.freelanceIncome && !p.supports.gigWorkIncome);
    } else if (filter === "corporate") {
      result = result.filter((p) => p.supports.corporateFiling);
    } else if (filter === "expert") {
      result = result.filter((p) => p.supports.expertHelp || p.supports.fullService);
    } else if (filter === "self-employed") {
      result = result.filter((p) => p.supports.freelanceIncome || p.supports.gigWorkIncome);
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((p) => {
        if (p.name.toLowerCase().includes(q)) return true;
        if (p.id.toLowerCase().includes(q)) return true;
        if (getSupportedFeatures(p).some((f) => f.toLowerCase().includes(q))) return true;
        if (p.bestFor.some((b) => b.toLowerCase().includes(q))) return true;
        return false;
      });
    }

    return result;
  }, [products, search, filter]);

  const filteredValidations = useMemo(() => {
    return filtered.map((p) => {
      const idx = products.findIndex((orig) => orig.id === p.id);
      return validations[idx];
    });
  }, [filtered, products, validations]);

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSave = (product: Product) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, product);
    } else {
      addProduct(product);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm) {
      deleteProduct(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  return (
    <AdminAuthGuard>
    <div className="min-h-screen bg-[var(--background)] py-16 md:py-24 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-[32px] md:text-[40px] font-semibold tracking-tight text-[var(--text-primary)]">
              Product Configuration Admin
            </h1>
            <p className="mt-2 text-[16px] md:text-[18px] text-[var(--text-secondary)] max-w-xl">
              Manage and review tax product configurations
            </p>
            <p className="mt-1 text-[13px] text-[var(--text-muted)]">{products.length} total products in system</p>
          </div>

          <div className="flex gap-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={resetToDefaults} className="gap-2">
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => exportProductsAsJson(products)} className="gap-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button size="sm" onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </Button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <StatsCards stats={stats} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="space-y-4"
        >
          <SearchBar value={search} onChange={setSearch} className="max-w-md" />
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <FilterBar active={filter} onChange={setFilter} />

            <div className="flex rounded-[10px] border border-[var(--border)] p-0.5">
              <button
                onClick={() => setView("table")}
                className={`flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[12px] font-medium transition-all ${
                  view === "table" ? "bg-[var(--surface)] text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                <TableIcon className="h-3.5 w-3.5" />
                <span>Table</span>
              </button>
              <button
                onClick={() => setView("card")}
                className={`flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[12px] font-medium transition-all ${
                  view === "card" ? "bg-[var(--surface)] text-[var(--text-primary)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>Cards</span>
              </button>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-[var(--text-muted)] uppercase tracking-[0.08em]">
            {filtered.length} of {products.length} products
          </span>
          {search && <span className="text-[11px] text-[var(--text-muted)]">matching &ldquo;{search}&rdquo;</span>}
        </div>

        {filtered.length > 0 ? (
          view === "table" ? (
            <ProductConfigTable products={filtered} validations={filteredValidations} onEdit={handleEdit} onDelete={setDeleteConfirm} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((product, i) => {
                const idx = products.findIndex((p) => p.id === product.id);
                return <ProductConfigCard key={product.id} product={product} validation={validations[idx]} index={i} onEdit={handleEdit} onDelete={setDeleteConfirm} />;
              })}
            </div>
          )
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-20 bg-[var(--surface)] border border-[var(--border)] rounded-[16px]"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-[16px] bg-[rgba(255,255,255,0.03)] border border-[var(--border)] mb-4">
              <PackageOpen className="h-8 w-8 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-[18px] font-semibold text-[var(--text-primary)] mb-1.5">No products available</h3>
            <p className="text-[14px] text-[var(--text-muted)] text-center max-w-sm">
              No products match your current search or filter criteria. Try adjusting your filters or clearing the search.
            </p>
            <div className="flex gap-3 mt-5">
              {search && <Button variant="ghost" size="sm" onClick={() => setSearch("")}>Clear Search</Button>}
              {filter !== "all" && <Button variant="ghost" size="sm" onClick={() => setFilter("all")}>Reset Filters</Button>}
              <Button size="sm" onClick={handleAdd} className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>

    {/* Add / Edit Modal */}
    <ProductFormModal
      isOpen={modalOpen}
      onClose={() => setModalOpen(false)}
      onSave={handleSave}
      product={editingProduct}
    />

    {/* Delete Confirmation Modal */}
    <AnimatePresence>
      {deleteConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteConfirm(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-[var(--surface)] border border-[var(--border)] rounded-[16px] p-8 max-w-md w-full z-10"
          >
            <h3 className="text-[20px] font-semibold text-[var(--text-primary)] mb-2">Delete Product</h3>
            <p className="text-[14px] text-[var(--text-secondary)] mb-6">
              Are you sure you want to delete <span className="font-semibold text-[var(--text-primary)]">{deleteConfirm.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteConfirm}>Delete Product</Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </AdminAuthGuard>
  );
}
