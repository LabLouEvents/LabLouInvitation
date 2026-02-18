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

  if (showIntro) {
    const pageBg = "/intro/background.jpg";
    const envelopeImg = "/intro/envelope.png";

    return (
      <div
        style={{
          minHeight: "100vh",
          position: "relative",
          backgroundImage: `url(${pageBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* ✅ Αυτό απορροφά ΟΛΑ τα κλικ για να μην “περνάνε” σε link από κάτω */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "auto",
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />

        {/* ✅ ΜΟΝΟ το κουμπί επιτρέπεται να πατηθεί */}
        <div
          style={{
            position: "relative",
            zIndex: 2,
            minHeight: "100vh",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 13,
              letterSpacing: 1,
              marginBottom: 18,
              fontWeight: 700,
              color: "white",
              textShadow: "0 2px 10px rgba(0,0,0,0.55)",
              pointerEvents: "none",
            }}
          >
            LAB LOU INVITATIONS
          </div>

          <img
            src={envelopeImg}
            alt="Envelope"
            style={{
              width: "min(86vw, 560px)",
              height: "auto",
              objectFit: "contain",
              display: "block",
              marginBottom: 44,
              filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.25))",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              color: "white",
              textShadow: "0 3px 12px rgba(0,0,0,0.65)",
              pointerEvents: "none",
            }}
          >
            <div style={{ fontSize: 26, fontWeight: 900 }}>
              Έχεις πρόσκληση από
            </div>

            <div style={{ marginTop: 10, fontSize: 20, fontWeight: 900 }}>
              « {inviter || "—"} »
            </div>

            {event.start_iso && (
              <div style={{ marginTop: 26, fontSize: 20, fontWeight: 900 }}>
                <Countdown startISO={event.start_iso} />
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              enterInvite();
            }}
            style={{
              marginTop: 32,
              padding: "14px 32px",
              borderRadius: 14,
              border: "none",
              background: "white",
              color: "#111",
              fontWeight: 900,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
              pointerEvents: "auto",
              zIndex: 3,
            }}
          >
            Άνοιγμα προσκλητηρίου
          </button>

          <div
            style={{
              marginTop: 14,
              fontSize: 13,
              opacity: 0.92,
              color: "white",
              textShadow: "0 2px 10px rgba(0,0,0,0.55)",
              pointerEvents: "none",
            }}
          >
            (Την επόμενη φορά θα ανοίγει κατευθείαν.)
          </div>
        </div>
      </div>
    );
  }

  // MAIN (προσωρινό)
  return (
    <div style={{ minHeight: "100vh", padding: 24, background: "#faf7f2" }}>
      <h1 style={{ textAlign: "center" }}>{event.title}</h1>
      {event.subtitle && <p style={{ textAlign: "center" }}>{event.subtitle}</p>}

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