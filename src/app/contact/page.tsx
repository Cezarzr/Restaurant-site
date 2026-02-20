"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Sending...");
    const res = await fetch("/api/public/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    setStatus(res.ok ? "Message sent successfully." : "Message failed to send.");
    if (res.ok) {
      setName("");
      setEmail("");
      setMessage("");
    }
  }

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold">Contact</h1>
      <form onSubmit={submit} className="grid gap-3 max-w-xl">
        <input required className="rounded border p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input required type="email" className="rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <textarea required className="rounded border p-2" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button className="rounded bg-brand px-4 py-2 text-white">Send</button>
      </form>
      {status && <p className="text-sm text-stone-600">{status}</p>}
    </div>
  );
}
