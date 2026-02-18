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
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          padding: 24,
          background:
            "radial-gradient(circle at 30% 0%, rgba(212,175,55,0.12) 0%, rgba(11,18,32,1) 35%, rgba(4,5,10,1) 100%)",
        }}
      >
        <style>{`
          @keyframes introIn {
            to { opacity: 1; transform: translateY(0px); }
          }
        `}</style>

        <div
          style={{
            width: "min(92vw, 620px)",
            padding: 34,
            borderRadius: 26,
            textAlign: "center",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 26px 90px rgba(0,0,0,0.62)",
            color: "white",
            opacity: 0,
            transform: "translateY(8px)",
            animation: "introIn 520ms ease forwards",
          }}
        >
          <div style={{ opacity: 0.75, letterSpacing: 1, fontSize: 13 }}>
            LAB LOU INVITATIONS
          </div>

          {/* ENVELOPE */}
          <img
            src="/intro/envelope.png"
            alt="Envelope"
            style={{
              width: 200,
              height: "auto",
              margin: "22px auto 14px",
              display: "block",
              filter: "drop-shadow(0 22px 34px rgba(0,0,0,0.45))",
              transition: "transform 220ms ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-4px) scale(1.04)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0px) scale(1)")
            }
          />

          <h1 style={{ margin: "10px 0 8px", fontSize: 26 }}>
            Έχεις πρόσκληση από
          </h1>

          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>
            « {inviter || "—"} »
          </div>

          {event.start_iso && (
            <div
              style={{
                padding: 14,
                borderRadius: 18,
                border: "1px solid rgba(255,255,255,0.12)",
                background: "rgba(255,255,255,0.06)",
                marginBottom: 18,
              }}
            >
              <Countdown startISO={event.start_iso} />
            </div>
          )}

          <button
            onClick={enterInvite}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 16,
              border: "1px solid rgba(212,175,55,0.45)",
              background:
                "linear-gradient(135deg, rgba(212,175,55,0.28), rgba(255,255,255,0.08))",
              color: "white",
              fontWeight: 800,
              cursor: "pointer",
              fontSize: 15,
              boxShadow: "0 16px 36px rgba(0,0,0,0.45)",
            }}
          >
            Άνοιγμα προσκλητηρίου
          </button>

          <div style={{ marginTop: 12, opacity: 0.65, fontSize: 13 }}>
            (Την επόμενη φορά θα ανοίγει κατευθείαν.)
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN PAGE (προσωρινό απλό)
  ========================= */
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 32,
        background:
          "radial-gradient(circle at 30% 0%, rgba(212,175,55,0.12) 0%, rgba(11,18,32,1) 35%, rgba(4,5,10,1) 100%)",
        color: "white",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 10 }}>{event.title}</h1>
      {event.subtitle && <p style={{ opacity: 0.8 }}>{event.subtitle}</p>}

      <div style={{ marginTop: 24 }}>
        <a
          href={gcalUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            padding: "14px 18px",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.08)",
            color: "white",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Προσθήκη στο Google Calendar
        </a>
      </div>
    </div>
  );
}