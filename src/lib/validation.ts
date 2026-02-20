import { z } from "zod";

export const bookingSchema = z.object({
  type: z.enum(["TRUCK", "INQUIRY"]),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  company: z.string().optional(),
  numberOfPeople: z.coerce.number().int().positive().optional(),
  eventDate: z.string().datetime(),
  timeFrame: z.string().min(2),
  address: z.string().min(3),
  eventType: z.string().min(2),
  paymentType: z.string().optional(),
  numberOfTrucks: z.coerce.number().int().positive().optional(),
  message: z.string().optional(),
});

export const scheduleSchema = z.object({
  title: z.string().min(2),
  startDateTime: z.string().datetime(),
  endDateTime: z.string().datetime(),
  address: z.string().min(3),
  city: z.string().min(2),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
  bookingOpen: z.boolean().default(true),
  capacity: z.number().int().positive().optional(),
  notes: z.string().optional(),
  recurrenceRule: z.string().optional(),
});
