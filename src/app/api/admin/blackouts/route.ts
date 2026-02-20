import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { NextRequest, NextResponse } from "next/server";

export async function GET() { try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
return NextResponse.json(await prisma.blackoutRange.findMany({ orderBy: { start: "asc" } })); }

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const data = await req.json();
  const created = await prisma.blackoutRange.create({ data: { ...data, start: new Date(data.start), end: new Date(data.end) } });
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.blackoutRange.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
