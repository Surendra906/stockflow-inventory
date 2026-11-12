"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const numOrNull = (v) => (v.trim() === "" ? null : Number(v));

export default function ProductForm({ initial }) {
  const router = useRouter();
  const isEdit = !!initial;
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    sku: initial?.sku ?? "",
    description: initial?.description ?? "",
    quantityOnHand: String(initial?.quantityOnHand ?? 0),
    costPrice: initial?.costPrice?.toString() ?? "",
    sellingPrice: initial?.sellingPrice?.toString() ?? "",
    lowStockThreshold: initial?.lowStockThreshold?.toString() ?? "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Convert form strings into the types the API expects
    const payload = {
      name: form.name,
      sku: form.sku,
      description: form.description.trim() === "" ? null : form.description,
      quantityOnHand: Number(form.quantityOnHand),
      costPrice: numOrNull(form.costPrice),
      sellingPrice: numOrNull(form.sellingPrice),
      lowStockThreshold: numOrNull(form.lowStockThreshold),
    };

    const res = await fetch(isEdit ? `/api/products/${initial!.id}` : "/api/products", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error);
    router.push("/products");
    router.refresh();
  }

  const input = "w-full rounded border border-gray-300 px-3 py-2 text-sm";
  const label = "mb-1 block text-sm font-medium";

  return (
    <form onSubmit={onSubmit} className="max-w-lg space-y-4 rounded-lg bg-white p-6 shadow">
      {error && <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}
      <div>
        <label className={label}>Name *</label>
        <input className={input} value={form.name} onChange={set("name")} required />
      </div>
      <div>
        <label className={label}>SKU *</label>
        <input className={input} value={form.sku} onChange={set("sku")} required />
      </div>
      <div>
        <label className={label}>Description</label>
        <textarea className={input} rows={3} value={form.description} onChange={set("description")} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Quantity on hand *</label>
          <input className={input} type="number" min="0" step="1" value={form.quantityOnHand} onChange={set("quantityOnHand")} required />
        </div>
        <div>
          <label className={label}>Low stock threshold</label>
          <input className={input} type="number" min="0" step="1" placeholder="Uses default" value={form.lowStockThreshold} onChange={set("lowStockThreshold")} />
        </div>
        <div>
          <label className={label}>Cost price</label>
          <input className={input} type="number" min="0" step="0.01" value={form.costPrice} onChange={set("costPrice")} />
        </div>
        <div>
          <label className={label}>Selling price</label>
          <input className={input} type="number" min="0" step="0.01" value={form.sellingPrice} onChange={set("sellingPrice")} />
        </div>
      </div>
      <div className="flex gap-3">
        <button disabled={loading} className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
          {loading ? "Saving..." : isEdit ? "Save changes" : "Create product"}
        </button>
        <button type="button" onClick={() => router.push("/products")} className="rounded border px-4 py-2">
          Cancel
        </button>
      </div>
    </form>
  );
}