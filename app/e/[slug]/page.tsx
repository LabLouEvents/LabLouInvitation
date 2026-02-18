import Countdown from "./Countdown";
import RSVPForm from "./RSVPForm";
import CollageNav from "./CollageNav";

function toGoogleDate(iso: string) {
  // Google Calendar wants: YYYYMMDDTHHmmssZ
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
  const t = (searchParams?.t || "").trim();

  // ✅ Αν δεν έχει token, κόβουμε πρόσβαση
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

  // ✅ Φέρνουμε event ΜΟΝΟ με slug + token
  // (χρησιμοποιούμε absolute URL αν υπάρχει, αλλιώς relative)
  const base =
    (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "") || "";

  const res = await fetch(
    `${base}/api/public/get-event?slug=${encodeURIComponent(
      slug
    )}&t=${encodeURIComponent(t)}`,
    { cache: "no-store" }
  );

  const data = await res.json().catch(() => null);

  if (!res.ok || !data?.ok || !data?.event) {
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

  const coverSrc = event.cover_image || "";

  const gcalUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(event.title)}` +
    `&dates=${toGoogleDate(startISO)}/${toGoogleDate(endISO)}` +
    `&details=${encodeURIComponent(event.subtitle || "")}` +
    `&location=${encodeURIComponent(
      (event.church_name || "") +
        (event.church_address ? ", " + event.church_address : "")
    )}`;

  // ✅ 4 εικόνες “collage”
  // Αν δεν έχει cover, βάλε 4 placeholders στο /public/collage/1.jpg ... 4.jpg
  const collageImages = [
    {
      src: coverSrc || "/collage/1.jpg",
      alt: "Προσκλητήριο",
      href: "#invite",
    },
    { src: coverSrc || "/collage/2.jpg", alt: "RSVP", href: "#rsvp" },
    {
      src: coverSrc || "/collage/3.jpg",
      alt: "Εκκλησία",
      href: "#church",
    },
    { src: coverSrc || "/collage/4.jpg", alt: "Κέντρο", href: "#venue" },
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
        {/* COVER */}
        <div className="e-card e-reveal e-delay-1" style={{ marginBottom: 18, padding: 12 }}>
          {coverSrc ? (
            <img className="e-cover" src={coverSrc} alt={event.title} />
          ) : (
            <div style={{ padding: 18, opacity: 0.7, textAlign: "center" }}>
              (Δεν έχει ανέβει φωτογραφία ακόμα)
            </div>
          )}
        </div>

        {/* COLLLAGE NAV (4 images) */}
        <div className="e-reveal e-delay-2" style={{ marginTop: 6 }}>
          <CollageNav images={collageImages} />
          <div style={{ textAlign: "center", fontSize: 12, opacity: 0.7 }}>
            Πάτα σε φωτογραφία για να πας στην αντίστοιχη ενότητα.
          </div>
        </div>

        {/* INVITE (Title/Sub) */}
        <div
          id="invite"
          className="e-reveal e-delay-2"
          style={{ marginTop: 18, textAlign: "center" }}
        >
          <h1 className="elegant-title" style={{ margin: 0 }}>
            {event.title}
          </h1>

          {event.subtitle && (
            <p className="elegant-text" style={{ marginTop: 10, opacity: 0.85 }}>
              {event.subtitle}
            </p>
          )}

          <div
            style={{
              height: 1,
              width: 140,
              margin: "16px auto 0",
              background: "linear-gradient(90deg, transparent, var(--gold-2), transparent)",
              opacity: 0.9,
            }}
          />
        </div>

        {/* COUNTDOWN */}
        {event.start_iso && (
          <div className="e-card e-reveal e-delay-3" style={{ marginTop: 18 }}>
            <Countdown startISO={event.start_iso} />
          </div>
        )}

        {/* DETAILS */}
        <div style={{ display: "grid", gap: 18, marginTop: 28 }}>
          {/* CHURCH */}
          <div id="church" className="e-card e-reveal e-delay-3">
            <h3 className="elegant-title" style={{ marginTop: 0 }}>
              Εκκλησία
            </h3>

            <div>{event.church_name}</div>
            {event.church_address && (
              <div style={{ opacity: 0.8, marginTop: 6 }}>
                {event.church_address}
              </div>
            )}

            {event.church_map_url && (
              <a
                className="e-link"
                href={event.church_map_url}
                target="_blank"
                rel="noreferrer"
              >
                Άνοιγμα χάρτη
              </a>
            )}
          </div>

          {/* VENUE */}
          <div id="venue" className="e-card e-reveal e-delay-4">
            <h3 className="elegant-title" style={{ marginTop: 0 }}>
              Κέντρο
            </h3>

            <div>{event.venue_name}</div>
            {event.venue_address && (
              <div style={{ opacity: 0.7, marginTop: 6 }}>
                {event.venue_address}
              </div>
            )}

            {event.venue_map_url && (
              <a
                className="e-link"
                href={event.venue_map_url}
                target="_blank"
                rel="noreferrer"
              >
                Άνοιγμα χάρτη
              </a>
            )}
          </div>
        </div>

        {/* RSVP */}
        <div id="rsvp" className="e-card e-reveal e-delay-4" style={{ marginTop: 32 }}>
          <h3 className="elegant-title" style={{ marginTop: 0 }}>
            RSVP
          </h3>

          {event.rsvp_deadline && (
            <div style={{ marginBottom: 10, opacity: 0.9 }}>
              Παρακαλούμε απαντήστε έως:{" "}
              <b style={{ color: "var(--gold-2)" }}>{event.rsvp_deadline}</b>
            </div>
          )}

          <div
            style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, var(--gold-2), transparent)",
              margin: "12px 0 18px",
            }}
          />

          {/* Calendar buttons */}
          {startISO && (
            <>
              <a
                className="e-btn"
                href={gcalUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                }}
              >
                Προσθήκη στο Google Calendar
              </a>

              <a
                className="e-btn"
                href={`/api/ics?slug=${encodeURIComponent(slug)}&t=${encodeURIComponent(t)}`}
                style={{
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                  marginTop: 12,
                }}
              >
                Προσθήκη στο iPhone / Apple Calendar
              </a>

              <div style={{ height: 12 }} />
            </>
          )}

          <RSVPForm slug={slug} />
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