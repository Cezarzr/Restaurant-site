import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(5),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!process.env.SMTP_HOST || !process.env.SMTP_FROM) {
    return NextResponse.json({ ok: true, note: "SMTP not configured; message accepted." }, { status: 202 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const to = settings?.businessEmail ?? process.env.ADMIN_EMAIL;
  if (!to) return NextResponse.json({ ok: true }, { status: 202 });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Contact form message from ${parsed.data.name}`,
    html: `<p><strong>Name:</strong> ${parsed.data.name}</p><p><strong>Email:</strong> ${parsed.data.email}</p><p>${parsed.data.message}</p>`,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
