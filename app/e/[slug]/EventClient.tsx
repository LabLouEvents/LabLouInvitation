"use client";

import { useEffect, useMemo, useState } from "react";
import Countdown from "./Countdown";

type EventFull = {
  slug: string;
  template: "elegant" | "playful";
  title: string;
  subtitle?: string | null;
  inviter_names?: string | null;
  start_iso: string;
};

function storageKey(slug: string, t: string) {
  return `intro_seen:${slug}:${t}`;
}

export default function EventClient({
  event,
  slug,
  gcalUrl,
  t,
}: {
  event: EventFull;
  slug: string;
  gcalUrl: string;
  t: string;
}) {
  const inviter = useMemo(() => {
    return (event.inviter_names || event.subtitle || event.title || "").trim();
  }, [event.inviter_names, event.subtitle, event.title]);

  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(storageKey(slug, t));
      if (seen === "1") setShowIntro(false);
    } catch {}
  }, [slug, t]);

  function enterInvite() {
    try {
      localStorage.setItem(storageKey(slug, t), "1");
    } catch {}
    setShowIntro(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* =========================
     INTRO SCREEN
  ========================= */

  if (showIntro) {
    const pageBg = "/intro/background.jpg";
    const envelopeImg = "/intro/envelope.png";

    return (
      <div
        style={{
          minHeight: "100vh",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url(${pageBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: 13,
            letterSpacing: 1,
            marginBottom: 20,
            color: "#ffffff",
            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
          }}
        >
          LAB LOU INVITATIONS
        </div>

        {/* Envelope (κανονικό σχήμα) */}
        <img
          src={envelopeImg}
          alt="Envelope"
          style={{
            width: "min(80vw, 520px)",
            height: "auto",
            objectFit: "contain",
            display: "block",
            marginBottom: 40,
            filter: "drop-shadow(0 20px 35px rgba(0,0,0,0.25))",
          }}
        />

        {/* Text κάτω από φάκελο */}
        <div
          style={{
            textAlign: "center",
            color: "#ffffff",
            textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            maxWidth: 620,
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 900,
            }}
          >
            Έχεις πρόσκληση από
          </h1>

          <div
            style={{
              marginTop: 10,
              fontSize: 20,
              fontWeight: 900,
            }}
          >
            « {inviter || "—"} »
          </div>

          {event.start_iso && (
            <div style={{ marginTop: 22 }}>
              <div style={{ marginBottom: 8 }}>
                Μέχρι να ξεκινήσει:
              </div>

              <div
                style={{
                  padding: "10px 18px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.9)",
                  color: "#111",
                  fontWeight: 800,
                  display: "inline-block",
                }}
              >
                <Countdown startISO={event.start_iso} />
              </div>
            </div>
          )}

          <button
            onClick={enterInvite}
            style={{
              marginTop: 26,
              padding: "12px 28px",
              borderRadius: 14,
              border: "none",
              background: "white",
              color: "#111",
              fontWeight: 900,
              cursor: "pointer",
              boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
            }}
          >
            Άνοιγμα προσκλητηρίου
          </button>

          <div
            style={{
              marginTop: 12,
              fontSize: 13,
              opacity: 0.9,
            }}
          >
            (Την επόμενη φορά θα ανοίγει κατευθείαν.)
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN PAGE (placeholder)
  ========================= */

  return (
    <div style={{ padding: 40 }}>
      <h1>{event.title}</h1>
      <a href={gcalUrl}>Προσθήκη στο Google Calendar</a>
    </div>
  );
}