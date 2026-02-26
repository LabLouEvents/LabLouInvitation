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

  // 1) Αν δεν υπάρχει token
  if (!t) {
    return (
      <div style={{ padding: 40, fontFamily: "system-ui" }}>
        <h2>Δεν έχεις πρόσβαση</h2>
        <div style={{ opacity: 0.8 }}>Χρειάζεται το ειδικό link του event.</div>
      </div>
    );
  }

  // 2) Fetch event
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

  // 3) Το όνομα που δείχνεις στο EnvelopeIntro
  const inviter = (
    event.inviter_names ||
    event.subtitle ||
    event.title ||
    ""
  ).trim();

  // 4) Κουμπί style
  const btnStyle: React.CSSProperties = {
    padding: "10px 16px",
    borderRadius: 12,
    background: "#6e5a63",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // 5) Google Calendar link (προσωρινά βάζω σταθερές ημερομηνίες για να δουλεύει)
  // Μόλις μου πεις ποια πεδία έχεις (start/end), το κάνουμε 100% δυναμικό.
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(event.title || "Event")}` +
    `&dates=20260912T170000Z/20260912T200000Z` +
    `&details=${encodeURIComponent(`Πρόσκληση: ${base}/${slug}`)}` +
    `&location=${encodeURIComponent(event.venue_name || "")}`;

  // 6) Return
  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginTop: 10, marginBottom: 16, display: "flex", gap: 12 }}>
        <a href={googleUrl} target="_blank" rel="noreferrer" style={btnStyle}>
          Google Calendar
        </a>

        <a href={`/api/calendar/${slug}?t=${encodeURIComponent(t)}`} style={btnStyle}>
          Apple / Outlook
        </a>
      </div>

      <EnvelopeIntro
        slug={slug}
        t={t}
        fromName={inviter}
        backgroundUrl="/intro/background.jpg"
      />
    </div>
  );
}