import RSVPClient from "@/components/RSVPClient";

export default async function RSVPPage({
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
    "http://localhost:3000";

  const res = await fetch(
    `${base}/api/public/get-event?slug=${encodeURIComponent(
      slug
    )}&t=${encodeURIComponent(t)}`,
    { cache: "no-store" }
  );

  const data = await res.json().catch(() => null);

  const rsvpImageUrl =
    data?.ok && data?.event?.rsvp_image_url
      ? String(data.event.rsvp_image_url)
      : "";

  return <RSVPClient slug={slug} t={t} rsvpImageUrl={rsvpImageUrl} />;
}