import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { toDTO } from "@/lib/products";
import ProductsTable from "@/components/ProductsTable";

export default async function ProductsPage() {
  const session = await requireSession();

  const [products, org] = await Promise.all([
    prisma.product.findMany({
      where: { organizationId: session.organizationId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.organization.findUnique({ where: { id: session.organizationId } }),
  ]);

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Products</h1>
      <ProductsTable
        products={products.map(toDTO)}
        defaultThreshold={org?.defaultLowStockThreshold ?? 5}
      />
    </>
  );
}