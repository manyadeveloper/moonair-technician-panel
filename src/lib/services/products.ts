import { products } from "@/lib/mock/products";
import type { Product } from "@/types/product";

export function getProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | null {
  return products.find((p) => p.id === id) ?? null;
}
