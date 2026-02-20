"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: string;
  name: string;
  eventDate: string;
  status: string;
  conflictFlag: boolean;
  email: string;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/bookings", { cache: "no-store" });
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  }

  useEffect(() => { void load(); }, []);

  async function updateStatus(id: string, status: "CONFIRMED" | "DECLINED" | "CONTACTED") {
    await fetch("/api/admin/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, blockSlot: status === "CONFIRMED" }),
    });
    await load();
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Manage Bookings</h1>
      {loading ? <p className="mt-4">Loading...</p> : (
        <div className="mt-4 overflow-auto rounded border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">Conflict</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-b">
                  <td className="p-2">{b.name}</td>
                  <td className="p-2">{b.email}</td>
                  <td className="p-2">{new Date(b.eventDate).toLocaleString()}</td>
                  <td className="p-2">{b.status}</td>
                  <td className="p-2">{b.conflictFlag ? "Yes" : "No"}</td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <button className="rounded border px-2 py-1" onClick={() => updateStatus(b.id, "CONFIRMED")}>Confirm</button>
                      <button className="rounded border px-2 py-1" onClick={() => updateStatus(b.id, "DECLINED")}>Decline</button>
                      <button className="rounded border px-2 py-1" onClick={() => updateStatus(b.id, "CONTACTED")}>Contacted</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
