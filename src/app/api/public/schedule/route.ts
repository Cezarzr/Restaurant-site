import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  const type = searchParams.get("type");
  const upcoming = searchParams.get("upcoming") === "true";

  const items = await prisma.scheduleEntry.findMany({
    where: {
      visibility: "PUBLIC",
      ...(city ? { city: { equals: city, mode: "insensitive" } } : {}),
      ...(type ? { tags: { has: type } } : {}),
      ...(upcoming ? { startDateTime: { gte: new Date() } } : {}),
    },
    orderBy: { startDateTime: "asc" },
  });

  return NextResponse.json(items);
}
