import EventClient from "./EventClient";

function toGoogleDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function addHours(iso: string, hours: number) {
  const d = new Date(iso);
  d.setHours(d.getHours() + hours);
  return d.toISOString();
}

export default async function EventPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { t?: string };
}) {
  const slug = params.slug;
  const t = searchParams?.t || "";

  if (!t) {
    return (
      <div style={{ padding: 40, fontFamily: "system-ui" }}>
        <h2>Δεν έχεις πρόσβαση</h2>
        <div style={{ opacity: 0.8 }}>
          Χρειάζεται το ειδικό link του event.
        </div>
      </div>
    );
  }

  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://lablouinvitations.gr";

  const res = await fetch(
    `${base}/api/public/get-event?slug=${encodeURIComponent(
      slug
    )}&t=${encodeURIComponent(t)}`,
    { cache: "no-store" }
  );

  const data = await res.json();

  if (!res.ok || !data.ok || !data.event) {
    return (
      <div style={{ padding: 40, fontFamily: "system-ui" }}>
        Δεν βρέθηκε event ή δεν έχεις πρόσβαση.
      </div>
    );
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
    <div
      style={{
        minHeight: "100vh",
        padding: 32,
        background:
          "radial-gradient(circle at 30% 10%, #f4f5f8 0%, #eef1f6 50%, #e6eaf0 100%)",
      }}
    >
      <EventClient event={event} slug={slug} gcalUrl={gcalUrl} />
    </div>
  );
}