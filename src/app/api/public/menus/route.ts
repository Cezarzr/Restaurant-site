import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const categories = await prisma.menuCategory.findMany({
    where: { isActive: true },
    include: { items: { where: { available: true }, orderBy: { sortOrder: "asc" } } },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(categories);
}
