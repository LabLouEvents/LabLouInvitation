"use client";

import Image from "next/image";

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
        style={{
          display: "inline-block",
          marginTop: 12,
          padding: "10px 14px",
          borderRadius: 8,
          border: "1px solid #ccc",
          textDecoration: "none",
        }}
      >
        Άνοιγμα προσκλητηρίου
      </a>
    </main>
  );
}