import { prisma } from "@/lib/db";
import { bookingSchema } from "@/lib/validation";
import { hasBookingConflict, suggestNearbyTimes } from "@/lib/conflict";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendBookingEmails } from "@/lib/email";

export async function POST(req: NextRequest) {
  const forwarded = req.headers.get("x-forwarded-for") ?? "local";
  const ip = forwarded.split(",")[0]?.trim() || "local";
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many requests", retryAfter: limit.retryAfter }, { status: 429 });
  }

  const body = await req.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  const eventDate = new Date(data.eventDate);
  const conflictFlag = await hasBookingConflict(prisma, eventDate, data.timeFrame);

  const booking = await prisma.bookingRequest.create({
    data: {
      ...data,
      eventDate,
      conflictFlag,
    },
  });

  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  const recipients = settings?.notificationEmails?.length
    ? settings.notificationEmails
    : [settings?.businessEmail ?? process.env.ADMIN_EMAIL ?? ""].filter(Boolean);

  await sendBookingEmails(booking, recipients);

  return NextResponse.json({ booking, suggestions: conflictFlag ? suggestNearbyTimes(data.timeFrame) : [] }, { status: 201 });
}
