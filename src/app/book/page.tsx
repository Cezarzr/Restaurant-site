"use client";

import { useState } from "react";

type FormState = {
  type: "TRUCK" | "INQUIRY";
  name: string;
  email: string;
  phone: string;
  company: string;
  numberOfPeople: string;
  eventDate: string;
  timeFrame: string;
  address: string;
  eventType: string;
  paymentType: string;
  numberOfTrucks: string;
  message: string;
};

const initial: FormState = {
  type: "TRUCK",
  name: "",
  email: "",
  phone: "",
  company: "",
  numberOfPeople: "",
  eventDate: "",
  timeFrame: "12:00-14:00",
  address: "",
  eventType: "Catering",
  paymentType: "Invoice",
  numberOfTrucks: "1",
  message: "",
};

export default function BookPage() {
  const [form, setForm] = useState<FormState>(initial);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult("");

    const payload = {
      ...form,
      eventDate: new Date(form.eventDate).toISOString(),
      numberOfPeople: form.numberOfPeople ? Number(form.numberOfPeople) : undefined,
      numberOfTrucks: form.numberOfTrucks ? Number(form.numberOfTrucks) : undefined,
    };

    const res = await fetch("/api/public/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setResult("Could not submit booking. Please review your details.");
      return;
    }

    setResult(
      data.booking.conflictFlag
        ? `Submitted with conflict warning. Suggested: ${data.suggestions.join(", ")}`
        : "Booking submitted successfully!",
    );
    setForm(initial);
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Book our truck</h1>
      <p className="mt-2 text-stone-600">We always store your request, even if the selected slot conflicts.</p>

      <form onSubmit={submit} className="mt-6 grid gap-3 md:grid-cols-2">
        <label className="grid gap-1">
          Booking type
          <select aria-label="booking-type" className="rounded border p-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as FormState["type"] })}>
            <option value="TRUCK">Book our truck</option>
            <option value="INQUIRY">Reservation/Order inquiry</option>
          </select>
        </label>
        <label className="grid gap-1">Name<input aria-label="name" required className="rounded border p-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label className="grid gap-1">Email<input aria-label="email" required type="email" className="rounded border p-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label className="grid gap-1">Phone<input aria-label="phone" required className="rounded border p-2" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
        <label className="grid gap-1">Company<input className="rounded border p-2" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></label>
        <label className="grid gap-1">People<input type="number" className="rounded border p-2" value={form.numberOfPeople} onChange={(e) => setForm({ ...form, numberOfPeople: e.target.value })} /></label>
        <label className="grid gap-1">Event date/time<input aria-label="eventDate" required type="datetime-local" className="rounded border p-2" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} /></label>
        <label className="grid gap-1">Time frame<input required className="rounded border p-2" value={form.timeFrame} onChange={(e) => setForm({ ...form, timeFrame: e.target.value })} placeholder="12:00-14:00" /></label>
        <label className="grid gap-1">Address<input aria-label="address" required className="rounded border p-2" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
        <label className="grid gap-1">Event type<input required className="rounded border p-2" value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} /></label>
        <label className="grid gap-1">Payment type<input className="rounded border p-2" value={form.paymentType} onChange={(e) => setForm({ ...form, paymentType: e.target.value })} /></label>
        <label className="grid gap-1">Number of trucks<input type="number" className="rounded border p-2" value={form.numberOfTrucks} onChange={(e) => setForm({ ...form, numberOfTrucks: e.target.value })} /></label>
        <label className="grid gap-1 md:col-span-2">Message<textarea className="rounded border p-2" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></label>

        <button disabled={loading} className="rounded bg-brand px-4 py-2 text-white md:col-span-2 disabled:opacity-70">{loading ? "Submitting..." : "Submit booking"}</button>
      </form>

      {result && <p className="mt-4 rounded bg-amber-100 p-3">{result}</p>}
    </div>
  );
}
