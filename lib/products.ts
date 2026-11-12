import type { Product } from "@prisma/client";

export type ProductDTO = {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  quantityOnHand: number;
  costPrice: number | null;
  sellingPrice: number | null;
  lowStockThreshold: number | null;
};

// Prisma returns Decimal objects, which can't be passed to client components.
// This converts them to plain numbers.
export function toDTO(p: Product): ProductDTO {
  return {
    id: p.id,
    name: p.name,
    sku: p.sku,
    description: p.description,
    quantityOnHand: p.quantityOnHand,
    costPrice: p.costPrice === null ? null : Number(p.costPrice),
    sellingPrice: p.sellingPrice === null ? null : Number(p.sellingPrice),
    lowStockThreshold: p.lowStockThreshold === null ? null : Number(p.lowStockThreshold),
  };
}

// The business rule from the PRD:
// low stock when quantity <= product threshold, or the organization default if empty
export function isLowStock(quantity: number, threshold: number | null, orgDefault: number) {
  return quantity <= (threshold ?? orgDefault);
}