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
    <form onSubmit={onSubmit} className="max-w-2xl space-y-5 rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_20px_40px_rgba(15,23,42,0.08)]">
      {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
          Name
          <input className={`${inputClass} border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:soft-ring`} value={form.name} onChange={update("name")} required />
        </label>

        <label className="block space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
          SKU
          <input className={`${inputClass} border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:soft-ring`} value={form.sku} onChange={update("sku")} required />
        </label>

        <label className="block space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
          Description
          <textarea className={`${inputClass} border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:soft-ring`} value={form.description} onChange={update("description")} rows={3} />
        </label>

        <label className="block space-y-2 text-sm font-medium text-slate-700">
          Quantity on hand
          <input
            className={`${inputClass} border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:soft-ring`}
            type="number"
            min="0"
            step="1"
            value={form.quantityOnHand}
            onChange={update("quantityOnHand")}
            required
          />
        </label>

        <label className="block space-y-2 text-sm font-medium text-slate-700">
          Cost price
          <input className={`${inputClass} border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:soft-ring`} type="number" min="0" step="0.01" value={form.costPrice} onChange={update("costPrice")} />
        </label>

        <label className="block space-y-2 text-sm font-medium text-slate-700">
          Selling price
          <input className={`${inputClass} border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:soft-ring`} type="number" min="0" step="0.01" value={form.sellingPrice} onChange={update("sellingPrice")} />
        </label>

        <label className="block space-y-2 text-sm font-medium text-slate-700">
          Low stock threshold
          <input
            className={`${inputClass} border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:soft-ring`}
            type="number"
            min="0"
            step="1"
            value={form.lowStockThreshold}
            onChange={update("lowStockThreshold")}
          />
        </label>
      </div>

      <button
        disabled={loading}
        className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Saving..." : initial ? "Save changes" : "Add product"}
      </button>
    </form>
  );
}
