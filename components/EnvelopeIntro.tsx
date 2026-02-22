"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

function clampText(s: string, max = 48) {
  const t = (s || "").trim();
  if (!t) return "";
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

function TypewriterText({
  text,
  active,
  speed = 28,
  style,
}: {
  text: string;
  active: boolean;
  speed?: number;
  style?: React.CSSProperties;
}) {
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (!active) {
      setShown("");
      return;
    }
    let i = 0;
    setShown("");
    const id = setInterval(() => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, active, speed]);

  return (
    <div style={{ whiteSpace: "pre-wrap", ...style }}>
      {shown}
      {active && shown.length < text.length ? (
        <span style={{ opacity: 0.7 }}>▍</span>
      ) : null}
    </div>
  );
}

export default function EnvelopeIntro({
  inviter,
  onOpen,
  backgroundUrl,
}: {
  inviter: string;
  onOpen: () => void;
  backgroundUrl?: string; // π.χ. "/bg.jpg"
}) {
  const [opening, setOpening] = useState(false);

  const inviterLine = useMemo(() => {
    const v = clampText(inviter, 60);
    return v ? `« ${v} »` : "« — »";
  }, [inviter]);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);

    // μικρό “πάτημα” για να δεις το άνοιγμα, μετά πηγαίνει στη 2η σελίδα
    setTimeout(() => {
      onOpen();
    }, 750);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 18,
        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        // fallback αν δεν βάλεις background εικόνα
        backgroundColor: "#efe7df",
      }}
    >
      <div style={{ width: "min(520px, 92vw)", textAlign: "center" }}>
        <div
          style={{
            letterSpacing: 2,
            fontWeight: 800,
            opacity: 0.85,
            marginBottom: 14,
          }}
        >
          LABLOU EVENTS
        </div>

        <div
          style={{
            position: "relative",
            width: "min(420px, 86vw)",
            height: "min(320px, 64vw)",
            margin: "0 auto",
            filter: "drop-shadow(0 16px 30px rgba(0,0,0,0.18))",
            transform: opening ? "translateY(-6px)" : "translateY(0px)",
            transition: "transform 600ms ease",
          }}
        >
          <Image
            src={opening ? "/envelope-open.png" : "/envelope-closed.png"}
            alt={opening ? "Open envelope" : "Closed envelope"}
            fill
            priority
            style={{
              objectFit: "contain",
              transition: "opacity 280ms ease",
              opacity: 1,
            }}
          />
        </div>

        <div style={{ height: 14 }} />

        <TypewriterText
          text={"Έχεις πρόσκληση από"}
          active={!opening}
          style={{
            fontSize: 24,
            fontWeight: 900,
            textShadow: "0 2px 10px rgba(0,0,0,0.15)",
          }}
        />
        <div style={{ height: 6 }} />
        <TypewriterText
          text={inviterLine}
          active={!opening}
          style={{
            fontSize: 20,
            fontWeight: 900,
            opacity: 0.92,
            textShadow: "0 2px 10px rgba(0,0,0,0.12)",
          }}
        />

        <div style={{ height: 18 }} />

        <button
          type="button"
          onClick={handleOpen}
          style={{
            width: "min(360px, 92vw)",
            padding: "14px 16px",
            borderRadius: 999,
            border: "1px solid rgba(0,0,0,0.12)",
            background: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(8px)",
            fontWeight: 900,
            cursor: "pointer",
            transition: "transform 120ms ease, opacity 200ms ease",
            opacity: opening ? 0.75 : 1,
          }}
        >
          Άνοιγμα προσκλητηρίου
        </button>

        <div style={{ height: 10 }} />

        <div style={{ fontSize: 12, opacity: 0.65 }}>
          {opening ? "Ανοίγει…" : ""}
        </div>
      </div>
    </div>
  );
}