import { redirect } from "next/navigation";
import RSVPForm from "../RSVPForm";

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
  params: { slug: string; section: "invite" | "rsvp" | "church" | "venue" };
  searchParams?: { t?: string };
}) {
  const { slug, section } = params;
  const t = searchParams?.t || "";
  if (!t) redirect(`/e/${slug}`);

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
      (event.church_name || "") + (event.church_address ? ", " + event.church_address : "")
    )}`;

  const pageBg = "/intro/background.jpg";

  const overlay = "rgba(0,0,0,0.22)"; // 👈 transparency “αχνό” (μικρότερο = πιο αχνό)

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 22,
        backgroundImage: `linear-gradient(${overlay}, ${overlay}), url(${pageBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <a
          href={`/e/${encodeURIComponent(slug)}?t=${encodeURIComponent(t)}`}
          style={{
            display: "inline-block",
            marginBottom: 14,
            color: "white",
            fontWeight: 800,
            textDecoration: "none",
            textShadow: "0 3px 14px rgba(0,0,0,0.55)",
          }}
        >
          ← Πίσω
        </a>

        <div
          style={{
            borderRadius: 18,
            padding: 18,
            background: "rgba(255,255,255,0.88)",
            color: "#111",
            boxShadow: "0 18px 60px rgba(0,0,0,0.18)",
            backdropFilter: "blur(6px)",
          }}
        >
          {section === "invite" && (
            <>
              <h2 style={{ marginTop: 0 }}>Προσκλητήριο</h2>
              <div style={{ fontWeight: 900 }}>{event.title}</div>
              {event.subtitle && <div style={{ marginTop: 6 }}>{event.subtitle}</div>}
              {event.date_text && <div style={{ marginTop: 10 }}>Ημερομηνία: <b>{event.date_text}</b></div>}
              {event.time_text && <div style={{ marginTop: 6 }}>Ώρα: <b>{event.time_text}</b></div>}
              {event.extra_note && <div style={{ marginTop: 10 }}>{event.extra_note}</div>}
            </>
          )}

          {section === "rsvp" && (
            <>
              <h2 style={{ marginTop: 0 }}>RSVP</h2>

              {event.rsvp_deadline && (
                <div style={{ marginBottom: 10, fontWeight: 700 }}>
                  Παρακαλούμε απαντήστε έως:{" "}
                  <span style={{ textDecoration: "underline" }}>{event.rsvp_deadline}</span>
                </div>
              )}

              <a
                className="e-btn e-btn-link"
                href={gcalUrl}
                target="_blank"
                rel="noreferrer"
              >
                Προσθήκη στο Google Calendar
              </a>

              <a
                className="e-btn e-btn-link"
                href={`/api/ics?slug=${encodeURIComponent(slug)}`}
              >
                Προσθήκη στο iPhone / Apple Calendar
              </a>

              <div style={{ height: 14 }} />
              <RSVPForm slug={slug} />
            </>
          )}

          {section === "church" && (
            <>
              <h2 style={{ marginTop: 0 }}>Εκκλησία</h2>
              <div style={{ fontWeight: 900 }}>{event.church_name || "-"}</div>
              {event.church_address && <div style={{ marginTop: 6 }}>{event.church_address}</div>}
              {event.church_map_url && (
                <a
                  href={event.church_map_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "inline-block", marginTop: 10, fontWeight: 800 }}
                >
                  Άνοιγμα χάρτη →
                </a>
              )}
            </>
          )}

          {section === "venue" && (
            <>
              <h2 style={{ marginTop: 0 }}>Κέντρο</h2>
              <div style={{ fontWeight: 900 }}>{event.venue_name || "-"}</div>
              {event.venue_address && <div style={{ marginTop: 6 }}>{event.venue_address}</div>}
              {event.venue_map_url && (
                <a
                  href={event.venue_map_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "inline-block", marginTop: 10, fontWeight: 800 }}
                >
                  Άνοιγμα χάρτη →
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}