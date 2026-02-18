"use client";

import { useEffect, useMemo, useState } from "react";
import Countdown from "./Countdown";
import RSVPForm from "./RSVPForm";
import CollageNav from "./CollageNav";

type EventFull = {
  slug: string;
  template: "elegant" | "playful";
  title: string;
  subtitle?: string | null;

  // προαιρετικό (αν το προσθέσεις αργότερα στο supabase/admin)
  inviter_names?: string | null;

  cover_image?: string | null;

  church_name?: string | null;
  church_address?: string | null;
  church_map_url?: string | null;

  venue_name?: string | null;
  venue_address?: string | null;
  venue_map_url?: string | null;

  start_iso: string;
  end_iso?: string | null;

  rsvp_deadline?: string | null;
  extra_note?: string | null;

  // αν υπάρχει σε κάποια events σου
  date_text?: string | null;
};

function storageKey(slug: string, t: string) {
  // “θυμάται” ανά event+token (δηλαδή ανά link που μοιράζεις)
  return `intro_seen:${slug}:${t}`;
}

export default function EventClient({
  event,
  slug,
  gcalUrl,
  t,
}: {
  event: EventFull;
  slug: string;
  gcalUrl: string;
  t: string;
}) {
  const [showIntro, setShowIntro] = useState(true);

  const inviter = useMemo(() => {
    // Προτεραιότητα:
    // 1) inviter_names (αν το βάλεις αργότερα)
    // 2) subtitle (αν θες να το χρησιμοποιήσεις σαν “ονόματα” προσωρινά)
    // 3) title (fallback)
    return (event.inviter_names || event.subtitle || event.title || "").trim();
  }, [event.inviter_names, event.subtitle, event.title]);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(storageKey(slug, t));
      if (seen === "1") setShowIntro(false);
    } catch {
      // ignore
    }
  }, [slug, t]);

  function enterInvite() {
    try {
      localStorage.setItem(storageKey(slug, t), "1");
    } catch {
      // ignore
    }
    setShowIntro(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const isElegant = event.template === "elegant";

  // ---- INTRO VIEW (μια φορά) ----
  if (showIntro) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: 24,
          display: "grid",
          placeItems: "center",
          background: isElegant ? "var(--ivory)" : "#faf7f5",
        }}
      >
        <div
          className="e-card"
          style={{
            width: "min(92vw, 620px)",
            textAlign: "center",
            padding: 26,
          }}
        >
          <div style={{ opacity: 0.75, letterSpacing: 0.5, fontSize: 13 }}>
            LAB LOU INVITATIONS
          </div>

          <h1 className="elegant-title" style={{ margin: "14px 0 10px" }}>
            Έχεις πρόσκληση από
          </h1>

          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            « {inviter || "—"} »
          </div>

          {event.start_iso && (
            <div style={{ marginTop: 14 }}>
              <div style={{ opacity: 0.75, marginBottom: 10 }}>
                Μέχρι να ξεκινήσει:
              </div>
              <div className="e-card" style={{ padding: 12 }}>
                <Countdown startISO={event.start_iso} />
              </div>
            </div>
          )}

          <button
            className="e-btn"
            onClick={enterInvite}
            style={{
              marginTop: 18,
              width: "100%",
              textAlign: "center",
            }}
          >
            Άνοιγμα προσκλητηρίου
          </button>

          <div style={{ marginTop: 12, opacity: 0.65, fontSize: 13 }}>
            (Την επόμενη φορά θα ανοίγει κατευθείαν.)
          </div>
        </div>
      </div>
    );
  }

  // ---- MAIN INVITE VIEW ----
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

        {/* ΚΟΛΑΖ ΠΛΟΗΓΗΣΗΣ (πατάς φωτο και σε πάει στο section) */}
        <div className="e-card e-reveal e-delay-3" style={{ marginTop: 18 }}>
          <CollageNav />
        </div>

        {/* SECTIONS */}
        <div style={{ display: "grid", gap: 18, marginTop: 26 }}>
          {/* Προσκλητήριο */}
          <div id="invite" className="e-card e-reveal e-delay-3" style={{ scrollMarginTop: 16 }}>
            <h3 className="elegant-title" style={{ marginTop: 0 }}>
              Προσκλητήριο
            </h3>

            <div className="elegant-text" style={{ opacity: 0.9 }}>
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