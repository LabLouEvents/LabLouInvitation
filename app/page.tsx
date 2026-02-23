"use client";

import React from "react";

export default function Home() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "40px auto",
        padding: 16,
        fontFamily: "system-ui",
      }}
    >
      <h1>RSVP Invitations</h1>

      <p>Πήγαινε στο demo:</p>

      <a
        href="/e/demo"
        style={btn}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
          e.currentTarget.style.boxShadow = "0 22px 60px rgba(0,0,0,0.22)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.14)";
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "translateY(-2px) scale(0.98)";
          e.currentTarget.style.boxShadow = "0 14px 34px rgba(0,0,0,0.18)";
        }}
        onMouseUp={(e) => {
          // επιστρέφει στο hover state (αν ο κέρσορας είναι ακόμα πάνω)
          e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
          e.currentTarget.style.boxShadow = "0 22px 60px rgba(0,0,0,0.22)";
        }}
      >
        Άνοιγμα προσκλητηρίου
      </a>
    </main>
  );
}

const btn: React.CSSProperties = {
  display: "inline-block",
  marginTop: 12,
  padding: "12px 16px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(255,255,255,0.9)",
  textDecoration: "none",
  color: "#111",
  fontWeight: 800,
  cursor: "pointer",

  // βάση (η “ηρεμία” του κουμπιού)
  boxShadow: "0 12px 30px rgba(0,0,0,0.14)",
  transition:
    "transform 0.22s cubic-bezier(.22,.61,.36,1), box-shadow 0.22s ease, background 0.22s ease",
};