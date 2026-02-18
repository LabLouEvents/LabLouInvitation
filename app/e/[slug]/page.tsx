import Countdown from "./Countdown";
import RSVPForm from "./RSVPForm";
import CollageNav from "./CollageNav";

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
        <div style={{ opacity: 0.8 }}>Χρειάζεται το ειδικό link του event.</div>
      </div>
    );
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/public/get-event?slug=${encodeURIComponent(
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
  const isElegant = event.template === "elegant";

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

  // 4 “ενότητες” που θα οδηγεί το κολάζ
  const collageImages = [
    { src: "/invites/1.png", alt: "Προσκλητήριο", label: "Προσκλητήριο", targetId: "invite" },
    { src: "/invites/2.png", alt: "RSVP", label: "RSVP", targetId: "rsvp" },
    { src: "/invites/3.png", alt: "Εκκλησία", label: "Εκκλησία", targetId: "church" },
    { src: "/invites/4.png", alt: "Κέντρο", label: "Κέντρο", targetId: "venue" },
  ];

  return (
    <div
      style={{
        padding: 24,
        background: isElegant ? "var(--ivory)" : "#faf7f5",
        minHeight: "100vh",
      }}
    >
      <div className="e-wrap">
        {/* COUNTDOWN ΠΑΝΩ ΠΑΝΩ */}
        {event.start_iso && (
          <div className="e-card e-reveal e-delay-1" style={{ marginTop: 10 }}>
            <Countdown startISO={event.start_iso} />
          </div>
        )}

        {/* TITLE */}
        <div className="e-reveal e-delay-2" style={{ marginTop: 18, textAlign: "center" }}>
          <h1 className="elegant-title" style={{ margin: 0 }}>
            {event.title}
          </h1>

          {event.subtitle && (
            <p className="elegant-text" style={{ marginTop: 10, opacity: 0.85 }}>
              {event.subtitle}
            </p>
          )}
        </div>

        {/* COLLLAGE NAV (αντί για cover image + αντί για rsvp κάτω) */}
        <div className="e-card e-reveal e-delay-3" style={{ marginTop: 18 }}>
          <CollageNav images={collageImages} />
        </div>

        {/* SECTIONS */}
        <div style={{ display: "grid", gap: 18, marginTop: 26 }}>
          {/* Προσκλητήριο */}
          <div id="invite" className="e-card e-reveal e-delay-3" style={{ scrollMarginTop: 16 }}>
            <h3 className="elegant-title" style={{ marginTop: 0 }}>
              Προσκλητήριο
            </h3>
            <div className="elegant-text" style={{ opacity: 0.9 }}>
              {/* Βάλε εδώ ό,τι κείμενο/στοιχεία θες να δείχνει σαν πρόσκληση */}
              <div>
                <b>{event.title}</b>
              </div>
              {event.subtitle && <div style={{ marginTop: 6 }}>{event.subtitle}</div>}
              {event.date_text && <div style={{ marginTop: 8 }}>Ημερομηνία: {event.date_text}</div>}
            </div>
          </div>

          {/* RSVP */}
          <div id="rsvp" className="e-card e-reveal e-delay-3" style={{ scrollMarginTop: 16 }}>
            <h3 className="elegant-title" style={{ marginTop: 0 }}>
              RSVP
            </h3>

            {event.rsvp_deadline && (
              <div style={{ marginBottom: 10, opacity: 0.9 }}>
                Παρακαλούμε απαντήστε έως:{" "}
                <b style={{ color: "var(--gold-2)" }}>{event.rsvp_deadline}</b>
              </div>
            )}

            <a
              className="e-btn"
              href={gcalUrl}
              target="_blank"
              rel="noreferrer"
              style={{ display: "block", textAlign: "center", textDecoration: "none" }}
            >
              Προσθήκη στο Google Calendar
            </a>

            <a
              className="e-btn"
              href={`/api/ics?slug=${slug}`}
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                marginTop: 12,
              }}
            >
              Προσθήκη στο iPhone / Apple Calendar
            </a>

            <div style={{ height: 14 }} />

            <RSVPForm slug={slug} />
          </div>

          {/* Εκκλησία */}
          <div id="church" className="e-card e-reveal e-delay-4" style={{ scrollMarginTop: 16 }}>
            <h3 className="elegant-title" style={{ marginTop: 0 }}>
              Εκκλησία
            </h3>
            <div>{event.church_name}</div>
            {event.church_address && (
              <div style={{ opacity: 0.8, marginTop: 6 }}>{event.church_address}</div>
            )}
            {event.church_map_url && (
              <a className="e-link" href={event.church_map_url} target="_blank" rel="noreferrer">
                Άνοιγμα χάρτη
              </a>
            )}
          </div>

          {/* Κέντρο */}
          <div id="venue" className="e-card e-reveal e-delay-4" style={{ scrollMarginTop: 16 }}>
            <h3 className="elegant-title" style={{ marginTop: 0 }}>
              Κέντρο
            </h3>
            <div>{event.venue_name}</div>
            {event.venue_address && (
              <div style={{ opacity: 0.7, marginTop: 6 }}>{event.venue_address}</div>
            )}
            {event.venue_map_url && (
              <a className="e-link" href={event.venue_map_url} target="_blank" rel="noreferrer">
                Άνοιγμα χάρτη
              </a>
            )}
          </div>
        </div>

        {event.extra_note && (
          <div
            className="elegant-text e-reveal e-delay-4"
            style={{
              marginTop: 20,
              textAlign: "center",
              opacity: 0.75,
              fontStyle: "italic",
            }}
          >
            {event.extra_note}
          </div>
        )}
      </div>
    </div>
  );
}