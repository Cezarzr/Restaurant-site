import { BookingStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/admin-guard";
import { prisma } from "@/lib/db";
import { sendBookingStatusEmail } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const status = new URL(req.url).searchParams.get("status") as BookingStatus | null;
  const conflict = new URL(req.url).searchParams.get("conflict");
  const items = await prisma.bookingRequest.findMany({
    where: { ...(status ? { status } : {}), ...(conflict ? { conflictFlag: conflict === "true" } : {}) },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function PATCH(req: NextRequest) {
  try { await requireAdmin(); } catch { return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); }
  const { id, status, blockSlot } = await req.json();
  const booking = await prisma.bookingRequest.update({ where: { id }, data: { status } });
  if (status === BookingStatus.CONFIRMED && blockSlot) {
    await prisma.scheduleEntry.create({
      data: {
        title: `Booked: ${booking.name}`,
        startDateTime: booking.eventDate,
        endDateTime: new Date(booking.eventDate.getTime() + 2 * 60 * 60 * 1000),
        address: booking.address,
        city: "Booked",
        tags: ["Private Event"],
        visibility: "PRIVATE",
        bookingOpen: false,
      },
    });
  }
  if ([BookingStatus.CONFIRMED, BookingStatus.DECLINED].includes(status)) {
    await sendBookingStatusEmail(booking, status);
  }
  return NextResponse.json(booking);
}
