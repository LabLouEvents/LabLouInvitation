"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function clampText(s: string, max = 60) {
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
      {active && shown.length < text.length ? <span style={{ opacity: 0.6 }}>▍</span> : null}
    </div>
  );
}

export default function EnvelopeIntro({
  slug,
  t,
  inviter,
  backgroundUrl = "/intro/background.jpg",
}: {
  slug: string;
  t: string;
  inviter: string;
  backgroundUrl?: string;
}) {
  const router = useRouter();
  const [go, setGo] = useState(false);

  const inviterLine = useMemo(() => {
    const v = clampText(inviter, 60);
    return v ? `« ${v} »` : "« — »";
  }, [inviter]);

  const handleOpen = () => {
    if (go) return;
    setGo(true);
    // μικρό “cinematic” pause και μετά πάμε στη 2η σελίδα
    setTimeout(() => {
      router.push(`/e/${encodeURIComponent(slug)}/section?t=${encodeURIComponent(t)}`);
    }, 450);
  };

  return (
    <div style={pageStyle(backgroundUrl)}>
      <div style={{ width: "min(560px, 92vw)", textAlign: "center" }}>
        {/* Brand */}
        <div
          style={{
            fontSize: 12,
            letterSpacing: 2,
            fontWeight: 900,
            color: "white",
            textShadow: "0 3px 14px rgba(0,0,0,0.45)",
            opacity: 0.92,
            marginBottom: 14,
          }}
        >
          LABLOU EVENTS
        </div>

        {/* Closed Envelope */}
        <div
          style={{
            position: "relative",
            width: "min(520px, 86vw)",
            height: "min(360px, 62vw)",
            margin: "0 auto",
            filter: "drop-shadow(0 18px 34px rgba(0,0,0,0.20))",
            transform: go ? "scale(0.98)" : "scale(1)",
            opacity: go ? 0.92 : 1,
            transition: "transform 220ms ease, opacity 220ms ease",
          }}
        >
          <Image
            src={"/envelope/envelope-closed.png"}
            alt="Closed envelope"
            fill
            priority
            style={{ objectFit: "contain" }}
          />
        </div>

        <div style={{ height: 18 }} />

        {/* Text */}
        <TypewriterText
          text="Έχεις πρόσκληση από"
          active={!go}
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: "white",
            textShadow: "0 3px 14px rgba(0,0,0,0.45)",
          }}
        />
        <div style={{ height: 8 }} />
        <TypewriterText
          text={inviterLine}
          active={!go}
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: "white",
            opacity: 0.95,
            textShadow: "0 3px 14px rgba(0,0,0,0.40)",
          }}
        />

        <div style={{ height: 20 }} />

        <button
          type="button"
          onClick={handleOpen}
          style={{
            width: "min(360px, 92vw)",
            padding: "14px 16px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.35)",
            background: "rgba(255,255,255,0.88)",
            color: "#111",
            fontWeight: 900,
            cursor: "pointer",
            boxShadow: "0 14px 34px rgba(0,0,0,0.18)",
            transform: "translateY(0px)",
opacity: 1,
            transition: "transform 120ms ease, opacity 200ms ease",
          }}
        >
          Άνοιγμα προσκλητηρίου
        </button>
      </div>
    </div>
  );
}

function pageStyle(bgUrl: string): React.CSSProperties {
  return {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 18,
    backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#efe7df",
  };
}