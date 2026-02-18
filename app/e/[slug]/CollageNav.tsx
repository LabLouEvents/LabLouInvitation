"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export type CardKey = "invite" | "rsvp" | "church" | "venue";

export default function CollageNav({
  slug,
  cards,
}: {
  slug: string;
  cards: { key: CardKey; label: string; src: string }[];
}) {
  const router = useRouter();
  const sp = useSearchParams();
  const t = sp.get("t") || "";

  // ✅ ΚΡΑΤΑΜΕ OVERLAP 430 όπως θες
  const CARD_W = 520;
  const CARD_H = 520;
  const STEP_Y = 430; // 👈 αυτό είναι το “overlap”
  const STEP_X = 90;
  const ROT = 3;

  function go(key: CardKey) {
    // Πάμε σε /e/[slug]/[section]?t=...
    router.push(`/e/${encodeURIComponent(slug)}/${key}?t=${encodeURIComponent(t)}`);
  }

  return (
    <div
      style={{
        position: "relative",
        width: "min(92vw, 720px)",
        height: CARD_H + STEP_Y * (cards.length - 1) + 20,
        margin: "0 auto",
        marginTop: 20,
      }}
    >
      {cards.map((c, i) => {
        const left = i % 2 === 0;
        const x = left ? -STEP_X : STEP_X;
        const y = i * STEP_Y;
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
              width: CARD_W,
              height: CARD_H,
              maxWidth: "92vw",
              borderRadius: 18,
              border: "1px solid rgba(0,0,0,0.08)",
              background: `url(${c.src}) center/cover no-repeat`,
              boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
              cursor: "pointer",
              padding: 0,
              outline: "none",
              overflow: "hidden",
              zIndex: 100 - i, // 👈 όλες clickable σωστά
            }}
            aria-label={c.label}
            title={c.label}
          >
            <div
              style={{
                position: "absolute",
                left: 14,
                top: 14,
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.85)",
                fontSize: 14,
                fontWeight: 800,
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