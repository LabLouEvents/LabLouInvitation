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

  cover_image?: string | null;

  church_name?: string | null;
  church_address?: string | null;
  church_map_url?: string | null;

  venue_name?: string | null;
  venue_address?: string | null;
  venue_map_url?: string | null;

  start_iso: string;
  end_iso?: string | null;

  rsvp_deadline?: string | null;
  extra_note?: string | null;
};

function storageKey(slug: string, t: string) {
  return `intro_seen:${slug}:${t}`;
}

/* -----------------------------
   Collage (inviart-ish)
------------------------------ */
function CollageNav({
  onSelect,
}: {
  onSelect: (k: CardKey) => void;
}) {
  const cards: { key: CardKey; label: string; src: string }[] = [
    { key: "invite", label: "Προσκλητήριο", src: "/invites/1.png" },
    { key: "rsvp", label: "RSVP", src: "/invites/2.png" },
    { key: "church", label: "Εκκλησία", src: "/invites/3.png" },
    { key: "venue", label: "Κέντρο", src: "/invites/4.png" },
  ];

  // πιο “τετραγωνισμένες”, πιο μικρές, και να πέφτουν ΠΑΝΩ στην προηγούμενη
  const W = 330;          // card width
  const H = 250;          // card height (πιο τετραγωνισμένο)
  const OVERLAP_Y = 92;   // πόσο “πατάει” η μία στην άλλη (μεγαλύτερο = λιγότερο overlap)
  const STEP_X = 38;      // εναλλάξ δεξιά/αριστερά
  const ROT = 6;          // κλίση
  const RADIUS = 18;

  return (
    <div
      style={{
        position: "relative",
        width: "min(92vw, 420px)",
        height: H + OVERLAP_Y * 3,
        margin: "0 auto",
        paddingTop: 6,
        paddingBottom: 6,
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
              border: "1px solid rgba(255,255,255,0.14)",
              background: `url(${c.src}) center/cover no-repeat`,
              boxShadow: "0 18px 46px rgba(0,0,0,0.28)",
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
                background: "rgba(0,0,0,0.45)",
                color: "white",
                padding: "8px 10px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 0.2,
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
  const isElegant = event.template === "elegant";

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

  /* =========================
     INTRO SCREEN
  ========================= */
  if (showIntro) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: 24,
          display: "grid",
          placeItems: "center",
          // όχι μπεζ / όχι “λευκό χαρτί”
          background:
            "radial-gradient(circle at 20% 10%, #0b1220 0%, #070a12 55%, #04050a 100%)",
        }}
      >
        <div
          style={{
            width: "min(92vw, 620px)",
            textAlign: "center",
            padding: 26,
            borderRadius: 22,
            border: "1px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.06)",
            boxShadow: "0 22px 70px rgba(0,0,0,0.55)",
            color: "white",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ opacity: 0.75, letterSpacing: 0.7, fontSize: 13 }}>
            LAB LOU INVITATIONS
          </div>

          <h1 style={{ margin: "14px 0 10px", fontSize: 26 }}>
            Έχεις πρόσκληση από
          </h1>

          <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>
            « {inviter || "—"} »
          </div>

          {event.start_iso && (
            <div style={{ marginTop: 14 }}>
              <div style={{ opacity: 0.75, marginBottom: 10 }}>
                Μέχρι να ξεκινήσει:
              </div>
              <div
                style={{
                  padding: 12,
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                <Countdown startISO={event.start_iso} />
              </div>
            </div>
          )}

          <button
            onClick={enterInvite}
            style={{
              marginTop: 18,
              width: "100%",
              padding: "12px 14px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.22)",
              background: "rgba(255,255,255,0.14)",
              color: "white",
              fontWeight: 800,
              cursor: "pointer",
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
     MAIN (Collage + ανοίγει ενότητα μόνο όταν πατάς)
  ========================= */
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 22,
        // ίδιο dark “premium” background
        background:
          "radial-gradient(circle at 20% 10%, #0b1220 0%, #070a12 55%, #04050a 100%)",
        color: "white",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        {/* COUNTDOWN ΠΑΝΩ ΠΑΝΩ */}
        {event.start_iso && (
          <div
            style={{
              borderRadius: 18,
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.06)",
              padding: 12,
              boxShadow: "0 18px 60px rgba(0,0,0,0.45)",
            }}
          >
            <Countdown startISO={event.start_iso} />
          </div>
        )}

        {/* TITLE */}
        <div style={{ marginTop: 18, textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: 30, letterSpacing: 0.2 }}>
            {event.title}
          </h1>

          {event.subtitle && (
            <p style={{ marginTop: 10, opacity: 0.85 }}>
              {event.subtitle}
            </p>
          )}
        </div>

        {/* COLLAGE */}
        <div style={{ marginTop: 18 }}>
          <CollageNav onSelect={(k) => setActive(k)} />
          <div style={{ textAlign: "center", marginTop: 10, opacity: 0.75, fontSize: 13 }}>
            Πάτα σε μία φωτογραφία για να ανοίξει η αντίστοιχη ενότητα.
          </div>
        </div>

        {/* MODAL / PANEL που ανοίγει μόνο όταν πατάς */}
        {active && (
          <div
            style={{
              marginTop: 18,
              borderRadius: 22,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.07)",
              boxShadow: "0 22px 70px rgba(0,0,0,0.55)",
              padding: 18,
              backdropFilter: "blur(10px)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <div style={{ fontWeight: 800 }}>
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
                  borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.10)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Κλείσιμο
              </button>
            </div>

            <div style={{ height: 14 }} />

            {/* INVITE */}
            {active === "invite" && (
              <div style={{ opacity: 0.92, lineHeight: 1.6 }}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>{event.title}</div>
                {event.subtitle && <div style={{ marginTop: 6 }}>{event.subtitle}</div>}
                {event.extra_note && <div style={{ marginTop: 10, opacity: 0.85 }}>{event.extra_note}</div>}
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
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(255,255,255,0.10)",
                    color: "white",
                    fontWeight: 800,
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
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(255,255,255,0.10)",
                    color: "white",
                    fontWeight: 800,
                  }}
                >
                  Προσθήκη στο iPhone / Apple Calendar
                </a>

                <div style={{ height: 14 }} />

                <RSVPForm slug={slug} />
              </div>
            )}

            {/* CHURCH */}
            {active === "church" && (
              <div style={{ opacity: 0.95, lineHeight: 1.6 }}>
                <div style={{ fontWeight: 800 }}>{event.church_name || "-"}</div>
                {event.church_address && <div style={{ opacity: 0.85, marginTop: 6 }}>{event.church_address}</div>}
                {event.church_map_url && (
                  <a
                    href={event.church_map_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "white", textDecoration: "underline", display: "inline-block", marginTop: 10 }}
                  >
                    Άνοιγμα χάρτη
                  </a>
                )}
              </div>
            )}

            {/* VENUE */}
            {active === "venue" && (
              <div style={{ opacity: 0.95, lineHeight: 1.6 }}>
                <div style={{ fontWeight: 800 }}>{event.venue_name || "-"}</div>
                {event.venue_address && <div style={{ opacity: 0.85, marginTop: 6 }}>{event.venue_address}</div>}
                {event.venue_map_url && (
                  <a
                    href={event.venue_map_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "white", textDecoration: "underline", display: "inline-block", marginTop: 10 }}
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