import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { isLowStock } from "@/lib/products";

export default async function DashboardPage() {
  const session = await requireSession();
  const where = { organizationId: session.organizationId };

  // Run the three queries in parallel
  const [org, totals, products] = await Promise.all([
    prisma.organization.findUnique({ where: { id: session.organizationId } }),
    prisma.product.aggregate({
      where,
      _count: { _all: true },
      _sum: { quantityOnHand: true },
    }),
    prisma.product.findMany({
      where,
      select: { id: true, name: true, sku: true, quantityOnHand: true, lowStockThreshold: true },
      orderBy: { quantityOnHand: "asc" },
    }),
  ]);

  const defaultThreshold = org?.defaultLowStockThreshold ?? 5;
  const totalProducts = totals._count._all;
  const totalUnits = totals._sum.quantityOnHand ?? 0;

  const lowStock = products
    .filter((p) => isLowStock(p.quantityOnHand, p.lowStockThreshold, defaultThreshold))
    .map((p) => ({ ...p, effectiveThreshold: p.lowStockThreshold ?? defaultThreshold }));

  return (
    <>
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">Overview</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
        </div>
        <p className="text-sm text-slate-500">{org?.name}</p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-blue-600 to-blue-500 p-5 text-white shadow-lg shadow-blue-500/20">
          <p className="text-sm text-blue-100">Total products</p>
          <p className="mt-3 text-4xl font-black tracking-tight">{totalProducts}</p>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-emerald-500 to-teal-500 p-5 text-white shadow-lg shadow-emerald-500/20">
          <p className="text-sm text-emerald-100">Total units in stock</p>
          <p className="mt-3 text-4xl font-black tracking-tight">{totalUnits}</p>
        </div>
        <div className="rounded-[24px] border border-red-200 bg-gradient-to-br from-red-500 to-rose-500 p-5 text-white shadow-lg shadow-red-500/20">
          <p className="text-sm text-red-100">Low stock items</p>
          <p className="mt-3 text-4xl font-black tracking-tight">{lowStock.length}</p>
        </div>
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-xl font-bold text-slate-900">Low stock items</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="p-4 font-semibold">Name - SKU</th>
                <th className="p-4 font-semibold">Quantity on hand</th>
                <th className="p-4 font-semibold">Low stock threshold</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.length === 0 && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-slate-500">
                    {totalProducts === 0 ? (
                      <>No products yet. <Link href="/products/new" className="font-medium text-blue-600">Add your first product</Link>.</>
                    ) : (
                      "All products are well stocked."
                    )}
                  </td>
                </tr>
              )}
              {lowStock.map((p) => (
                <tr key={p.id} className="border-b border-slate-200 last:border-0 transition hover:bg-slate-50/80">
                  <td className="p-4">
                    <Link href={`/products/${p.id}/edit`} className="font-semibold text-blue-600 transition hover:text-blue-700">
                      {p.name}
                    </Link>{" "}
                    <span className="text-slate-500">- {p.sku}</span>
                  </td>
                  <td className="p-4 text-slate-700">{p.quantityOnHand}</td>
                  <td className="p-4">
                    <span className="inline-flex rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">
                      {p.effectiveThreshold}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}