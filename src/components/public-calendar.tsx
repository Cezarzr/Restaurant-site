"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

export function PublicCalendar({ events }: { events: Array<{ id: string; title: string; startDateTime: string; endDateTime: string }> }) {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,listWeek" }}
      events={events.map((e) => ({ id: e.id, title: e.title, start: e.startDateTime, end: e.endDateTime }))}
      height="auto"
    />
  );
}
