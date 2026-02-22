import EnvelopeIntro from "@/components/EnvelopeIntro";

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

  // 👇 Εδώ δείχνουμε ΜΟΝΟ envelope
  return <EnvelopeIntro slug={slug} />;
}