import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-guard";
import { NextRequest, NextResponse } from "next/server";

const baseDefaults = {
  id: "singleton",
  defaultTimeSlots: ["10:00-12:00", "12:00-14:00"],
  notificationEmails: [],
  businessEmail: "hello@example.com",
  businessPhone: "+1",
};

export async function GET() {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const settings = await prisma.siteSettings.upsert({ where: { id: "singleton" }, update: {}, create: baseDefaults });
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const data = await req.json();
  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: data,
    create: { ...baseDefaults, ...data },
  });
  return NextResponse.json(settings);
}
