"use client";

import { useState } from "react";
import CollageNav from "./CollageNav";
import Countdown from "./Countdown";

type EventFull = {
  title: string;
  subtitle?: string | null;

  start_iso?: string | null;

  template?: "elegant" | "playful";
};

export default function EventClient({
  event,
  slug,
  t,
}: {
  event: EventFull;
  slug: string;
  t: string;
}) {
  const [showIntro, setShowIntro] = useState(true);

  const pageBg = "/intro/background.jpg";
  const envelopeImg = "/intro/envelope.png";

  const textShadowStrong = "0 3px 14px rgba(0,0,0,0.55)";
  const textShadowSoft = "0 2px 10px rgba(0,0,0,0.45)";
  const MAIN_FADE = 0.45;

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    backgroundImage: `url(${pageBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  /* =========================
     INTRO
  ========================= */

  if (showIntro) {
    return (
      <div
        style={{
          ...pageStyle,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={() => setShowIntro(false)}
      >
        <img
          src={envelopeImg}
          alt="Open invitation"
          style={{
            width: 220,
            maxWidth: "80%",
          }}
        />
      </div>
    );
  }

  /* =========================
     MAIN
  ========================= */

  return (
    <div style={{ ...pageStyle, position: "relative" }}>
      {/* Fade overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(255,255,255,${MAIN_FADE})`,
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          maxWidth: 980,
          margin: "0 auto",
          padding: "40px 20px 80px",
        }}
      >
        {/* Title */}
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

          {event.subtitle && (
            <div
              style={{
                marginTop: 8,
                opacity: 0.95,
                fontSize: 16,
              }}
            >
              {event.subtitle}
            </div>
          )}
        </div>

        {/* Countdown */}
        {event.start_iso && (
          <div
            style={{
              marginTop: 20,
              textAlign: "center",
              color: "white",
              fontSize: 18,
              fontWeight: 900,
              textShadow: textShadowStrong,
            }}
          >
            <Countdown startISO={event.start_iso} />
          </div>
        )}

        {/* Collage */}
        <div style={{ marginTop: 40 }}>
          <CollageNav slug={slug} t={t} />
        </div>

        {/* Hint */}
        <div
          style={{
            textAlign: "center",
            marginTop: 14,
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