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

function safeBgUrl(url?: string | null) {
  if (!url) return "";
  // αν είναι ήδη absolute (https://...) ή ξεκινάει με /
  return url.startsWith("http") || url.startsWith("/") ? url : `/${url}`;
}

/* -----------------------------
   Collage (inviart-ish)
   - μικρότερα / πιο “τετραγωνισμένα”
   - εναλλάξ δεξιά/αριστερά
   - overlap (πέφτει πάνω στην προηγούμενη)
------------------------------ */
function CollageNav({ onSelect }: { onSelect: (k: CardKey) => void }) {
  const cards: { key: CardKey; label: string; src: string }[] = [
    { key: "invite", label: "Προσκλητήριο", src: "/invites/1.png" },
    { key: "rsvp", label: "RSVP", src: "/invites/2.png" },
    { key: "church", label: "Εκκλησία", src: "/invites/3.png" },
    { key: "venue", label: "Κέντρο", src: "/invites/4.png" },
  ];

  const W = 340;
  const H = 240;
  const OVERLAP_Y = 92; // μεγαλύτερο = πιο αραιά, μικρότερο = πιο πολύ overlap
  const STEP_X = 40;
  const ROT = 6;
  const RADIUS = 18;

  return (
    <div
      style={{
        position: "relative",
        width: "min(92vw, 460px)",
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
              border: "1px solid rgba(255,255,255,0.22)",
              background: `url(${c.src}) center/cover no-repeat`,
              boxShadow: "0 18px 50px rgba(0,0,0,0.25)",
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
                fontWeight: 800,
                letterSpacing: 0.2,
                backdropFilter: "blur(6px)",
                textShadow: "0 2px 10px rgba(0,0,0,0.45)",
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

  const pageBg = safeBgUrl(event.cover_image) || "/intro/bg.jpg"; // ΒΑΛΕ εδώ το δικό σου default φόντο
  const envelopeImg = "/intro/envelope.png"; // ΒΑΛΕ εδώ τον φάκελο σου

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    padding: 22,
    backgroundImage: `url(${pageBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const glassCard: React.CSSProperties = {
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.32)",
    background: "rgba(20,20,28,0.22)", // όχι μαύρο overlay στο background, μόνο “γυαλί” στο card
    boxShadow: "0 26px 90px rgba(0,0,0,0.22)",
    backdropFilter: "blur(10px)",
  };

  const textStyle: React.CSSProperties = {
    color: "rgba(255,255,255,0.98)",
    textShadow: "0 2px 10px rgba(0,0,0,0.55)",
  };

  /* =========================
     INTRO SCREEN
  ========================= */
  if (showIntro) {
    return (
      <div style={{ ...pageStyle, display: "grid", placeItems: "center" }}>
        <div
          style={{
            ...glassCard,
            width: "min(92vw, 640px)",
            padding: 26,
            textAlign: "center",
          }}
        >
          <div style={{ ...textStyle, opacity: 0.85, letterSpacing: 0.8, fontSize: 13 }}>
            LAB LOU INVITATIONS
          </div>

          {/* Envelope (χωρίς παραμόρφωση) */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              margin: "18px auto 10px",
              width: "min(78vw, 520px)",
              height: "min(52vh, 360px)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <img
              src={envelopeImg}
              alt="Envelope"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain", // ✅ δεν παραμορφώνει
                display: "block",
                filter: "drop-shadow(0 18px 28px rgba(0,0,0,0.18))",
              }}
            />
          </div>

          {/* Text wrapper πάνω από τον φάκελο */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <h1 style={{ ...textStyle, margin: "6px 0 10px", fontSize: 26, fontWeight: 900 }}>
              Έχεις πρόσκληση από
            </h1>

            <div style={{ ...textStyle, fontSize: 20, fontWeight: 900, marginBottom: 10 }}>
              « {inviter || "—"} »
            </div>

            {event.start_iso && (
              <div style={{ marginTop: 12 }}>
                <div style={{ ...textStyle, opacity: 0.9, marginBottom: 10 }}>
                  Μέχρι να ξεκινήσει:
                </div>

                <div
                  style={{
                    ...glassCard,
                    padding: 12,
                    borderRadius: 18,
                    background: "rgba(20,20,28,0.18)",
                    boxShadow: "0 18px 60px rgba(0,0,0,0.16)",
                  }}
                >
                  <Countdown startISO={event.start_iso} />
                </div>
              </div>
            )}

            <button
              onClick={enterInvite}
              style={{
                marginTop: 16,
                width: "100%",
                padding: "12px 14px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.34)",
                background: "rgba(255,255,255,0.20)",
                color: "white",
                fontWeight: 900,
                cursor: "pointer",
                textShadow: "0 2px 10px rgba(0,0,0,0.35)",
              }}
            >
              Άνοιγμα προσκλητηρίου
            </button>

            <div style={{ ...textStyle, marginTop: 12, opacity: 0.85, fontSize: 13 }}>
              (Την επόμενη φορά θα ανοίγει κατευθείαν.)
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN (Collage + ανοίγει ενότητα μόνο όταν πατάς)
  ========================= */
  return (
    <div style={pageStyle}>
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        {/* COUNTDOWN ΠΑΝΩ ΠΑΝΩ */}
        {event.start_iso && (
          <div
            style={{
              ...glassCard,
              padding: 12,
              borderRadius: 18,
              boxShadow: "0 18px 60px rgba(0,0,0,0.16)",
              ...textStyle,
            }}
          >
            <Countdown startISO={event.start_iso} />
          </div>
        )}

        {/* TITLE */}
        <div style={{ marginTop: 18, textAlign: "center" }}>
          <h1 style={{ ...textStyle, margin: 0, fontSize: 30, letterSpacing: 0.2, fontWeight: 900 }}>
            {event.title}
          </h1>

          {event.subtitle && (
            <p style={{ ...textStyle, marginTop: 10, opacity: 0.9 }}>
              {event.subtitle}
            </p>
          )}
        </div>

        {/* COLLAGE */}
        <div style={{ marginTop: 18 }}>
          <CollageNav onSelect={(k) => setActive(k)} />
          <div style={{ ...textStyle, textAlign: "center", marginTop: 10, opacity: 0.9, fontSize: 13 }}>
            Πάτα σε μία φωτογραφία για να ανοίξει η αντίστοιχη ενότητα.
          </div>
        </div>

        {/* PANEL που ανοίγει μόνο όταν πατάς */}
        {active && (
          <div
            style={{
              ...glassCard,
              marginTop: 18,
              padding: 18,
              color: "white",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <div style={{ ...textStyle, fontWeight: 900 }}>
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
                  border: "1px solid rgba(255,255,255,0.34)",
                  background: "rgba(255,255,255,0.18)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 800,
                  textShadow: "0 2px 10px rgba(0,0,0,0.35)",
                }}
              >
                Κλείσιμο
              </button>
            </div>

            <div style={{ height: 14 }} />

            {/* INVITE */}
            {active === "invite" && (
              <div style={{ ...textStyle, opacity: 0.95, lineHeight: 1.6 }}>
                <div style={{ fontWeight: 900, fontSize: 18 }}>{event.title}</div>
                {event.subtitle && <div style={{ marginTop: 6 }}>{event.subtitle}</div>}
                {event.extra_note && <div style={{ marginTop: 10, opacity: 0.92 }}>{event.extra_note}</div>}
              </div>
            )}

            {/* RSVP */}
            {active === "rsvp" && (
              <div style={textStyle}>
                {event.rsvp_deadline && (
                  <div style={{ marginBottom: 10, opacity: 0.95 }}>
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
                    border: "1px solid rgba(255,255,255,0.34)",
                    background: "rgba(255,255,255,0.18)",
                    color: "white",
                    fontWeight: 900,
                    textShadow: "0 2px 10px rgba(0,0,0,0.35)",
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
                    border: "1px solid rgba(255,255,255,0.34)",
                    background: "rgba(255,255,255,0.18)",
                    color: "white",
                    fontWeight: 900,
                    textShadow: "0 2px 10px rgba(0,0,0,0.35)",
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
              <div style={{ ...textStyle, opacity: 0.98, lineHeight: 1.6 }}>
                <div style={{ fontWeight: 900 }}>{event.church_name || "-"}</div>
                {event.church_address && <div style={{ opacity: 0.92, marginTop: 6 }}>{event.church_address}</div>}
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
              <div style={{ ...textStyle, opacity: 0.98, lineHeight: 1.6 }}>
                <div style={{ fontWeight: 900 }}>{event.venue_name || "-"}</div>
                {event.venue_address && <div style={{ opacity: 0.92, marginTop: 6 }}>{event.venue_address}</div>}
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