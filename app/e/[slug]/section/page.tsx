import SectionClient from "@/components/SectionClient";

export default async function SectionPage({
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
        <div style={{ opacity: 0.8 }}>Χρειάζεται το ειδικό link του event.</div>
      </div>
    );
  }

  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://lablouinvitations.gr";

  const res = await fetch(
    `${base}/api/public/get-event?slug=${encodeURIComponent(slug)}&t=${encodeURIComponent(t)}`,
    { cache: "no-store" }
  );
  const data = await res.json();

  if (!res.ok || !data?.ok || !data?.event) {
    return (
      <div style={{ padding: 40, fontFamily: "system-ui" }}>
        Δεν βρέθηκε event ή δεν έχεις πρόσβαση.
      </div>
    );
  }

  const event = data.event;

  const venueMapUrl =
    event.venue_map_url ||
    (event.venue_address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue_address)}`
      : "");

  const churchMapUrl =
    event.church_map_url ||
    (event.church_address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.church_address)}`
      : "");

  return (
    <SectionClient
      slug={slug}
      t={t}
      venueName={event.venue_name || "Κέντρο"}
      churchName={event.church_name || "Εκκλησία"}
      venueMapUrl={venueMapUrl}
      churchMapUrl={churchMapUrl}
    />
  );
}