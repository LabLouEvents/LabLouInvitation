"use client";

import { useMemo, useState } from "react";
import Countdown from "./Countdown";
import RSVPForm from "./RSVPForm";
import CollageNav, { CardKey } from "./CollageNav";

export default function EventClient({
  event,
  slug,
  gcalUrl,
}: {
  event: any;
  slug: string;
  gcalUrl: string;
}) {
  const isElegant = event.template === "elegant";

  const [active, setActive] = useState<CardKey | null>(null);

  const cards = useMemo(
    () => [
      { key: "invite" as const, label: "Προσκλητήριο", src: "/invites/1.png" },
      { key: "rsvp" as const, label: "RSVP", src: "/invites/2.png" },
      { key: "church" as const, label: "Εκκλησία", src: "/invites/3.png" },
      { key: "venue" as const, label: "Κέντρο", src: "/invites/4.png" },
    ],
    []
  );

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

        {/* ΤΙΤΛΟΣ */}
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

        {/* ΚΟΛΑΖ ΠΑΝΤΑ ΟΡΑΤΟ */}
        <div className="e-card e-reveal e-delay-3" style={{ marginTop: 18 }}>
          <CollageNav cards={cards} onSelect={(k) => setActive(k)} />
          <div style={{ textAlign: "center", marginTop: 10, opacity: 0.7, fontSize: 13 }}>
            Πάτα σε μία φωτογραφία για να ανοίξει η αντίστοιχη ενότητα.
          </div>
        </div>

        {/* ΕΔΩ ΔΕΝ ΘΑ ΥΠΑΡΧΕΙ ΤΙΠΟΤΑ “ΚΑΤΩ”, ΜΟΝΟ ΑΝ ΕΠΙΛΕΞΕΙ */}
        {active && (
          <div className="e-card e-reveal e-delay-3" style={{ marginTop: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div style={{ fontWeight: 700 }}>
                {active === "invite" && "Προσκλητήριο"}
                {active === "rsvp" && "RSVP"}
                {active === "church" && "Εκκλησία"}
                {active === "venue" && "Κέντρο"}
              </div>

              <button
                type="button"
                className="e-btn"
                onClick={() => setActive(null)}
                style={{ width: "auto", padding: "10px 14px" }}
              >
                Πίσω
              </button>
            </div>

            <div style={{ height: 12 }} />

            {active === "invite" && (
              <div className="elegant-text" style={{ opacity: 0.9 }}>
                <div>
                  <b>{event.title}</b>
                </div>
                {event.subtitle && <div style={{ marginTop: 6 }}>{event.subtitle}</div>}
                {event.date_text && <div style={{ marginTop: 8 }}>Ημερομηνία: {event.date_text}</div>}
                {event.time_text && <div style={{ marginTop: 6 }}>Ώρα: {event.time_text}</div>}
              </div>
            )}

            {active === "rsvp" && (
              <>
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
              </>
            )}

            {active === "church" && (
              <>
                <div style={{ fontWeight: 600 }}>{event.church_name}</div>
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
                <div style={{ fontWeight: 600 }}>{event.venue_name}</div>
                {event.venue_address && (
                  <div style={{ opacity: 0.8, marginTop: 6 }}>{event.venue_address}</div>
                )}
                {event.venue_map_url && (
                  <a className="e-link" href={event.venue_map_url} target="_blank" rel="noreferrer">
                    Άνοιγμα χάρτη
                  </a>
                )}
              </>
            )}
          </div>
        )}

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