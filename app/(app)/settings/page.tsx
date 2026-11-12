import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth";
import SettingsForm from "@/components/SettingsForm";

export default async function SettingsPage() {
  const session = await requireSession();
  const org = await prisma.organization.findUnique({ where: { id: session.organizationId } });

  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Settings</h1>
      <SettingsForm initialThreshold={org?.defaultLowStockThreshold ?? 5} />
    </>
  );
}