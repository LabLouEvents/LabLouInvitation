import { notFound } from "next/navigation";
import EventClient from "./EventClient";

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

  // ✅ Αν δεν έχει token, δεν δίνουμε πρόσβαση
  if (!t) {
    return (
      <div style={{ padding: 40, fontFamily: "system-ui" }}>
        <h2>Δεν έχεις πρόσβαση</h2>
        <div style={{ opacity: 0.8 }}>Χρειάζεται το ειδικό link του event.</div>
      </div>
    );
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL || "";
  const res = await fetch(
    `${base}/api/public/get-event?slug=${encodeURIComponent(slug)}&t=${encodeURIComponent(t)}`,
    { cache: "no-store" }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.ok || !data?.event) {
    notFound();
  }

  const event = data.event;

  // fallback end
  const endISO = event.end_iso || addHours(event.start_iso, 2);

  return (
    <EventClient
      slug={slug}
      token={t}
      event={{
        ...event,
        end_iso: endISO,
      }}
    />
  );
}