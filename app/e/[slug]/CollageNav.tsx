"use client";

import React from "react";

export type CardKey = "invite" | "rsvp" | "church" | "venue";

export default function CollageNav({
  cards,
  onSelect,
}: {
  cards: { key: CardKey; label: string; src: string }[];
  onSelect: (key: CardKey) => void;
}) {
  // “σχεδόν ολόκληρη” + ελάχιστο overlap
  const CARD_W = 820;
  const CARD_H = 520;

  // πιο αραιά προς τα κάτω
  const STEP_Y = 470; // κοντά στο CARD_H => φαίνονται σχεδόν ολόκληρες
  const STEP_X = 130; // εναλλάξ δεξιά/αριστερά
  const ROT = 5;      // κλίση

  return (
    <div
      style={{
        position: "relative",
        width: "min(94vw, 900px)",
        height: STEP_Y * (cards.length - 1) + CARD_H,
        margin: "0 auto",
        marginTop: 8,
        marginBottom: 8,
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
            onClick={() => onSelect(c.key)}
            style={{
              position: "absolute",
              left: "50%",
              top: y,
              transform: `translateX(-50%) translateX(${x}px) rotate(${r}deg)`,
              width: CARD_W,
              height: CARD_H,
              maxWidth: "94vw",
              borderRadius: 20,
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 16px 40px rgba(0,0,0,0.14)",
              background: `url(${c.src}) center/cover no-repeat`,
              cursor: "pointer",
              padding: 0,
              outline: "none",
              zIndex: 100 - i,
              overflow: "hidden",
            }}
            aria-label={c.label}
            title={c.label}
          >
            <div
              style={{
                position: "absolute",
                left: 14,
                top: 14,
                background: "rgba(255,255,255,0.80)",
                backdropFilter: "blur(8px)",
                padding: "10px 12px",
                borderRadius: 14,
                fontSize: 15,
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