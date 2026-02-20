"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export function AdminCalendar({ events }: { events: Array<{ id: string; title: string; startDateTime: string; endDateTime: string }> }) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      editable
      eventDrop={async (info) => {
        await fetch("/api/admin/schedule", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: info.event.id, startDateTime: info.event.start?.toISOString(), endDateTime: info.event.end?.toISOString() }),
        });
      }}
      initialView="timeGridWeek"
      events={events.map((e) => ({ id: e.id, title: e.title, start: e.startDateTime, end: e.endDateTime }))}
      height="auto"
    />
  );
}
