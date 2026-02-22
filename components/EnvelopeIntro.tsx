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
      {active && shown.length < text.length ? (
        <span style={{ opacity: 0.6 }}>▍</span>
      ) : null}
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
  const [opening, setOpening] = useState(false);

  const inviterLine = useMemo(() => {
    const v = clampText(inviter, 60);
    return v ? `« ${v} »` : "« — »";
  }, [inviter]);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);

    // δείχνουμε animation και μετά πάμε στη σελίδα με τις 4 κάρτες
    setTimeout(() => {
      router.push(
        `/e/${encodeURIComponent(slug)}/section?t=${encodeURIComponent(t)}`
      );
    }, 1200);
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
        backgroundRepeat: "no-repeat",
        backgroundColor: "#efe7df",
      }}
    >
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

        {/* Envelope Scene */}
        <div
          style={{
            position: "relative",
            width: "min(520px, 86vw)",
            height: "min(360px, 62vw)",
            margin: "0 auto",
            filter: "drop-shadow(0 18px 34px rgba(0,0,0,0.20))",
            perspective: "1200px",
          }}
        >
          {/* Letter (inside) - βγαίνει προς τα πάνω */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              transform: opening ? "translateY(-18%)" : "translateY(6%)",
              opacity: opening ? 1 : 0,
              transition: "transform 900ms ease, opacity 450ms ease",
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image
                src="/envelope/inside.png"
                alt="Invitation letter"
                fill
                priority
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>

          {/* Base */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <Image
              src="/envelope/base.png"
              alt="Envelope"
              fill
              priority
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Flap - ανοίγει με rotate */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              transformOrigin: "50% 12%",
              transformStyle: "preserve-3d",
              transform: opening ? "rotateX(165deg)" : "rotateX(0deg)",
              transition: "transform 900ms ease",
              pointerEvents: "none",
            }}
          >
            <Image
              src="/envelope/flap.png"
              alt="Envelope flap"
              fill
              priority
              style={{ objectFit: "contain", backfaceVisibility: "hidden" }}
            />
          </div>
        </div>

        <div style={{ height: 18 }} />

        {/* Text */}
        <TypewriterText
          text="Έχεις πρόσκληση από"
          active={!opening}
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
          active={!opening}
          style={{
            fontSize: 20,
            fontWeight: 900,
            color: "white",
            opacity: 0.95,
            textShadow: "0 3px 14px rgba(0,0,0,0.40)",
          }}
        />

        <div style={{ height: 22 }} />

        {/* Button */}
        <button
          type="button"
          onClick={handleOpen}
          style={{
            width: "min(360px, 92vw)",
            padding: "14px 16px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.35)",
            background: "rgba(255,255,255,0.85)",
            color: "#111",
            fontWeight: 900,
            cursor: "pointer",
            boxShadow: "0 14px 34px rgba(0,0,0,0.18)",
            opacity: opening ? 0.8 : 1,
          }}
        >
          {opening ? "Ανοίγει…" : "Άνοιγμα προσκλητηρίου"}
        </button>
      </div>
    </div>
  );
}