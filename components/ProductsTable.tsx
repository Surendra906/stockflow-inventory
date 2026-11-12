"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isLowStock, type ProductDTO } from "@/lib/products";

export default function ProductsTable({
  products,
  defaultThreshold,
}: {
  products: ProductDTO[];
  defaultThreshold: number;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  const q = query.trim().toLowerCase();
  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
  );

  async function remove(p: ProductDTO) {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/auth/products/${p.id}`, { method: "DELETE" });
    if (!res.ok) return setError("Could not delete the product");
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:soft-ring"
            placeholder="Search by name or SKU"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Link href="/products/new" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:opacity-95">
          Add product
        </Link>
      </div>

      {error && <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">SKU</th>
                <th className="p-4 font-semibold">Quantity</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Selling price</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    {products.length === 0 ? "No products yet. Add your first one." : "No products match your search."}
                  </td>
                </tr>
              )}
              {filtered.map((p) => {
                const low = isLowStock(p.quantityOnHand, p.lowStockThreshold, defaultThreshold);
                return (
                  <tr key={p.id} className="border-b border-slate-200 last:border-0 transition hover:bg-slate-50/80">
                    <td className="p-4 font-semibold text-slate-800">{p.name}</td>
                    <td className="p-4 text-slate-600">{p.sku}</td>
                    <td className="p-4 text-slate-700">{p.quantityOnHand}</td>
                    <td className="p-4">
                      {low ? (
                        <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-red-700">Low stock</span>
                      ) : (
                        <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">In stock</span>
                      )}
                    </td>
                    <td className="p-4 text-slate-700">{p.sellingPrice === null ? "-" : `₹${p.sellingPrice.toFixed(2)}`}</td>
                    <td className="space-x-3 p-4 text-right">
                      <Link href={`/products/${p.id}/edit`} className="font-medium text-blue-600 transition hover:text-blue-700">
                        Edit
                      </Link>
                      <button onClick={() => remove(p)} className="font-medium text-red-600 transition hover:text-red-700">
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}