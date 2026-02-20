import { BookingStatus, type PrismaClient } from "@prisma/client";

export async function hasBookingConflict(
  prisma: PrismaClient,
  eventDate: Date,
  timeFrame: string,
): Promise<boolean> {
  const [startStr, endStr] = timeFrame.split("-").map((v) => v.trim());
  const [startH, startM] = startStr.split(":").map(Number);
  const [endH, endM] = endStr.split(":").map(Number);

  const start = new Date(eventDate);
  start.setHours(startH || 0, startM || 0, 0, 0);
  const end = new Date(eventDate);
  end.setHours(endH || 23, endM || 59, 0, 0);

  const blackout = await prisma.blackoutRange.findFirst({
    where: { start: { lte: end }, end: { gte: start } },
  });

  if (blackout) return true;

  const scheduleConflict = await prisma.scheduleEntry.findFirst({
    where: {
      bookingOpen: false,
      startDateTime: { lte: end },
      endDateTime: { gte: start },
    },
  });

  if (scheduleConflict) return true;

  const confirmedBooking = await prisma.bookingRequest.findFirst({
    where: {
      status: BookingStatus.CONFIRMED,
      eventDate: {
        gte: new Date(start.getFullYear(), start.getMonth(), start.getDate()),
        lt: new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1),
      },
      timeFrame,
    },
  });

  return Boolean(confirmedBooking);
}

export function suggestNearbyTimes(timeFrame: string) {
  const suggestions = ["10:00-12:00", "12:00-14:00", "16:00-18:00", "18:00-20:00"];
  return suggestions.filter((slot) => slot !== timeFrame).slice(0, 3);
}
