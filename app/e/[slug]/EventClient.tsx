"use client";

import { useMemo, useState } from "react";
import Countdown from "./Countdown";
import RSVPForm from "./RSVPForm";
import CollageNav, { type CardKey } from "./CollageNav";

type EventFull = {
  slug: string;
  template: "elegant" | "playful";
  title: string;
  subtitle: string | null;

  cover_image: string | null;

  church_name: string | null;
  church_address: string | null;
  church_map_url: string | null;

  venue_name: string | null;
  venue_address: string | null;
  venue_map_url: string | null;

  start_iso: string;
  end_iso: string | null;

  rsvp_deadline: string | null;
  extra_note: string | null;
};

function toGoogleDate(iso: string) {
  return new Date(iso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function formatGreekDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString("el-GR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function EventClient({
  slug,
  token,
  event,
}: {
  slug: string;
  token: string;
  event: EventFull;
}) {
  const [active, setActive] = useState<CardKey | null>(null);

  const isElegant = event.template === "elegant";
  const startISO = event.start_iso;
  const endISO = event.end_iso || event.start_iso;

  const gcalUrl = useMemo(() => {
    return (
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent(event.title)}` +
      `&dates=${toGoogleDate(startISO)}/${toGoogleDate(endISO)}` +
      `&details=${encodeURIComponent(event.subtitle || "")}` +
      `&location=${encodeURIComponent(
        (event.church_name || "") + (event.church_address ? ", " + event.church_address : "")
      )}`
    );
  }, [event.title, event.subtitle, event.church_name, event.church_address, startISO, endISO]);

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

        {/* COLLAGE NAV */}
        <div className="e-reveal e-delay-3" style={{ marginTop: 18 }}>
          <CollageNav onSelect={(k) => setActive(k)} />
        </div>

        {/* ✅ ΤΙΠΟΤΑ ΚΑΤΩ αν δεν έχει επιλέξει */}
        {!active ? (
          <div style={{ textAlign: "center", opacity: 0.65, marginTop: 18 }}>
            Πάτησε μια φωτογραφία για να ανοίξει το αντίστοιχο section.
          </div>
        ) : (
          <div className="e-card e-reveal e-delay-4" style={{ marginTop: 18 }}>
            {active === "invite" && (
              <>
                <h3 className="elegant-title" style={{ marginTop: 0 }}>
                  Προσκλητήριο
                </h3>

                <div className="elegant-text" style={{ opacity: 0.9 }}>
                  <div style={{ marginTop: 8 }}>
                    <b>Ημερομηνία & ώρα:</b> {formatGreekDateTime(event.start_iso)}
                  </div>

                  {event.extra_note && (
                    <div style={{ marginTop: 10, opacity: 0.8, fontStyle: "italic" }}>
                      {event.extra_note}
                    </div>
                  )}
                </div>
              </>
            )}

            {active === "rsvp" && (
              <>
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
                  href={`/api/ics?slug=${encodeURIComponent(slug)}`}
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
              </>
            )}

            {active === "church" && (
              <>
                <h3 className="elegant-title" style={{ marginTop: 0 }}>
                  Εκκλησία
                </h3>

                <div>{event.church_name || "-"}</div>

                {event.church_address && (
                  <div style={{ opacity: 0.8, marginTop: 6 }}>{event.church_address}</div>
                )}

                {event.church_map_url && (
                  <a className="e-link" href={event.church_map_url} target="_blank" rel="noreferrer">
                    Άνοιγμα χάρτη
                  </a>
                )}
              </>
            )}

            {active === "venue" && (
              <>
                <h3 className="elegant-title" style={{ marginTop: 0 }}>
                  Κέντρο
                </h3>

                <div>{event.venue_name || "-"}</div>

                {event.venue_address && (
                  <div style={{ opacity: 0.75, marginTop: 6 }}>{event.venue_address}</div>
                )}

                {event.venue_map_url && (
                  <a className="e-link" href={event.venue_map_url} target="_blank" rel="noreferrer">
                    Άνοιγμα χάρτη
                  </a>
                )}
              </>
            )}

            {/* μικρό close */}
            <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
              <button
                className="e-btn"
                type="button"
                onClick={() => setActive(null)}
                style={{ width: "auto" }}
              >
                Κλείσιμο
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}