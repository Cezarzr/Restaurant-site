import { prisma } from "@/lib/db";
import { AdminCalendar } from "@/components/admin-calendar";

export default async function AdminSchedulePage() {
  const events = await prisma.scheduleEntry.findMany({ orderBy: { startDateTime: "asc" } });
  const blackouts = await prisma.blackoutRange.findMany({ orderBy: { start: "asc" } });
  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold">Manage Schedule</h1>
      <AdminCalendar events={events.map((e) => ({ ...e, startDateTime: e.startDateTime.toISOString(), endDateTime: e.endDateTime.toISOString() }))} />
      <h2 className="text-xl font-semibold">Blackout dates</h2>
      <ul>{blackouts.map((b) => <li key={b.id}>{b.start.toISOString()} - {b.end.toISOString()} ({b.reason})</li>)}</ul>
    </div>
  );
}
