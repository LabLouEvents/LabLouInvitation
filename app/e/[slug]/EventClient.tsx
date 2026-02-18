"use client";

import { useEffect, useMemo, useState } from "react";
import Countdown from "./Countdown";

type EventFull = {
  slug: string;
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
  }, [event]);

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
    window.scrollTo({ top: 0 });
  }

  /* ===================================================
     INTRO SCREEN
  =================================================== */

  if (showIntro) {
    const pageBg = "/intro/background.jpg";   // 👈 βάλε εδώ τη φωτογραφία σου (public/intro/)
    const envelopeImg = "/intro/envelope.png"; // 👈 ο φάκελος (public/intro/)

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
            marginBottom: 18,
            fontWeight: 600,
            color: "white",
            textShadow: "0 2px 10px rgba(0,0,0,0.6)",
          }}
        >
          LAB LOU INVITATIONS
        </div>

        {/* Envelope - ΚΑΝΟΝΙΚΟ ΣΧΗΜΑ */}
        <img
          src={envelopeImg}
          alt="Envelope"
          style={{
            width: "min(85vw, 520px)",
            height: "auto",
            objectFit: "contain",
            marginBottom: 40,
            filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.25))",
          }}
        />

        {/* Text κάτω από τον φάκελο */}
        <div
          style={{
            textAlign: "center",
            color: "white",
            textShadow: "0 3px 12px rgba(0,0,0,0.7)",
            maxWidth: 600,
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
            <div style={{ marginTop: 24 }}>
              <div style={{ marginBottom: 8, fontWeight: 600 }}>
                Μέχρι να ξεκινήσει:
              </div>

              <div
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                }}
              >
                <Countdown startISO={event.start_iso} />
              </div>
            </div>
          )}

          <button
            onClick={enterInvite}
            style={{
              marginTop: 30,
              padding: "12px 30px",
              borderRadius: 14,
              border: "none",
              background: "white",
              color: "#111",
              fontWeight: 900,
              cursor: "pointer",
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            }}
          >
            Άνοιγμα προσκλητηρίου
          </button>

          <div style={{ marginTop: 14, fontSize: 13, opacity: 0.9 }}>
            (Την επόμενη φορά θα ανοίγει κατευθείαν.)
          </div>
        </div>
      </div>
    );
  }

  /* ===================================================
     MAIN PAGE (προσωρινά απλό)
  =================================================== */

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        background: "#faf7f2",
      }}
    >
      <h1 style={{ textAlign: "center" }}>{event.title}</h1>

      {event.subtitle && (
        <p style={{ textAlign: "center" }}>{event.subtitle}</p>
      )}

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <a
          href={gcalUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            padding: "10px 20px",
            background: "#111",
            color: "white",
            borderRadius: 8,
            textDecoration: "none",
          }}
        >
          Προσθήκη στο Google Calendar
        </a>
      </div>
    </div>
  );
}