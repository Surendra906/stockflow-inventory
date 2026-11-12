import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const schema = z.object({
  defaultLowStockThreshold: z
    .number({ message: "Enter a valid number" })
    .int("Threshold must be a whole number")
    .min(0, "Threshold cannot be negative"),
});

export async function PUT(req) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  await prisma.organization.update({
    where: { id: session.organizationId }, // from the session
    data: { defaultLowStockThreshold: parsed.data.defaultLowStockThreshold },
  });
  return NextResponse.json({ ok: true });
}