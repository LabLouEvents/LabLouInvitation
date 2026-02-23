import EnvelopeIntro from "@/components/EnvelopeIntro";

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

  if (!res.ok || !data.ok || !data.event) {
    return (
      <div style={{ padding: 40, fontFamily: "system-ui" }}>
        Δεν βρέθηκε event ή δεν έχεις πρόσβαση.
      </div>
    );
  }

  const event = data.event;
  const inviter = (event.inviter_names || event.subtitle || event.title || "").trim();

  return (
    <EnvelopeIntro
  slug={slug}
  t={t}
  fromName={inviter}
  backgroundUrl="/intro/background.jpg"
/>
  );
}