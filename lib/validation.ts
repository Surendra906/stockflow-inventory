import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  sku: z.string().trim().min(1, "SKU is required"),
  description: z.string().trim().nullable().optional(),
  quantityOnHand: z.number().int("Quantity must be a whole number").min(0, "Quantity cannot be negative"),
  costPrice: z.number().min(0, "Cost price cannot be negative").nullable().optional(),
  sellingPrice: z.number().min(0, "Selling price cannot be negative").nullable().optional(),
  lowStockThreshold: z.number().int().min(0, "Threshold cannot be negative").nullable().optional(),
});