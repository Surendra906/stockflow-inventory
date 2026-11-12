import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import { toDTO } from "@/lib/products";
import ProductForm from "@/components/ProductForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;

  // Again filtered by organizationId, so another org's product ID returns 404
  const product = await prisma.product.findFirst({
    where: { id, organizationId: session.organizationId },
  });
  if (!product) notFound();

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Edit product</h1>
      <ProductForm initial={toDTO(product)} />
    </>
  );
}