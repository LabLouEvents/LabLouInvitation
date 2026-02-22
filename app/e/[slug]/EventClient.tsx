"use client";

import React, { useEffect, useMemo, useState } from "react";
import Countdown from "./Countdown";
import CollageNav from "./CollageNav";

export type EventFull = {
  title: string;
  subtitle?: string | null;
  inviter_names?: string | null;
  start_iso?: string;
};

function storageKey(slug: string, t: string) {
  return `intro_seen:${slug}:${t || ""}`;
}

/* =============================
   Envelope Component
============================= */
function Envelope({
  opening,
  envelopeImg,
}: {
  opening: boolean;
  envelopeImg: string;
}) {
  const W = 360;

  return (
    <div
      style={{
        width: W,
        maxWidth: "88vw",
        margin: "0 auto",
        position: "relative",
        perspective: 1000,
      }}
    >
      {/* Paper */}
      <div
        style={{
          position: "absolute",
          left: "10%",
          right: "10%",
          top: "20%",
          height: "60%",
          borderRadius: 14,
          background: "white",
          boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
          transform: opening ? "translateY(-42px)" : "translateY(24px)",
          opacity: opening ? 1 : 0,
          transition:
            "transform 800ms cubic-bezier(.2,.9,.2,1), opacity 400ms ease",
          zIndex: 1,
        }}
      />

      {/* Envelope body */}
      <img
        src={envelopeImg}
        alt="envelope"
        style={{
          width: "100%",
          display: "block",
          filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.3))",
          transform: opening ? "translateY(6px) scale(0.98)" : "scale(1)",
          transition: "transform 700ms cubic-bezier(.2,.9,.2,1)",
          position: "relative",
          zIndex: 2,
        }}
      />

      {/* Flap */}
      <div
        style={{
          position: "absolute",
          left: "6%",
          right: "6%",
          top: "8%",
          height: "34%",
          borderRadius: 16,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.15))",
          transformOrigin: "top center",
          transform: opening ? "rotateX(155deg)" : "rotateX(0deg)",
          transition: "transform 800ms cubic-bezier(.2,.9,.2,1)",
          zIndex: 3,
          boxShadow: opening
            ? "none"
            : "0 14px 30px rgba(0,0,0,0.18)",
        }}
      />
    </div>
  );
}

/* =============================
   Main Component
============================= */

export default function EventClient({
  event,
  slug,
  t,
}: {
  event: EventFull;
  slug: string;
  t: string;
}) {
  const pageBg = "/intro/background.jpg";
  const envelopeImg = "/intro/envelope.png";

  const inviter = useMemo(() => {
    const raw = (event.inviter_names || "").trim();
    return raw || "—";
  }, [event.inviter_names]);

  const [showIntro, setShowIntro] = useState(true);
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(storageKey(slug, t));
      if (seen === "1") setShowIntro(false);
    } catch {}
  }, [slug, t]);

  function handleOpenInvite() {
    if (opening) return;
    setOpening(true);

    setTimeout(() => {
      try {
        localStorage.setItem(storageKey(slug, t), "1");
      } catch {}
      setShowIntro(false);
      setOpening(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
  }

  const basePageStyle: React.CSSProperties = {
    minHeight: "100vh",
    padding: 24,
    backgroundImage: `url(${pageBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const textShadowStrong = "0 3px 14px rgba(0,0,0,0.55)";
  const textShadowSoft = "0 2px 10px rgba(0,0,0,0.45)";

  /* =============================
     INTRO SCREEN
  ============================= */
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
            textAlign: "center",
            color: "white",
            textShadow: textShadowStrong,
            width: "min(94vw, 520px)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 900, opacity: 0.9 }}>
            LABLOUINVITATIONS
          </div>

          <div style={{ height: 16 }} />

          <Envelope opening={opening} envelopeImg={envelopeImg} />

          <div style={{ height: 20 }} />

          <div style={{ fontSize: 26, fontWeight: 900 }}>
            Έχεις πρόσκληση από
          </div>

          <div style={{ fontSize: 20, fontWeight: 900, marginTop: 6 }}>
            « {inviter} »
          </div>

          {event.start_iso ? (
            <div style={{ marginTop: 18, textShadow: textShadowSoft }}>
              <Countdown startISO={event.start_iso} />
            </div>
          ) : null}

          <div style={{ height: 20 }} />

          <button
            type="button"
            onClick={handleOpenInvite}
            style={{
              width: "min(92vw, 420px)",
              padding: "14px 16px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.14)",
              color: "white",
              fontWeight: 900,
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              boxShadow: "0 18px 55px rgba(0,0,0,0.22)",
              opacity: opening ? 0.8 : 1,
            }}
          >
            {opening ? "Ανοίγει..." : "Άνοιγμα προσκλητηρίου"}
          </button>
        </div>
      </div>
    );
  }

  /* =============================
     SECOND SCREEN (4 cards)
  ============================= */
  return (
    <div style={{ ...basePageStyle, position: "relative" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255,255,255,0.55)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 980, margin: "0 auto" }}>
        <div
          style={{
            textAlign: "center",
            color: "white",
            textShadow: textShadowStrong,
          }}
        >
          <div style={{ fontSize: 30, fontWeight: 900 }}>
            {event.title}
          </div>

          {event.subtitle ? (
            <div style={{ marginTop: 8 }}>{event.subtitle}</div>
          ) : null}
        </div>

        {event.start_iso ? (
          <div
            style={{
              marginTop: 14,
              textAlign: "center",
              color: "white",
              textShadow: textShadowSoft,
            }}
          >
            <Countdown startISO={event.start_iso} />
          </div>
        ) : null}

        <div style={{ height: 18 }} />

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