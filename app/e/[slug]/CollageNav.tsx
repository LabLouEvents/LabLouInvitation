"use client";

import React from "react";
import { useRouter } from "next/navigation";

export type CardKey = "invite" | "rsvp" | "church" | "venue";

export default function CollageNav({
  slug,
  t,
}: {
  slug: string;
  t: string;
}) {
  const router = useRouter();

  const cards: { key: CardKey; label: string; src: string }[] = [
    { key: "invite", label: "Προσκλητήριο", src: "/invites/1.png" },
    { key: "rsvp", label: "RSVP", src: "/invites/2.png" },
    { key: "church", label: "Εκκλησία", src: "/invites/3.png" },
    { key: "venue", label: "Κέντρο", src: "/invites/4.png" },
  ];

  // ΚΡΑΤΑΜΕ ΤΟ OVERLAP ΠΟΥ ΣΟΥ ΑΡΕΣΕΙ
  const W = 320;
  const H = 390;
  const OVERLAP_Y = 430;
  const STEP_X = 34;
  const ROT = 6;
  const RADIUS = 18;

  // cache-buster για να παίρνει νέες εικόνες
  const ASSET_VER = "v3";

  function go(key: CardKey) {
    router.push(`/e/${encodeURIComponent(slug)}/${key}?t=${encodeURIComponent(t)}`);
  }

  return (
    <div
      style={{
        position: "relative",
        width: "min(92vw, 420px)",
        height: H + OVERLAP_Y * 3,
        margin: "0 auto",
        marginTop: 18,
      }}
    >
      {cards.map((c, i) => {
        const left = i % 2 === 0;
        const x = left ? -STEP_X : STEP_X;
        const y = i * OVERLAP_Y;
        const r = left ? -ROT : ROT;

        return (
          <button
            key={c.key}
            type="button"
            onClick={() => go(c.key)}
            style={{
              position: "absolute",
              left: "50%",
              top: y,
              transform: `translateX(-50%) translateX(${x}px) rotate(${r}deg)`,
              width: W,
              height: H,
              maxWidth: "92vw",
              borderRadius: RADIUS,
              border: "1px solid rgba(255,255,255,0.35)",
              background: `url(${c.src}?${ASSET_VER}) center/cover no-repeat`,
              boxShadow: "0 20px 55px rgba(0,0,0,0.22)",
              cursor: "pointer",
              padding: 0,
              outline: "none",
              overflow: "hidden",
              zIndex: 100 - i,
              pointerEvents: "auto",
            }}
            aria-label={c.label}
            title={c.label}
          >
            <div
              style={{
                position: "absolute",
                left: 12,
                top: 12,
                padding: "7px 10px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 0.2,
                background: "rgba(255,255,255,0.72)",
                color: "#111",
                boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
                textShadow: "0 1px 0 rgba(255,255,255,0.55)",
                backdropFilter: "blur(6px)",
              }}
            >
              {c.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}