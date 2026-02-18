"use client";

import { useEffect, useMemo, useState } from "react";
import Countdown from "./Countdown";
import RSVPForm from "./RSVPForm";

type CardKey = "invite" | "rsvp" | "church" | "venue";

type EventFull = {
  slug: string;
  title: string;
  subtitle?: string | null;
  inviter_names?: string | null;

  start_iso: string;
  rsvp_deadline?: string | null;

  church_name?: string | null;
  church_address?: string | null;
  church_map_url?: string | null;

  venue_name?: string | null;
  venue_address?: string | null;
  venue_map_url?: string | null;

  extra_note?: string | null;
};

function storageKey(slug: string, t: string) {
  return `intro_seen:${slug}:${t}`;
}

/* -----------------------------
   Collage (inviart-ish)
------------------------------ */
function CollageNav({ onSelect }: { onSelect: (k: CardKey) => void }) {
  const cards: { key: CardKey; label: string; src: string }[] = [
    { key: "invite", label: "Προσκλητήριο", src: "/invites/1.png" },
    { key: "rsvp", label: "RSVP", src: "/invites/2.png" },
    { key: "church", label: "Εκκλησία", src: "/invites/3.png" },
    { key: "venue", label: "Κέντρο", src: "/invites/4.png" },
  ];

  // Μικρότερες, πιο “τετραγωνισμένες”, να πατάει η μία πάνω στην άλλη
  const W = 360;
  const H = 260;
  const OVERLAP_Y = 85; // μικρότερο = περισσότερο overlap
  const STEP_X = 34;
  const ROT = 6;

  return (
    <div
      style={{
        position: "relative",
        width: "min(92vw, 440px)",
        height: H + OVERLAP_Y * 3,
        margin: "0 auto",
        marginTop: 10,
      }}
    >
      {cards.map((c, i) => {
        const left = i % 2 === 0;
        const x = left ? -STEP_X : STEP_X;
        const y = i * OVERLAP_Y;
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
              width: W,
              height: H,
              maxWidth: "92vw",
              borderRadius: 18,
              border: "1px solid rgba(0,0,0,0.08)",
              background: `url(${c.src}) center/cover no-repeat`,
              boxShadow: "0 18px 46px rgba(0,0,0,0.18)",
              cursor: "pointer",
              padding: 0,
              zIndex: 100 - i,
              overflow: "hidden",
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
                padding: "7px 10px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 800,
                color: "#111",
                backdropFilter: "blur(6px)",
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
  const [active, setActive] = useState<CardKey | null>(null);

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
    setActive(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* =========================
     INTRO SCREEN
  ========================= */
  if (showIntro) {
    const pageBg = "/intro/background.jpg"; // public/intro/background.jpg
    const envelopeImg = "/intro/envelope.png"; // public/intro/envelope.png

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
            filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.22))",
          }}
        />

        <div
          style={{
            color: "white",
            textShadow: "0 3px 12px rgba(0,0,0,0.65)",
          }}
        >
          <div style={{ fontSize: 26, fontWeight: 900 }}>
            Έχεις πρόσκληση από
          </div>

          <div style={{ marginTop: 10, fontSize: 20, fontWeight: 900 }}>
            « {inviter || "—"} »
          </div>

          {/* ΜΟΝΟ τα γράμματα countdown, χωρίς πλαίσιο/τίτλο */}
          {event.start_iso && (
            <div style={{ marginTop: 26, fontSize: 20, fontWeight: 900 }}>
              <Countdown startISO={event.start_iso} />
            </div>
          )}

          <button
            onClick={enterInvite}
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
            }}
          >
            Άνοιγμα προσκλητηρίου
          </button>

          <div style={{ marginTop: 14, fontSize: 13, opacity: 0.95 }}>
            (Την επόμενη φορά θα ανοίγει κατευθείαν.)
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN PAGE (4 images + ανοίγει ενότητα μόνο όταν πατάς)
  ========================= */
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 22,
        background: "#faf7f2",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        {/* Countdown πάνω */}
        {event.start_iso && (
          <div style={{ textAlign: "center", fontSize: 16, fontWeight: 800 }}>
            <Countdown startISO={event.start_iso} />
          </div>
        )}

        {/* Title */}
        <div style={{ marginTop: 14, textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: 30 }}>{event.title}</h1>
          {event.subtitle && (
            <p style={{ marginTop: 10, opacity: 0.85 }}>{event.subtitle}</p>
          )}
        </div>

        {/* Collage */}
        <div style={{ marginTop: 18 }}>
          <CollageNav onSelect={(k) => setActive(k)} />
          <div
            style={{
              textAlign: "center",
              marginTop: 10,
              opacity: 0.7,
              fontSize: 13,
            }}
          >
            Πάτα σε μία φωτογραφία για να ανοίξει η αντίστοιχη ενότητα.
          </div>
        </div>

        {/* Panel ανοίγει μόνο όταν πατήσεις */}
        {active && (
          <div
            style={{
              marginTop: 18,
              borderRadius: 18,
              background: "white",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 14px 40px rgba(0,0,0,0.08)",
              padding: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: 900 }}>
                {active === "invite" && "Προσκλητήριο"}
                {active === "rsvp" && "RSVP"}
                {active === "church" && "Εκκλησία"}
                {active === "venue" && "Κέντρο"}
              </div>

              <button
                type="button"
                onClick={() => setActive(null)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(0,0,0,0.12)",
                  background: "#fff",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                Κλείσιμο
              </button>
            </div>

            <div style={{ height: 14 }} />

            {/* Invite */}
            {active === "invite" && (
              <div style={{ lineHeight: 1.6 }}>
                <div style={{ fontWeight: 900, fontSize: 18 }}>{event.title}</div>
                {event.subtitle && <div style={{ marginTop: 6 }}>{event.subtitle}</div>}
                {event.extra_note && (
                  <div style={{ marginTop: 10, opacity: 0.85 }}>{event.extra_note}</div>
                )}
              </div>
            )}

            {/* RSVP */}
            {active === "rsvp" && (
              <div>
                {event.rsvp_deadline && (
                  <div style={{ marginBottom: 10, opacity: 0.9 }}>
                    Παρακαλούμε απαντήστε έως:{" "}
                    <b style={{ textDecoration: "underline" }}>{event.rsvp_deadline}</b>
                  </div>
                )}

                <a
                  href={gcalUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "block",
                    textAlign: "center",
                    textDecoration: "none",
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: "#111",
                    color: "white",
                    fontWeight: 900,
                  }}
                >
                  Προσθήκη στο Google Calendar
                </a>

                <a
                  href={`/api/ics?slug=${encodeURIComponent(slug)}`}
                  style={{
                    display: "block",
                    textAlign: "center",
                    textDecoration: "none",
                    marginTop: 12,
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: "#111",
                    color: "white",
                    fontWeight: 900,
                  }}
                >
                  Προσθήκη στο iPhone / Apple Calendar
                </a>

                <div style={{ height: 14 }} />

                <RSVPForm slug={slug} />
              </div>
            )}

            {/* Church */}
            {active === "church" && (
              <div style={{ lineHeight: 1.6 }}>
                <div style={{ fontWeight: 900 }}>{event.church_name || "-"}</div>
                {event.church_address && (
                  <div style={{ opacity: 0.85, marginTop: 6 }}>{event.church_address}</div>
                )}
                {event.church_map_url && (
                  <a
                    href={event.church_map_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#111",
                      textDecoration: "underline",
                      display: "inline-block",
                      marginTop: 10,
                      fontWeight: 800,
                    }}
                  >
                    Άνοιγμα χάρτη
                  </a>
                )}
              </div>
            )}

            {/* Venue */}
            {active === "venue" && (
              <div style={{ lineHeight: 1.6 }}>
                <div style={{ fontWeight: 900 }}>{event.venue_name || "-"}</div>
                {event.venue_address && (
                  <div style={{ opacity: 0.85, marginTop: 6 }}>{event.venue_address}</div>
                )}
                {event.venue_map_url && (
                  <a
                    href={event.venue_map_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      color: "#111",
                      textDecoration: "underline",
                      display: "inline-block",
                      marginTop: 10,
                      fontWeight: 800,
                    }}
                  >
                    Άνοιγμα χάρτη
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}