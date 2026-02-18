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
  // Πιο μικρές + πιο "τετραγωνισμένες"
  const CARD_W = 640;
  const CARD_H = 430; // πιο κοντά σε τετράγωνο (αν το θες πιο square κάνε 520/520)

  // Τώρα θέλουμε ΣΤΟΙΒΑ: μικρό overlap και να "πατάει" η κάθε επόμενη ΠΑΝΩ στην προηγούμενη
  // Άρα STEP_Y μικρό, όχι κοντά στο ύψος.
  const STEP_Y = 95;  // όσο πιο μικρό, τόσο περισσότερο overlap
  const STEP_X = 80;  // δεξιά/αριστερά εναλλάξ
  const ROT = 4;      // λίγη κλίση

  // Η τελευταία κάρτα να είναι πάνω-πάνω (clickable)
  // Θα δώσουμε zIndex = i ώστε η τελευταία (i=3) να είναι μπροστά.
  // Και height μικρή γιατί είναι στοίβα, όχι σκάλα.
  return (
    <div
      style={{
        position: "relative",
        width: "min(92vw, 720px)",
        height: CARD_H + STEP_Y * (cards.length - 1) + 10,
        margin: "0 auto",
        marginTop: 10,
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
              maxWidth: "92vw",
              borderRadius: 16, // λίγο πιο "τετραγωνισμένο"
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 14px 34px rgba(0,0,0,0.14)",
              background: `url(${c.src}) center/cover no-repeat`,
              cursor: "pointer",
              padding: 0,
              outline: "none",
              overflow: "hidden",
              zIndex: i, // η τελευταία κάρτα πάνω-πάνω
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