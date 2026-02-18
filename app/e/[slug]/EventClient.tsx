"use client";

import React, { useEffect, useMemo, useState } from "react";
import Countdown from "./Countdown";
import RSVPForm from "./RSVPForm";

type CardKey = "invite" | "rsvp" | "church" | "venue";

type EventFull = {
  slug: string;
  template?: "elegant" | "playful";
  title: string;
  subtitle?: string | null;

  inviter_names?: string | null;

  start_iso: string;
  end_iso?: string | null;

  rsvp_deadline?: string | null;
  extra_note?: string | null;

  church_name?: string | null;
  church_address?: string | null;
  church_map_url?: string | null;

  venue_name?: string | null;
  venue_address?: string | null;
  venue_map_url?: string | null;

  date_text?: string | null;
  time_text?: string | null;
};

function storageKey(slug: string, t: string) {
  return `intro_seen:${slug}:${t}`;
}

/* -----------------------------
   Collage (inviart-ish)
   - Portrait, λίγο πιο “τετραγωνισμένες”
   - Πιο “απόμακρες προς τα κάτω” αλλά να ΜΗ φεύγουν εκτός
------------------------------ */
function CollageNav({ onSelect }: { onSelect: (k: CardKey) => void }) {
  const cards: { key: CardKey; label: string; src: string }[] = [
    { key: "invite", label: "Προσκλητήριο", src: "/invites/1.png" },
    { key: "rsvp", label: "RSVP", src: "/invites/2.png" },
    { key: "church", label: "Εκκλησία", src: "/invites/3.png" },
    { key: "venue", label: "Κέντρο", src: "/invites/4.png" },
  ];

  // ✅ ΡΥΘΜΙΣΕΙΣ
  const W = 320;         // πλάτος
  const H = 410;         // ύψος (portrait, λίγο πιο τετραγωνάκι)
  const OVERLAP_Y = 385; // πιο κάτω/απόμακρες, αλλά όχι τρελά
  const STEP_X = 34;
  const ROT = 6;
  const RADIUS = 18;

  return (
    <div
      style={{
        position: "relative",
        width: "min(92vw, 420px)",
        height: H + OVERLAP_Y * 3,
        margin: "0 auto",
        marginTop: 18,
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
              borderRadius: RADIUS,
              border: "1px solid rgba(255,255,255,0.35)",
              background: `url(${c.src}) center/cover no-repeat`,
              boxShadow: "0 20px 55px rgba(0,0,0,0.22)",
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
                left: 12,
                top: 12,
                padding: "7px 10px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 0.2,
                background: "rgba(255,255,255,0.80)",
                color: "#111",
                boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
                textShadow: "0 2px 6px rgba(0,0,0,0.25)", // ✅ σκιά στα γράμματα
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
  // ✅ οι φωτογραφίες σου στο public/
  const pageBg = "/intro/background.jpg"; // public/intro/background.jpg
  const envelopeImg = "/intro/envelope.png"; // public/intro/envelope.png

  const inviter = useMemo(() => {
    return (event.inviter_names || event.subtitle || event.title || "").trim();
  }, [event.inviter_names, event.subtitle, event.title]);

  const [showIntro, setShowIntro] = useState(true);
  const [active, setActive] = useState<CardKey | null>(null);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(storageKey(slug, t));
      if (seen === "1") setShowIntro(false);
    } catch {
      // ignore
    }
  }, [slug, t]);

  function enterInvite() {
    try {
      localStorage.setItem(storageKey(slug, t), "1");
    } catch {
      // ignore
    }
    setShowIntro(false);
    setActive(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const textShadowStrong = "0 3px 14px rgba(0,0,0,0.55)";
  const textShadowSoft = "0 2px 10px rgba(0,0,0,0.45)";

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    padding: 24,
    backgroundImage: `url(${pageBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  /* =========================
     INTRO
  ========================= */
  if (showIntro) {
    return (
      <div
        style={{
          ...pageStyle,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 13,
            letterSpacing: 1,
            marginBottom: 18,
            fontWeight: 700,
            color: "white",
            textShadow: textShadowSoft,
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
            marginBottom: 34,
            filter: "drop-shadow(0 22px 34px rgba(0,0,0,0.22))",
          }}
        />

        <div style={{ textAlign: "center", color: "white", textShadow: textShadowStrong }}>
          <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>
            Έχεις πρόσκληση από
          </div>

          <div style={{ fontSize: 20, fontWeight: 900 }}>« {inviter || "—"} »</div>

          {event.start_iso && (
            <div style={{ marginTop: 18, fontSize: 20, fontWeight: 900 }}>
              <Countdown startISO={event.start_iso} />
            </div>
          )}

          <button
            onClick={enterInvite}
            style={{
              marginTop: 22,
              padding: "14px 34px",
              borderRadius: 14,
              border: "none",
              background: "white",
              color: "#111",
              fontWeight: 900,
              fontSize: 16,
              cursor: "pointer",
              boxShadow: "0 14px 34px rgba(0,0,0,0.22)",
            }}
          >
            Άνοιγμα προσκλητηρίου
          </button>

          <div style={{ marginTop: 12, fontSize: 13, opacity: 0.95 }}>
            (Την επόμενη φορά θα ανοίγει κατευθείαν.)
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN (ίδιο background με intro + 50% λευκό overlay)
  ========================= */
  return (
    <div style={{ ...pageStyle, position: "relative" }}>
      {/* ✅ 50% λευκό “πέπλο” πάνω από το background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(255,255,255,0.50)",
          pointerEvents: "none",
        }}
      />

      {/* content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 980, margin: "0 auto" }}>
        {/* Title */}
        <div style={{ textAlign: "center", color: "#111", textShadow: "0 2px 10px rgba(255,255,255,0.55)" }}>
          <div style={{ fontSize: 30, fontWeight: 900, marginTop: 10 }}>
            {event.title}
          </div>
          {event.subtitle && (
            <div style={{ marginTop: 8, opacity: 0.9, fontSize: 16 }}>
              {event.subtitle}
            </div>
          )}
        </div>

        {/* Countdown */}
        {event.start_iso && (
          <div
            style={{
              marginTop: 14,
              textAlign: "center",
              color: "#111",
              fontSize: 18,
              fontWeight: 900,
              textShadow: "0 2px 10px rgba(255,255,255,0.55)",
            }}
          >
            <Countdown startISO={event.start_iso} />
          </div>
        )}

        {/* Collage */}
        <CollageNav onSelect={(k) => setActive(k)} />

        <div
          style={{
            textAlign: "center",
            marginTop: 12,
            color: "#111",
            opacity: 0.75,
            fontSize: 13,
            textShadow: "0 2px 10px rgba(255,255,255,0.55)",
          }}
        >
          Πάτα σε μία κάρτα για να ανοίξει η αντίστοιχη ενότητα.
        </div>

        {/* Panel */}
        {active && (
          <div
            style={{
              marginTop: 18,
              borderRadius: 18,
              padding: 18,
              background: "rgba(255,255,255,0.92)",
              color: "#111",
              boxShadow: "0 18px 60px rgba(0,0,0,0.18)",
              backdropFilter: "blur(6px)",
              maxWidth: 760,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <div style={{ fontWeight: 900, fontSize: 16 }}>
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
                  background: "white",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                Κλείσιμο
              </button>
            </div>

            <div style={{ height: 14 }} />

            {active === "invite" && (
              <div style={{ lineHeight: 1.6 }}>
                <div style={{ fontWeight: 900, fontSize: 18 }}>{event.title}</div>
                {event.subtitle && <div style={{ marginTop: 6 }}>{event.subtitle}</div>}
                {(event.date_text || event.time_text) && (
                  <div style={{ marginTop: 10, opacity: 0.9 }}>
                    {event.date_text && (
                      <div>
                        Ημερομηνία: <b>{event.date_text}</b>
                      </div>
                    )}
                    {event.time_text && (
                      <div>
                        Ώρα: <b>{event.time_text}</b>
                      </div>
                    )}
                  </div>
                )}
                {event.extra_note && <div style={{ marginTop: 10, opacity: 0.9 }}>{event.extra_note}</div>}
              </div>
            )}

            {active === "rsvp" && (
              <div>
                {event.rsvp_deadline && (
                  <div style={{ marginBottom: 10, fontWeight: 700 }}>
                    Παρακαλούμε απαντήστε έως:{" "}
                    <span style={{ textDecoration: "underline" }}>{event.rsvp_deadline}</span>
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
                    marginTop: 10,
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: "#111",
                    color: "white",
                    fontWeight: 900,
                    opacity: 0.92,
                  }}
                >
                  Προσθήκη στο iPhone / Apple Calendar
                </a>

                <div style={{ height: 14 }} />
                <RSVPForm slug={slug} />
              </div>
            )}

            {active === "church" && (
              <div style={{ lineHeight: 1.6 }}>
                <div style={{ fontWeight: 900 }}>{event.church_name || "-"}</div>
                {event.church_address && <div style={{ marginTop: 6, opacity: 0.9 }}>{event.church_address}</div>}
                {event.church_map_url && (
                  <a
                    href={event.church_map_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: "inline-block", marginTop: 10, color: "#111", fontWeight: 900 }}
                  >
                    Άνοιγμα χάρτη →
                  </a>
                )}
              </div>
            )}

            {active === "venue" && (
              <div style={{ lineHeight: 1.6 }}>
                <div style={{ fontWeight: 900 }}>{event.venue_name || "-"}</div>
                {event.venue_address && <div style={{ marginTop: 6, opacity: 0.9 }}>{event.venue_address}</div>}
                {event.venue_map_url && (
                  <a
                    href={event.venue_map_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: "inline-block", marginTop: 10, color: "#111", fontWeight: 900 }}
                  >
                    Άνοιγμα χάρτη →
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