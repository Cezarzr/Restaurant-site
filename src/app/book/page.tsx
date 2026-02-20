"use client";

import { useState } from "react";

const initial = { type: "TRUCK", name: "", email: "", phone: "", company: "", numberOfPeople: "", eventDate: "", timeFrame: "12:00-14:00", address: "", eventType: "Catering", paymentType: "", numberOfTrucks: "1", message: "" };

export default function BookPage() {
  const [form, setForm] = useState(initial);
  const [result, setResult] = useState<string>("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/public/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, eventDate: new Date(form.eventDate).toISOString(), numberOfPeople: form.numberOfPeople ? Number(form.numberOfPeople) : undefined, numberOfTrucks: form.numberOfTrucks ? Number(form.numberOfTrucks) : undefined }) });
    const data = await res.json();
    if (!res.ok) return setResult(data.error ? "Could not submit." : "Submission failed");
    setResult(data.booking.conflictFlag ? `Submitted with conflict warning. Suggested: ${data.suggestions.join(", ")}` : "Booking submitted successfully!");
    setForm(initial);
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Book our truck</h1>
      <form onSubmit={submit} className="mt-6 grid gap-3 md:grid-cols-2">
        {Object.entries(form).map(([k, v]) => (
          k === "message" ? <textarea key={k} value={v} onChange={(e) => setForm({ ...form, [k]: e.target.value })} placeholder={k} className="rounded border p-2 md:col-span-2" /> :
          <input key={k} value={v} type={k === "eventDate" ? "datetime-local" : "text"} onChange={(e) => setForm({ ...form, [k]: e.target.value })} placeholder={k} className="rounded border p-2" />
        ))}
        <button className="rounded bg-brand px-4 py-2 text-white md:col-span-2">Submit booking</button>
      </form>
      {result && <p className="mt-4 rounded bg-amber-100 p-3">{result}</p>}
    </div>
  );
}
