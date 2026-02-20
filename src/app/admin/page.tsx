import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function AdminHome() {
  const [upcoming, pending] = await Promise.all([
    prisma.scheduleEntry.findMany({ where: { startDateTime: { gte: new Date() } }, orderBy: { startDateTime: "asc" }, take: 5 }),
    prisma.bookingRequest.count({ where: { status: "PENDING" } }),
  ]);

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>Pending bookings: <strong>{pending}</strong></p>
      <div className="flex gap-3 text-sm">
        <Link href="/admin/schedule" className="rounded border px-3 py-2">Manage Schedule</Link>
        <Link href="/admin/menus" className="rounded border px-3 py-2">Manage Menus</Link>
        <Link href="/admin/bookings" className="rounded border px-3 py-2">Manage Bookings</Link>
        <Link href="/admin/settings" className="rounded border px-3 py-2">Settings</Link>
      </div>
      <ul className="space-y-2">
        {upcoming.map((e) => <li key={e.id} className="rounded border p-2">{e.title} — {e.startDateTime.toISOString()}</li>)}
      </ul>
    </div>
  );
}
