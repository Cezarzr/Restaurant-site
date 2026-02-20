"use client";

import { useEffect, useState } from "react";

type Settings = {
  businessEmail: string;
  businessPhone: string;
  minNoticeHours: number;
  maxTrucks: number;
  defaultTimeSlots: string[];
  notificationEmails: string[];
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setSettings(data));
  }, []);

  if (!settings) return <div className="container py-8">Loading settings...</div>;

  async function save() {
    setStatus("Saving...");
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setStatus(res.ok ? "Saved" : "Failed to save");
  }

  return (
    <div className="container py-8 space-y-4 max-w-2xl">
      <h1 className="text-3xl font-bold">Settings</h1>
      <label className="grid gap-1">Business email<input className="rounded border p-2" value={settings.businessEmail} onChange={(e) => setSettings({ ...settings, businessEmail: e.target.value })} /></label>
      <label className="grid gap-1">Business phone<input className="rounded border p-2" value={settings.businessPhone} onChange={(e) => setSettings({ ...settings, businessPhone: e.target.value })} /></label>
      <label className="grid gap-1">Min notice hours<input type="number" className="rounded border p-2" value={settings.minNoticeHours} onChange={(e) => setSettings({ ...settings, minNoticeHours: Number(e.target.value) })} /></label>
      <label className="grid gap-1">Max trucks<input type="number" className="rounded border p-2" value={settings.maxTrucks} onChange={(e) => setSettings({ ...settings, maxTrucks: Number(e.target.value) })} /></label>
      <label className="grid gap-1">Default time slots (comma-separated)<input className="rounded border p-2" value={settings.defaultTimeSlots.join(",")} onChange={(e) => setSettings({ ...settings, defaultTimeSlots: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></label>
      <label className="grid gap-1">Notification emails (comma-separated)<input className="rounded border p-2" value={settings.notificationEmails.join(",")} onChange={(e) => setSettings({ ...settings, notificationEmails: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></label>
      <button className="rounded bg-brand px-4 py-2 text-white" onClick={save}>Save settings</button>
      {status && <p className="text-sm text-stone-600">{status}</p>}
    </div>
  );
}
