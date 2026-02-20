import { prisma } from "@/lib/db";
import { bookingSchema } from "@/lib/validation";
import { hasBookingConflict, suggestNearbyTimes } from "@/lib/conflict";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendBookingEmails } from "@/lib/email";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many requests", retryAfter: limit.retryAfter }, { status: 429 });
  }

  const body = await req.json();
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const data = parsed.data;
  const conflictFlag = await hasBookingConflict(prisma, new Date(data.eventDate), data.timeFrame);

  const booking = await prisma.bookingRequest.create({
    data: {
      ...data,
      eventDate: new Date(data.eventDate),
      conflictFlag,
    },
  });

  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  await sendBookingEmails(booking, settings?.notificationEmails ?? [settings?.businessEmail ?? process.env.ADMIN_EMAIL ?? ""]);

  return NextResponse.json({ booking, suggestions: conflictFlag ? suggestNearbyTimes(data.timeFrame) : [] }, { status: 201 });
}
