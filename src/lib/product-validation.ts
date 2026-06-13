import { Product } from "./types";

export type ValidationResult = { valid: boolean; errors: string[] };

export function validateProduct(product: Product): ValidationResult {
  const errors: string[] = [];

  if (!product.id?.trim()) errors.push("Missing ID");
  if (!product.name?.trim()) errors.push("Missing Name");
  if (product.price == null) errors.push("Missing Price");
  if (!product.description?.trim()) errors.push("Missing Description");
  if (!product.bestFor?.length) errors.push("Missing Best For");
  if (!product.supports || typeof product.supports !== "object") errors.push("Invalid Feature Structure");

  return { valid: !errors.length, errors };
}

export function validateAllProducts(products: Product[]): ValidationResult[] {
  return products.map(validateProduct);
}

export function getProductStats(products: Product[]) {
  return {
    total: products.length,
    personal: products.filter((p) => !p.supports.corporateFiling && !p.supports.freelanceIncome && !p.supports.gigWorkIncome).length,
    corporate: products.filter((p) => p.supports.corporateFiling).length,
    expert: products.filter((p) => p.supports.expertHelp || p.supports.fullService).length,
    selfEmployed: products.filter((p) => p.supports.freelanceIncome || p.supports.gigWorkIncome).length,
    validationIssues: validateAllProducts(products).filter((r) => !r.valid).length,
  };
}

export function getSupportedFeatures(product: Product): string[] {
  if (!product.supports) return [];
  return Object.entries(product.supports).filter(([, v]) => v).map(([k]) => k);
}

export function getUnsupportedFeatures(product: Product): string[] {
  if (!product.supports) return [];
  return Object.entries(product.supports).filter(([, v]) => !v).map(([k]) => k);
}

export function exportProductsAsJson(products: Product[], filename = "products-config.json") {
  const href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
  const a = document.createElement("a");
  a.setAttribute("href", href);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  a.remove();
}
