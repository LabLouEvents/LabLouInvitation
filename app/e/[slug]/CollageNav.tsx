"use client";

import React from "react";
import { useRouter } from "next/navigation";

export type CardKey = "invite" | "rsvp" | "church" | "venue";

export default function CollageNav({ slug, t }: { slug: string; t: string }) {
  const router = useRouter();

  const cards: { key: CardKey; label: string; src: string }[] = [
    { key: "invite", label: "Προσκλητήριο", src: "/invites/1.png" },
    { key: "rsvp", label: "RSVP", src: "/invites/2.png" },
    { key: "church", label: "Εκκλησία", src: "/invites/3.png" },
    { key: "venue", label: "Κέντρο", src: "/invites/4.png" },
  ];

  // Κρατάμε το overlap που σου αρέσει
  const W = 320;
  const H = 390;
  const OVERLAP_Y = 430;
  const STEP_X = 34;
  const ROT = 6;
  const RADIUS = 18;

  function go(key: CardKey) {
    router.push(`/e/${encodeURIComponent(slug)}/section/${key}?t=${encodeURIComponent(t || "")}`);
  }

  return (
    <div
      style={{
        position: "relative",
        width: "min(92vw, 420px)",
        height: H + OVERLAP_Y * (cards.length - 1),
        margin: "0 auto",
        marginTop: 18,
        marginBottom: 8,
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
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 14px 34px rgba(0,0,0,0.14)",
              background: `url(${c.src}) center/cover no-repeat`,
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
                background: "rgba(255,255,255,0.82)",
                backdropFilter: "blur(8px)",
                padding: "8px 10px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 800,
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