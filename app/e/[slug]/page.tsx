import Countdown from "./Countdown";
import RSVPForm from "./RSVPForm";
import { createClient } from "@supabase/supabase-js";

function toGoogleDate(iso: string) {
  // Google Calendar wants: YYYYMMDDTHHmmssZ
  return new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function addHoursKeepISO(iso: string, hours: number) {
  const d = new Date(iso);
  d.setHours(d.getHours() + hours);
  // κρατάμε ISO (UTC). Για Google Calendar είναι οκ.
  return d.toISOString();
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const slug = params.slug || "demo";

  // ✅ Read με ANON KEY (σωστό για page)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !event) {
    return <div style={{ padding: 40 }}>Δεν βρέθηκε event.</div>;
  }

  const isElegant = event.template === "elegant";

  // ✅ Αν δεν έχει end_iso, βάζουμε +2 ώρες
  const startISO: string = event.start_iso;
  const endISO: string = event.end_iso || addHoursKeepISO(event.start_iso, 2);

  // ✅ Φωτογραφία
  const coverSrc: string = event.cover_image_url || event.cover_image || "";

  // ✅ Google Calendar url
  const gcalUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(event.title)}` +
    `&dates=${toGoogleDate(startISO)}/${toGoogleDate(endISO)}` +
    `&details=${encodeURIComponent(event.subtitle || "")}` +
    `&location=${encodeURIComponent(
      (event.church_name || "") + (event.church_address ? ", " + event.church_address : "")
    )}`;

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
        <div className="e-card e-reveal e-delay-1" style={{ marginBottom: 16, padding: 12 }}>
          {coverSrc ? (
            <img className="e-cover" src={coverSrc} alt={event.title} />
          ) : (
            <div style={{ padding: 18, opacity: 0.7, textAlign: "center" }}>
              (Δεν έχει ανέβει φωτογραφία ακόμα)
            </div>
          )}
        </div>

        {/* ✅ COUNTDOWN (κάτω από τη φωτογραφία) */}
        {startISO && <Countdown startISO={startISO} />}

        {/* TITLE */}
        <div className="e-reveal e-delay-2" style={{ marginTop: 20, textAlign: "center" }}>
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

        {/* DETAILS */}
        <div style={{ display: "grid", gap: 18, marginTop: 28 }}>
          {/* CHURCH */}
          <div className="e-card e-reveal e-delay-3">
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

          {/* VENUE */}
          <div className="e-card e-reveal e-delay-4">
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

        {/* RSVP */}
        <div className="e-card e-reveal e-delay-4" style={{ marginTop: 32 }}>
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

          {/* ✅ Calendar buttons */}
          {startISO && (
            <>
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

              <div style={{ height: 12 }} />
            </>
          )}

          <RSVPForm slug={slug} />
        </div>

        {/* EXTRA NOTE */}
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