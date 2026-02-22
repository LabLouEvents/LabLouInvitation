"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function clampText(s: string, max = 60) {
  const t = (s || "").trim();
  if (!t) return "";
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
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
    const v = clampText(inviter);
    return v ? `« ${v} »` : "« — »";
  }, [inviter]);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);

    setTimeout(() => {
      router.push(`/e/${slug}/section?t=${t}`);
    }, 1600);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: 2,
            fontWeight: 900,
            color: "white",
            marginBottom: 20,
          }}
        >
          LABLOU EVENTS
        </div>

        {/* ENVELOPE */}
        <div
          style={{
            position: "relative",
            width: 520,
            height: 360,
            perspective: 1200,
          }}
        >
          {/* INSIDE CARD */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: opening
                ? "translateY(-80px)"
                : "translateY(0px)",
              transition: "transform 1s ease",
              zIndex: 1,
            }}
          >
            <Image
              src="/envelope/inside.png"
              alt="Inside card"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* BASE */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
            }}
          >
            <Image
              src="/envelope/base.png"
              alt="Envelope base"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* FLAP */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transformOrigin: "top center",
              transform: opening
                ? "rotateX(170deg)"
                : "rotateX(0deg)",
              transition: "transform 1.1s ease",
              zIndex: 3,
              backfaceVisibility: "hidden",
            }}
          >
            <Image
              src="/envelope/flap.png"
              alt="Envelope flap"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        <div style={{ height: 25 }} />

        <div style={{ fontSize: 22, fontWeight: 700, color: "white" }}>
          Έχεις πρόσκληση από
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "white",
            marginTop: 6,
          }}
        >
          {inviterLine}
        </div>

        <div style={{ height: 20 }} />

        <button
          onClick={handleOpen}
          style={{
            padding: "12px 26px",
            borderRadius: 30,
            border: "none",
            background: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {opening ? "Ανοίγει…" : "Άνοιγμα προσκλητηρίου"}
        </button>
      </div>
    </div>
  );
}