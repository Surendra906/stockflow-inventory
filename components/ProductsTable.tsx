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
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <input
          className="w-full max-w-xs rounded border border-gray-300 px-3 py-2 text-sm"
          placeholder="Search by name or SKU"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Link href="/products/new" className="whitespace-nowrap rounded bg-blue-600 px-4 py-2 text-sm text-white">
          Add product
        </Link>
      </div>

      {error && <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Quantity</th>
              <th className="p-3">Status</th>
              <th className="p-3">Selling price</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-500">
                  {products.length === 0 ? "No products yet. Add your first one." : "No products match your search."}
                </td>
              </tr>
            )}
            {filtered.map((p) => {
              const low = isLowStock(p.quantityOnHand, p.lowStockThreshold, defaultThreshold);
              return (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.sku}</td>
                  <td className="p-3">{p.quantityOnHand}</td>
                  <td className="p-3">
                    {low ? (
                      <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-700">Low stock</span>
                    ) : (
                      <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-700">In stock</span>
                    )}
                  </td>
                  <td className="p-3">{p.sellingPrice === null ? "-" : `₹${p.sellingPrice.toFixed(2)}`}</td>
                  <td className="space-x-3 p-3 text-right">
                    <Link href={`/products/${p.id}/edit`} className="text-blue-600">Edit</Link>
                    <button onClick={() => remove(p)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}