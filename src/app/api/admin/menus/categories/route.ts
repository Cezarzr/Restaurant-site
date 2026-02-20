import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  return NextResponse.json(await prisma.menuCategory.findMany({ include: { items: { orderBy: { sortOrder: "asc" } } }, orderBy: { sortOrder: "asc" } }));
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const data = await req.json();
  return NextResponse.json(await prisma.menuCategory.create({ data }), { status: 201 });
}

export async function PATCH(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const { id, ...data } = await req.json();
  return NextResponse.json(await prisma.menuCategory.update({ where: { id }, data }));
}

export async function DELETE(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.menuCategory.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
