"use client";

import { useEffect, useMemo, useState } from "react";
import Countdown from "./Countdown";
import RSVPForm from "./RSVPForm";

type CardKey = "invite" | "rsvp" | "church" | "venue";

type EventFull = {
  slug: string;
  template: "elegant" | "playful";
  title: string;
  subtitle?: string | null;
  inviter_names?: string | null;
  church_name?: string | null;
  church_address?: string | null;
  church_map_url?: string | null;
  venue_name?: string | null;
  venue_address?: string | null;
  venue_map_url?: string | null;
  start_iso: string;
  rsvp_deadline?: string | null;
  extra_note?: string | null;
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
  const [active, setActive] = useState<CardKey | null>(null);

  useEffect(() => {
    const seen = localStorage.getItem(storageKey(slug, t));
    if (seen === "1") setShowIntro(false);
  }, [slug, t]);

  function enterInvite() {
    localStorage.setItem(storageKey(slug, t), "1");
    setShowIntro(false);
  }

  /* ======================
     INTRO SCREEN
  ====================== */
  if (showIntro) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background:
            "radial-gradient(circle at 20% 10%, #0b1220 0%, #070a12 55%, #04050a 100%)",
          color: "white",
          padding: 24,
        }}
      >
        <div
          style={{
            width: "min(92vw, 600px)",
            padding: 30,
            borderRadius: 22,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
            textAlign: "center",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.7, letterSpacing: 1 }}>
            LAB LOU INVITATIONS
          </div>

          <img
            src="/intro/envelope.png"
            alt="Envelope"
            style={{
              width: 130,
              margin: "18px auto",
              display: "block",
            }}
          />

          <h1 style={{ marginBottom: 8 }}>
            Έχεις πρόσκληση από
          </h1>

          <div style={{ fontWeight: 800, fontSize: 20 }}>
            « {inviter} »
          </div>

          {event.start_iso && (
            <div style={{ marginTop: 18 }}>
              <Countdown startISO={event.start_iso} />
            </div>
          )}

          <button
            onClick={enterInvite}
            style={{
              marginTop: 20,
              width: "100%",
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.15)",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Άνοιγμα προσκλητηρίου
          </button>
        </div>
      </div>
    );
  }

  /* ======================
     COLLAGE NAV
  ====================== */

  const cards = [
    { key: "invite" as CardKey, label: "Προσκλητήριο", src: "/invites/1.png" },
    { key: "rsvp" as CardKey, label: "RSVP", src: "/invites/2.png" },
    { key: "church" as CardKey, label: "Εκκλησία", src: "/invites/3.png" },
    { key: "venue" as CardKey, label: "Κέντρο", src: "/invites/4.png" },
  ];

  const W = 320;
  const H = 240;
  const OVERLAP = 85;
  const SHIFT = 35;
  const ROT = 6;

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 20% 10%, #0b1220 0%, #070a12 55%, #04050a 100%)",
        color: "white",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <h1>{event.title}</h1>
          {event.subtitle && <p>{event.subtitle}</p>}
        </div>

        <div
          style={{
            position: "relative",
            width: "min(92vw, 400px)",
            height: H + OVERLAP * 3,
            margin: "0 auto",
          }}
        >
          {cards.map((c, i) => {
            const left = i % 2 === 0;
            return (
              <button
                key={c.key}
                onClick={() => setActive(c.key)}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: i * OVERLAP,
                  transform: `translateX(-50%) translateX(${
                    left ? -SHIFT : SHIFT
                  }px) rotate(${left ? -ROT : ROT}deg)`,
                  width: W,
                  height: H,
                  borderRadius: 18,
                  background: `url(${c.src}) center/cover`,
                  border: "1px solid rgba(255,255,255,0.15)",
                  boxShadow: "0 18px 45px rgba(0,0,0,0.5)",
                  cursor: "pointer",
                }}
              />
            );
          })}
        </div>

        {active && (
          <div
            style={{
              marginTop: 40,
              padding: 20,
              borderRadius: 18,
              background: "rgba(255,255,255,0.08)",
            }}
          >
            <button onClick={() => setActive(null)}>Κλείσιμο</button>

            {active === "invite" && (
              <div style={{ marginTop: 10 }}>{event.extra_note}</div>
            )}

            {active === "rsvp" && (
              <div style={{ marginTop: 10 }}>
                <a href={gcalUrl} target="_blank">
                  Google Calendar
                </a>
                <RSVPForm slug={slug} />
              </div>
            )}

            {active === "church" && (
              <div style={{ marginTop: 10 }}>
                {event.church_name}
              </div>
            )}

            {active === "venue" && (
              <div style={{ marginTop: 10 }}>
                {event.venue_name}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}