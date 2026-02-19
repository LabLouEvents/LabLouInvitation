import SectionClient from "../SectionClient";

function toGoogleDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function addHours(iso: string, hours: number) {
  const d = new Date(iso);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

export default async function SectionPage({
  params,
  searchParams,
}: {
  params: { slug: string; section: string };
  searchParams?: { t?: string };
}) {
  const slug = params.slug;
  const section = params.section; // invite | rsvp | church | venue
  const t = searchParams?.t || "";

  if (!t) {
    return <div style={{ padding: 40 }}>Δεν έχεις πρόσβαση.</div>;
  }

  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://lablouinvitations.gr";

  const res = await fetch(
    `${base}/api/public/get-event?slug=${encodeURIComponent(slug)}&t=${encodeURIComponent(t)}`,
    { cache: "no-store" }
  );
  const data = await res.json();

  if (!res.ok || !data.ok || !data.event) {
    return <div style={{ padding: 40 }}>Δεν βρέθηκε event ή δεν έχεις πρόσβαση.</div>;
  }

  const event = data.event;

  const startISO = event.start_iso;
  const endISO = event.end_iso || addHours(event.start_iso, 2);

  const gcalUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(event.title)}` +
    `&dates=${toGoogleDate(startISO)}/${toGoogleDate(endISO)}` +
    `&details=${encodeURIComponent(event.subtitle || "")}` +
    `&location=${encodeURIComponent(
      (event.church_name || "") +
        (event.church_address ? ", " + event.church_address : "")
    )}`;

  return (
    <SectionClient
      event={event}
      slug={slug}
      t={t}
      section={section}
      gcalUrl={gcalUrl}
    />
  );
}