import nodemailer from "nodemailer";
import { BookingStatus, type BookingRequest } from "@prisma/client";

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendBookingEmails(booking: BookingRequest, recipients: string[]) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_FROM) return;
  const transporter = getTransporter();
  const details = `<ul><li>Name: ${booking.name}</li><li>Date: ${booking.eventDate.toISOString()}</li><li>Time: ${booking.timeFrame}</li><li>Type: ${booking.eventType}</li></ul>`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: recipients.join(","),
    subject: `New booking request: ${booking.name}`,
    html: `<h2>The Local Lebanese - New Booking</h2>${details}`,
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: booking.email,
    subject: "We received your booking request",
    html: `<h2>Thanks ${booking.name}!</h2><p>We received your request and will follow up soon.</p>${details}`,
  });
}

export async function sendBookingStatusEmail(booking: BookingRequest, status: BookingStatus) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_FROM) return;
  const transporter = getTransporter();
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: booking.email,
    subject: `Your booking was ${status.toLowerCase()}`,
    html: `<h2>Booking ${status}</h2><p>Hello ${booking.name}, your booking request status is now <strong>${status}</strong>.</p>`,
  });
}
