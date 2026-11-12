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
      <h1 className="mb-1 text-2xl font-bold">Dashboard</h1>
      <p className="mb-6 text-sm text-gray-500">{org?.name}</p>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Total products</p>
          <p className="mt-1 text-3xl font-bold">{totalProducts}</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Total units in stock</p>
          <p className="mt-1 text-3xl font-bold">{totalUnits}</p>
        </div>
        <div className="rounded-lg bg-white p-5 shadow">
          <p className="text-sm text-gray-500">Low stock items</p>
          <p className="mt-1 text-3xl font-bold text-red-600">{lowStock.length}</p>
        </div>
      </div>

      <h2 className="mb-3 text-lg font-semibold">Low stock items</h2>
      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-gray-600">
            <tr>
              <th className="p-3">Name - SKU</th>
              <th className="p-3">Quantity on hand</th>
              <th className="p-3">Low stock threshold</th>
            </tr>
          </thead>
          <tbody>
            {lowStock.length === 0 && (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-500">
                  {totalProducts === 0 ? (
                    <>No products yet. <Link href="/products/new" className="text-blue-600">Add your first product</Link>.</>
                  ) : (
                    "All products are well stocked."
                  )}
                </td>
              </tr>
            )}
            {lowStock.map((p) => (
              <tr key={p.id} className="border-b last:border-0">
                <td className="p-3">
                  <Link href={`/products/${p.id}/edit`} className="font-medium text-blue-600">
                    {p.name}
                  </Link>{" "}
                  <span className="text-gray-500">- {p.sku}</span>
                </td>
                <td className="p-3">{p.quantityOnHand}</td>
                <td className="p-3">{p.effectiveThreshold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}