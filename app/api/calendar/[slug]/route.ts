import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }git status
) {
  const { slug } = params;

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // ⚠️ Βάλε σωστή ημερομηνία & ώρα εδώ
  const start = "20260912T170000Z";
  const end = "20260912T200000Z";

  const ics = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.title}
DESCRIPTION:Παρακαλούμε απαντήστε έως 5 Ιουνίου\\nhttps://lablouinvitations.gr/${slug}
LOCATION:${event.venue_name || ""}
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Υπενθύμιση RSVP
END:VALARM
END:VEVENT
END:VCALENDAR
`;

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar",
      "Content-Disposition": "attachment; filename=event.ics",
    },
  });
}