"use client";

import React from "react";

export type CardKey = "invite" | "rsvp" | "church" | "venue";

type Card = {
  key: CardKey;
  label: string;
  src: string;
};

export default function CollageNav({ onSelect }: { onSelect: (k: CardKey) => void }) {
  const cards: Card[] = [
    { key: "invite", label: "Προσκλητήριο", src: "/invites/1.png" },
    { key: "rsvp", label: "RSVP", src: "/invites/2.png" },
    { key: "church", label: "Εκκλησία", src: "/invites/3.png" },
    { key: "venue", label: "Κέντρο", src: "/invites/4.png" },
  ];

  // Μεγάλο + αραιό + εναλλάξ δεξιά/αριστερά
  const CARD_W = 820;
  const CARD_H = 520;
  const STEP_Y = 460;
  const STEP_X = 120;
  const ROT = 5;

  return (
    <div
      style={{
        position: "relative",
        width: "min(94vw, 880px)",
        height: STEP_Y * 3 + CARD_H + 40,
        margin: "0 auto",
        marginTop: 14,
        marginBottom: 10,
      }}
    >
      {cards.map((c, i) => {
        const isLeft = i % 2 === 0;
        const x = isLeft ? -STEP_X : STEP_X;
        const y = i * STEP_Y;
        const r = isLeft ? -ROT : ROT;

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
              borderRadius: 18,
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 14px 34px rgba(0,0,0,0.12)",
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
                background: "rgba(255,255,255,0.78)",
                backdropFilter: "blur(6px)",
                padding: "8px 10px",
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 700,
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