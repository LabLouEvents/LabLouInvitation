"use client";

import React, { useEffect, useMemo, useState } from "react";
import Countdown from "./Countdown";
import CollageNav from "./CollageNav";

export type EventFull = {
  template?: "elegant" | "playful";
  title: string;
  subtitle?: string | null;

  inviter_names?: string | null;

  start_iso: string;
  end_iso?: string | null;

  rsvp_deadline?: string | null;
  extra_note?: string | null;

  church_name?: string | null;
  church_address?: string | null;
  church_map_url?: string | null;

  venue_name?: string | null;
  venue_address?: string | null;
  venue_map_url?: string | null;

  date_text?: string | null;
  time_text?: string | null;
};

function storageKey(slug: string, t: string) {
  return `intro_seen:${slug}:${t || ""}`;
}

export default function EventClient({
  event,
  slug,
  t,
}: {
  event: EventFull;
  slug: string;
  t: string;
}) {
  // assets
  const pageBg = "/intro/background.jpg";
  const envelopeImg = "/intro/envelope.png";

  const inviter = useMemo(() => {
    const raw = (event.inviter_names || "").trim();
    return raw || "—";
  }, [event.inviter_names]);

  const [showIntro, setShowIntro] = useState(true);
  const [opening, setOpening] = useState(false);

  // Αν έχει ξαναμπεί, να ανοίγει κατευθείαν τη 2η οθόνη (προαιρετικό)
  useEffect(() => {
    try {
      const seen = localStorage.getItem(storageKey(slug, t));
      if (seen === "1") setShowIntro(false);
    } catch {}
  }, [slug, t]);

  const textShadowStrong = "0 3px 14px rgba(0,0,0,0.55)";
  const textShadowSoft = "0 2px 10px rgba(0,0,0,0.45)";

  // πόσο “αχνό” το background στη 2η οθόνη
  const MAIN_FADE = 0.55; // 0.65 πιο αχνό, 0.45 πιο έντονο

  const basePageStyle: React.CSSProperties = {
    minHeight: "100vh",
    padding: 24,
    backgroundImage: `url(${pageBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  function handleOpenInvite() {
    if (opening) return;
    setOpening(true);

    // Μετά από λίγο (animation) περνάμε στη 2η οθόνη
    window.setTimeout(() => {
      try {
        localStorage.setItem(storageKey(slug, t), "1");
      } catch {}
      setShowIntro(false);
      setOpening(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 850);
  }

  // =========================
  // INTRO (1η οθόνη)
  // =========================
  if (showIntro) {
    return (
      <div
        style={{
          ...basePageStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* λίγο πέπλο για να “γράφουν” τα γράμματα */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.18)",
          }}
        />

        <div
          style={{
            position: "relative",
            width: "min(94vw, 520px)",
            textAlign: "center",
            color: "white",
            textShadow: textShadowStrong,
          }}
        >
          {/* “λογότυπο”/brand πάνω πάνω (αν δεν το θες, σβήστο) */}
          <div style={{ fontWeight: 900, letterSpacing: 1, opacity: 0.95, fontSize: 12 }}>
            LABLOUINVITATIONS
          </div>

          <div style={{ height: 14 }} />

          {/* Envelope (με animation) */}
          <div
            style={{
              width: "min(92vw, 460px)",
              margin: "0 auto",
              transform: opening ? "translateY(10px) scale(1.03)" : "translateY(0) scale(1)",
              transition: "transform 850ms cubic-bezier(0.2,0.8,0.2,1)",
              filter: opening ? "drop-shadow(0 26px 50px rgba(0,0,0,0.28))" : "drop-shadow(0 18px 40px rgba(0,0,0,0.22))",
            }}
          >
            <img
              src={envelopeImg}
              alt="Envelope"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                opacity: opening ? 0.92 : 1,
                transition: "opacity 850ms ease",
              }}
            />
          </div>

          <div style={{ height: 16 }} />

          {/* “Έχεις πρόσκληση από” με εμφάνιση γράμμα-γράμμα (CSS) */}
          <TypewriterText
            text={`Έχεις πρόσκληση από`}
            style={{ fontSize: 26, fontWeight: 900 }}
            active={!opening}
          />
          <div style={{ height: 6 }} />
          <TypewriterText
            text={`« ${inviter} »`}
            style={{ fontSize: 20, fontWeight: 900 }}
            active={!opening}
          />

          {/* Countdown */}
          {event.start_iso ? (
            <div style={{ marginTop: 18, textShadow: textShadowSoft }}>
              <Countdown startISO={event.start_iso} />
            </div>
          ) : null}

          <div style={{ height: 18 }} />

          <button
            type="button"
            onClick={handleOpenInvite}
            style={{
              width: "min(92vw, 420px)",
              padding: "14px 16px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.25)",
              background: opening ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.14)",
              color: "white",
              fontWeight: 900,
              cursor: opening ? "default" : "pointer",
              backdropFilter: "blur(8px)",
              boxShadow: "0 18px 55px rgba(0,0,0,0.22)",
              opacity: opening ? 0.8 : 1,
              transition: "opacity 200ms ease",
            }}
          >
            {opening ? "Ανοίγει..." : "Άνοιγμα προσκλητηρίου"}
          </button>

          <div style={{ marginTop: 10, fontSize: 13, opacity: 0.95 }}>
            (Την επόμενη φορά μπορεί να ανοίγει κατευθείαν.)
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // MAIN (2η οθόνη: Collage)
  // =========================
  return (
    <div style={{ ...basePageStyle, position: "relative" }}>
      {/* πέπλο για να γίνει πιο αχνό */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(255,255,255,${MAIN_FADE})`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 980, margin: "0 auto" }}>
        <div style={{ textAlign: "center", color: "white", textShadow: textShadowStrong }}>
          <div style={{ fontSize: 30, fontWeight: 900, marginTop: 10 }}>{event.title}</div>
          {event.subtitle ? <div style={{ marginTop: 8, opacity: 0.95, fontSize: 16 }}>{event.subtitle}</div> : null}
        </div>

        {event.start_iso ? (
          <div style={{ marginTop: 14, textAlign: "center", color: "white", textShadow: textShadowSoft }}>
            <Countdown startISO={event.start_iso} />
          </div>
        ) : null}

        <div style={{ height: 14 }} />

        {/* 4 κάρτες */}
        <CollageNav slug={slug} t={t} />

        <div
          style={{
            textAlign: "center",
            marginTop: 10,
            color: "white",
            opacity: 0.95,
            fontSize: 13,
            textShadow: textShadowSoft,
          }}
        >
          Πάτα σε μία κάρτα για να ανοίξει η αντίστοιχη ενότητα.
        </div>
      </div>
    </div>
  );
}

/** Letter-by-letter χωρίς βιβλιοθήκες */
function TypewriterText({
  text,
  style,
  active,
}: {
  text: string;
  style?: React.CSSProperties;
  active: boolean;
}) {
  // “γράμματα ένα-ένα” με CSS clip + steps
  // Μόλις γίνει opening, το παγώνουμε (active=false) για να μη ξαναπαίζει περίεργα.
  return (
    <div
      style={{
        ...style,
        display: "inline-block",
        whiteSpace: "pre-wrap",
        overflow: "hidden",
        width: active ? "auto" : "auto",
      }}
    >
      <span
        style={{
          display: "inline-block",
          overflow: "hidden",
          verticalAlign: "bottom",
          maxWidth: active ? "0" : "9999px",
          animation: active ? "tw 900ms steps(30, end) forwards" : "none",
        }}
      >
        {text}
      </span>

      <style>{`
        @keyframes tw {
          from { max-width: 0; }
          to { max-width: 9999px; }
        }
      `}</style>
    </div>
  );
}