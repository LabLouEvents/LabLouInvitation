import { NextResponse } from "next/server";
import { events } from "@/data/events";

function toICSUTC(iso: string) {
  // iso π.χ. "2026-07-12T18:30:00+03:00"
  // το Date το γυρνάει σε UTC και εμείς το γράφουμε σαν YYYYMMDDTHHMMSSZ
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${y}${m}${day}T${hh}${mm}${ss}Z`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") || "demo";

  const event: any = (events as any)[slug];
  if (!event) return new NextResponse("Not found", { status: 404 });

  // Χρησιμοποιούμε startISO/endISO (τα έχεις ήδη στο events.ts)
  const dtStart = toICSUTC(event.startISO);
  const dtEnd = event.endISO ? toICSUTC(event.endISO) : "";

  const title = String(event.title || "").replace(/\n/g, " ");
  const location = String(event.churchName || "").replace(/\n/g, " ");

  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RSVP Invitations//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${slug}@rsvp`,
    `DTSTAMP:${toICSUTC(new Date().toISOString())}`,
    `DTSTART:${dtStart}`,
    dtEnd ? `DTEND:${dtEnd}` : "",
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);

  const ics = icsLines.join("\r\n");

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.ics"`,
    },
  });
}