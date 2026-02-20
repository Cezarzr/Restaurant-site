import Link from "next/link";
import { prisma } from "@/lib/db";
import { format } from "date-fns";

export default async function HomePage() {
  const now = new Date();
  const [today, upcoming] = await Promise.all([
    prisma.scheduleEntry.findFirst({ where: { startDateTime: { lte: now }, endDateTime: { gte: now }, visibility: "PUBLIC" } }),
    prisma.scheduleEntry.findMany({ where: { startDateTime: { gte: now }, visibility: "PUBLIC" }, orderBy: { startDateTime: "asc" }, take: 3 }),
  ]);

  return (
    <div className="container py-10 space-y-10">
      <section className="rounded-2xl bg-brand p-8 text-white">
        <h1 className="text-4xl font-bold">Fresh Lebanese food, now with a live schedule.</h1>
        <p className="mt-3 text-lg">Track the truck, browse menus, and request catering in minutes.</p>
        <Link href="/book" className="mt-5 inline-block rounded bg-accent px-5 py-3 font-semibold text-stone-900">Book Us</Link>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Today&apos;s Location</h2>
          {today ? (
            <div className="mt-3">
              <p className="font-medium">{today.title}</p>
              <p>{today.address}</p>
              <p>{format(today.startDateTime, "PPP p")} - {format(today.endDateTime, "p")}</p>
            </div>
          ) : <p className="mt-3 text-stone-600">No public stop posted for today.</p>}
        </div>
        <div className="rounded-xl border bg-white p-6">
          <h2 className="text-xl font-semibold">Next 3 Stops</h2>
          <ul className="mt-3 space-y-2">
            {upcoming.map((item) => (
              <li key={item.id} className="rounded border p-2">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm">{format(item.startDateTime, "PPP p")} · {item.city}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
