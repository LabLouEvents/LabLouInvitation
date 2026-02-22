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
   Envelope (single image) + paper animation
============================= */
function Envelope({
  phase,
  envelopeImg,
}: {
  phase: "idle" | "opening";
  envelopeImg: string;
}) {
  const W = 380;

  const opening = phase === "opening";

  return (
    <div
      style={{
        width: W,
        maxWidth: "88vw",
        margin: "0 auto",
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Glow behind */}
      <div
        style={{
          position: "absolute",
          inset: -40,
          background:
            "radial-gradient(circle at 50% 55%, rgba(255,255,255,0.55), rgba(255,255,255,0) 62%)",
          opacity: opening ? 1 : 0.25,
          transform: opening ? "scale(1.04)" : "scale(1)",
          transition: "opacity 380ms ease, transform 900ms cubic-bezier(.2,.9,.2,1)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Paper comes out */}
      <div
        style={{
          position: "absolute",
          left: "10%",
          right: "10%",
          top: "18%",
          height: "62%",
          borderRadius: 14,
          background: "linear-gradient(180deg, #fff, #fbfbfb)",
          boxShadow: "0 22px 55px rgba(0,0,0,0.22)",
          transform: opening
            ? "translateY(-88px) rotate(-1.2deg)"
            : "translateY(34px) rotate(0deg)",
          opacity: opening ? 1 : 0,
          transition:
            "transform 950ms cubic-bezier(.18,.95,.2,1), opacity 240ms ease",
          zIndex: 1,
        }}
      >
        {/* tiny top cut */}
        <div
          style={{
            position: "absolute",
            left: 18,
            right: 18,
            top: 18,
            height: 2,
            background: "rgba(0,0,0,0.06)",
            borderRadius: 2,
          }}
        />
      </div>

      {/* Envelope image (single png) */}
      <img
        src={envelopeImg}
        alt="envelope"
        style={{
          width: "100%",
          display: "block",
          position: "relative",
          zIndex: 2,
          filter: "drop-shadow(0 22px 55px rgba(0,0,0,0.35))",
          transform: opening
            ? "translateY(12px) rotate(0.6deg) scale(0.985)"
            : "translateY(0px) rotate(0deg) scale(1)",
          transition: "transform 950ms cubic-bezier(.18,.95,.2,1)",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      />

      {/* little “lift” highlight on click */}
      <div
        style={{
          position: "absolute",
          left: "12%",
          right: "12%",
          top: "52%",
          height: 26,
          borderRadius: 999,
          background:
            "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))",
          opacity: opening ? 1 : 0,
          transform: opening ? "translateY(-10px)" : "translateY(0px)",
          transition: "opacity 220ms ease, transform 700ms ease",
          pointerEvents: "none",
          zIndex: 3,
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
  const [phase, setPhase] = useState<"idle" | "opening">("idle");

  useEffect(() => {
    try {
      const seen = localStorage.getItem(storageKey(slug, t));
      if (seen === "1") setShowIntro(false);
    } catch {}
  }, [slug, t]);

  function handleOpenInvite() {
    if (phase === "opening") return;
    setPhase("opening");

    // μετά από λίγο πάμε στη 2η οθόνη
    setTimeout(() => {
      try {
        localStorage.setItem(storageKey(slug, t), "1");
      } catch {}
      setShowIntro(false);
      setPhase("idle");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1100);
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
     INTRO
  ============================= */
  if (showIntro) {
    return (
      <div
        style={{
          ...basePageStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* πιο διακριτικό πέπλο, όχι “κουτί” */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.12)",
          }}
        />

        <div
          style={{
            position: "relative",
            textAlign: "center",
            color: "white",
            textShadow: textShadowStrong,
            width: "min(94vw, 560px)",
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 900, opacity: 0.9 }}>
            LABLOUINVITATIONS
          </div>

          <div style={{ height: 16 }} />

          <Envelope phase={phase} envelopeImg={envelopeImg} />

          <div style={{ height: 18 }} />

          <div style={{ fontSize: 26, fontWeight: 900 }}>
            Έχεις πρόσκληση από
          </div>

          <div style={{ fontSize: 20, fontWeight: 900, marginTop: 6 }}>
            « {inviter} »
          </div>

          {event.start_iso ? (
            <div style={{ marginTop: 16, textShadow: textShadowSoft }}>
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
              border: "1px solid rgba(255,255,255,0.28)",
              background: "rgba(255,255,255,0.16)",
              color: "white",
              fontWeight: 900,
              cursor: "pointer",
              backdropFilter: "blur(8px)",
              boxShadow: "0 18px 55px rgba(0,0,0,0.22)",
              opacity: phase === "opening" ? 0.85 : 1,
            }}
          >
            {phase === "opening" ? "Ανοίγει..." : "Άνοιγμα προσκλητηρίου"}
          </button>

          <div
            style={{
              marginTop: 10,
              fontSize: 12,
              opacity: 0.85,
              textShadow: textShadowSoft,
            }}
          >
            (Αν θες να το ξαναδείς από την αρχή, άνοιξε incognito ή καθάρισε το
            localStorage.)
          </div>
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
          <div style={{ fontSize: 30, fontWeight: 900 }}>{event.title}</div>

          {event.subtitle ? (
            <div style={{ marginTop: 8, opacity: 0.95 }}>{event.subtitle}</div>
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