"use client";

import { useEffect, useMemo, useState } from "react";
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
   - Πιο ορθογώνιες (portrait)
   - Πιο “απόμακρες προς τα κάτω”
   - Ελάχιστα πιο τετραγωνισμένες
------------------------------ */
function CollageNav({ onSelect }: { onSelect: (k: CardKey) => void }) {
  const cards: { key: CardKey; label: string; src: string }[] = [
    { key: "invite", label: "Προσκλητήριο", src: "/invites/1.png" },
    { key: "rsvp", label: "RSVP", src: "/invites/2.png" },
    { key: "church", label: "Εκκλησία", src: "/invites/3.png" },
    { key: "venue", label: "Κέντρο", src: "/invites/4.png" },
  ];

  // ✅ ΡΥΘΜΙΣΕΙΣ (αυτά θες)
  const W = 320;          // πλάτος
  const H = 390;          // ύψος (portrait αλλά όχι υπερβολικά λεπτό)
  const OVERLAP_Y = 125;  // όσο μεγαλώνει, τόσο πιο “απόμακρες” προς τα κάτω
  const STEP_X = 34;      // εναλλάξ δεξιά/αριστερά
  const ROT = 6;          // κλίση
  const RADIUS = 18;

  return (
    <div
      style={{
        position: "relative",
        width: "min(92vw, 420px)",
        height: H + OVERLAP_Y * 3,
        margin: "0 auto",
        marginTop: 12,
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
            {/* label */}
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
                background: "rgba(255,255,255,0.72)",
                color: "#111",
                boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
                textShadow: "0 1px 0 rgba(255,255,255,0.55)", // ✅ σκίαση/ανάγλυφο στα γράμματα
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
  // ✅ ΒΑΖΕΙΣ ΕΔΩ ΤΙΣ ΦΩΤΟ ΣΟΥ (μέσα στο public/)
  const pageBg = "/intro/background.jpg";     // public/intro/background.jpg
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
     INTRO SCREEN
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
        {/* top small brand */}
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

        {/* Envelope (φυσικό σχήμα, όχι τετράγωνο) */}
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

        {/* Text κάτω από τον φάκελο (χωρίς γκρι πλαίσιο) */}
        <div style={{ textAlign: "center", color: "white", textShadow: textShadowStrong }}>
          <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>
            Έχεις πρόσκληση από
          </div>

          <div style={{ fontSize: 20, fontWeight: 900 }}>
            « {inviter || "—"} »
          </div>

          {/* Countdown μόνο γράμματα (χωρίς πλαίσιο / χωρίς “μέχρι να ξεκινήσει”) */}
          {event.start_iso && (
            <div style={{ marginTop: 18, fontSize: 20, fontWeight: 900 }}>
              <Countdown startISO={event.start_iso} />
            </div>
          )}

          {/* White button */}
          <button
            onClick={enterInvite}
            style={{
              marginTop: 22,
              padding: "14px 34px",
              borderRadius: 14,