import { PublicCalendar } from "@/components/public-calendar";
import { prisma } from "@/lib/db";

export default async function SchedulePage({ searchParams }: { searchParams: Promise<{ city?: string; type?: string; upcoming?: string }> }) {
  const params = await searchParams;
  const events = await prisma.scheduleEntry.findMany({
    where: {
      visibility: "PUBLIC",
      ...(params.city ? { city: { equals: params.city, mode: "insensitive" } } : {}),
      ...(params.type ? { tags: { has: params.type } } : {}),
      ...(params.upcoming === "true" ? { startDateTime: { gte: new Date() } } : {}),
    },
    orderBy: { startDateTime: "asc" },
  });

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold">Live Schedule</h1>
      <form className="grid gap-3 md:grid-cols-4">
        <input name="city" placeholder="City" className="rounded border p-2" defaultValue={params.city} />
        <input name="type" placeholder="Type tag" className="rounded border p-2" defaultValue={params.type} />
        <label className="flex items-center gap-2"><input type="checkbox" name="upcoming" value="true" defaultChecked={params.upcoming === "true"}/>Only upcoming</label>
        <button className="rounded bg-brand px-4 py-2 text-white">Apply</button>
      </form>
      <PublicCalendar events={events.map((e) => ({ ...e, startDateTime: e.startDateTime.toISOString(), endDateTime: e.endDateTime.toISOString() }))} />
    </div>
  );
}
