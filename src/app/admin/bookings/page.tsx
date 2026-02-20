import { prisma } from "@/lib/db";

export default async function AdminBookingsPage() {
  const bookings = await prisma.bookingRequest.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Manage Bookings</h1>
      <div className="mt-4 overflow-auto rounded border bg-white">
        <table className="w-full text-sm">
          <thead><tr className="border-b"><th className="p-2 text-left">Name</th><th className="p-2">Date</th><th className="p-2">Status</th><th className="p-2">Conflict</th></tr></thead>
          <tbody>
            {bookings.map((b) => <tr key={b.id} className="border-b"><td className="p-2">{b.name}</td><td className="p-2">{b.eventDate.toISOString()}</td><td className="p-2">{b.status}</td><td className="p-2">{b.conflictFlag ? "Yes" : "No"}</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
