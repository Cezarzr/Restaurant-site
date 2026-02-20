import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { scheduleSchema } from "@/lib/validation";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const entries = await prisma.scheduleEntry.findMany({ orderBy: { startDateTime: "asc" } });
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const parsed = scheduleSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  const entry = await prisma.scheduleEntry.create({ data: { ...data, startDateTime: new Date(data.startDateTime), endDateTime: new Date(data.endDateTime) } });
  return NextResponse.json(entry, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const body = await req.json();
  const id = body.id as string | undefined;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const parsed = scheduleSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  const entry = await prisma.scheduleEntry.update({
    where: { id },
    data: {
      ...data,
      ...(data.startDateTime ? { startDateTime: new Date(data.startDateTime) } : {}),
      ...(data.endDateTime ? { endDateTime: new Date(data.endDateTime) } : {}),
    },
  });
  return NextResponse.json(entry);
}

export async function DELETE(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await prisma.scheduleEntry.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
