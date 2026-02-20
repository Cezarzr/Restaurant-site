import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { NextRequest, NextResponse } from "next/server";

export async function GET() { try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  return NextResponse.json(await prisma.menuCategory.findMany({ include: { items: true }, orderBy: { sortOrder: "asc" } }));
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
