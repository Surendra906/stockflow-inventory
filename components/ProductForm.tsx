"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { ProductDTO } from "@/lib/products";

type ProductFormState = {
  name: string;
  sku: string;
  description: string;
  quantityOnHand: string;
  costPrice: string;
  sellingPrice: string;
  lowStockThreshold: string;
};

const inputClass = "w-full rounded border border-gray-300 px-3 py-2 text-sm";

export default function ProductForm({ initial }: { initial?: ProductDTO }) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormState>({
    name: initial?.name ?? "",
    sku: initial?.sku ?? "",
    description: initial?.description ?? "",
    quantityOnHand: String(initial?.quantityOnHand ?? 0),
    costPrice: initial?.costPrice == null ? "" : String(initial.costPrice),
    sellingPrice: initial?.sellingPrice == null ? "" : String(initial.sellingPrice),
    lowStockThreshold: initial?.lowStockThreshold == null ? "" : String(initial.lowStockThreshold),
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key: keyof ProductFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
    };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      name: form.name,
      sku: form.sku,
      description: form.description.trim() || null,
      quantityOnHand: Number(form.quantityOnHand),
      costPrice: form.costPrice === "" ? null : Number(form.costPrice),
      sellingPrice: form.sellingPrice === "" ? null : Number(form.sellingPrice),
      lowStockThreshold: form.lowStockThreshold === "" ? null : Number(form.lowStockThreshold),
    };

    try {
      const response = await fetch(
        initial ? `/api/auth/products/${initial.id}` : "/api/auth/products",
        {
          method: initial ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data: { error?: string } = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Could not save the product");
        return;
      }

      router.push("/products");
      router.refresh();
    } catch {
      setError("Could not save the product. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4 rounded-lg bg-white p-6 shadow">
      {error && <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}

      <label className="block space-y-1 text-sm font-medium">
        Name
        <input className={inputClass} value={form.name} onChange={update("name")} required />
      </label>

      <label className="block space-y-1 text-sm font-medium">
        SKU
        <input className={inputClass} value={form.sku} onChange={update("sku")} required />
      </label>

      <label className="block space-y-1 text-sm font-medium">
        Description
        <textarea className={inputClass} value={form.description} onChange={update("description")} rows={3} />
      </label>

      <label className="block space-y-1 text-sm font-medium">
        Quantity on hand
        <input
          className={inputClass}
          type="number"
          min="0"
          step="1"
          value={form.quantityOnHand}
          onChange={update("quantityOnHand")}
          required
        />
      </label>

      <label className="block space-y-1 text-sm font-medium">
        Cost price
        <input className={inputClass} type="number" min="0" step="0.01" value={form.costPrice} onChange={update("costPrice")} />
      </label>

      <label className="block space-y-1 text-sm font-medium">
        Selling price
        <input className={inputClass} type="number" min="0" step="0.01" value={form.sellingPrice} onChange={update("sellingPrice")} />
      </label>

      <label className="block space-y-1 text-sm font-medium">
        Low stock threshold
        <input
          className={inputClass}
          type="number"
          min="0"
          step="1"
          value={form.lowStockThreshold}
          onChange={update("lowStockThreshold")}
        />
      </label>

      <button disabled={loading} className="rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50">
        {loading ? "Saving..." : initial ? "Save changes" : "Add product"}
      </button>
    </form>
  );
}
