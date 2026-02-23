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

  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://lablouinvitations.gr";

  const res = await fetch(
    `${base}/api/public/get-event?slug=${encodeURIComponent(slug)}&t=${encodeURIComponent(t)}`,
    { cache: "no-store" }
  );

  const data = await res.json().catch(() => null);
  const rsvpImageUrl = data?.event?.rsvp_image_url || "";

  return <RSVPClient slug={slug} t={t} rsvpImageUrl={rsvpImageUrl} />;
}