"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Countdown from "./Countdown";

type CardKey = "invite" | "rsvp" | "church" | "venue";

export type EventFull = {
  template?: "elegant" | "playful";
  title: string;
  subtitle?: string | null;

  inviter_names?: string | null;

  start_iso?: string | null;
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

/** Γράμματα ένα-ένα */
function Typewriter({ text, speed = 26 }: { text: string; speed?: number }) {
  const [out, setOut] = useState("");

  useEffect(() => {
    setOut("");
    let i = 0;
    const id = window.setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, speed);

    return () => window.clearInterval(id);
  }, [text, speed]);

  return <span>{out}</span>;
}

/* -----------------------------
   Collage (click -> navigate)
------------------------------ */
function CollageNav({ slug, t }: { slug: string; t: string }) {
  const router = useRouter();

  // (Αν αλλάζεις εικόνες και δεν τις “πιάνει”, αυτό το ?v=... σπάει το cache)
  const v = encodeURIComponent(t || "1");

  const cards: { key: CardKey; label: string; src: string }[] = [
    { key: "invite", label: "Προσκλητήριο", src: `/invites/1.png?v=${v}` },
    { key: "rsvp", label: "RSVP", src: `/invites/2.png?v=${v}` },
    { key: "church", label: "Εκκλησία", src: `/invites/3.png?v=${v}` },
    { key: "venue", label: "Κέντρο", src: `/invites/4.png?v=${v}` },
  ];

  // ✅ Κρατάμε το overlap που σου αρέσει
  const W = 320;
  const H = 390;
  const OVERLAP_Y = 430;
  const STEP_X = 34;
  const ROT = 6;
  const RADIUS = 18;

  function go(key: CardKey) {
    // Σελίδα ενότητας (έχεις ήδη route /e/[slug]/section)
    router.push(
      `/e/${encodeURIComponent(slug)}/section?s=${encodeURIComponent(key)}&t=${encodeURIComponent(t)}`
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "min(92vw, 420px)",
        height: H + OVERLAP_Y * (cards.length - 1),
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
            onClick={() => go(c.key)}
            style={{
              position: "absolute",
              left: "50%",
              top: y,
              transform: `translateX(-50%) translateX(${x}px) rotate(${r}deg)`,
              width: W,
              height: H,
              maxWidth: "92vw",
              borderRadius: RADIUS,
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 14px 34px rgba(0,0,0,0.14)",
              background: `url(${c.src}) center/cover no-repeat`,
              cursor: "pointer",
              padding: 0,
              outline: "none",
              overflow: "hidden",
              // τελευταίο πάνω-πάνω
              zIndex: 100 - i,
              pointerEvents: "auto",
            }}
            aria-label={c.label}
            title={c.label}
          >
            <div
              style={{
                position: "absolute",
                left: 12,
                top: 12,
                background: "rgba(255,255,255,0.86)",
                backdropFilter: "blur(8px)",
                padding: "8px 10px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 900,
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
  t,
}: {
  event: EventFull;
  slug: string;
  t: string;
}) {
  // εικόνες μέσα στο /public/intro/
  const pageBg = "/intro/background.jpg";
  const envelopeImg = "/intro/envelope.png";

  const inviter = useMemo(() => (event.inviter_names || "").trim(), [event.inviter_names]);

  const [showIntro, setShowIntro] = useState(true);

  // Text shadows για να διαβάζεται πάνω σε φόντο
  const textShadowStrong = "0 3px 14px rgba(0,0,0,0.55)";
  const textShadowSoft = "0 2px 10px rgba(0,0,0,0.45)";

  // πόσο “αχνό” το background στην MAIN
  const MAIN_FADE = 0.58;

  useEffect(() => {
    // Αν το έχει ξαναδεί, να πηγαίνει κατευθείαν στο main
    try {
      const seen = localStorage.getItem(storageKey(slug, t));
      if (seen === "1") setShowIntro(false);
    } catch {
      // ignore
    }
  }, [slug, t]);

  function openInvite() {
    try {
      localStorage.setItem(storageKey(slug, t), "1");
    } catch {
      // ignore
    }
    setShowIntro(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* =========================
     INTRO
  ========================= */
  if (showIntro) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: 24,
          backgroundImage: `url(${pageBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* ελαφρύ σκοτείνιασμα για να “κάτσει” το intro */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.22)",
          }}
        />

        <div style={{ position: "relative", width: "min(92vw, 720px)", textAlign: "center" }}>
          <div
            style={{
              fontSize: 13,
              letterSpacing: 1,
              marginBottom: 18,
              fontWeight: 800,
              color: "white",
              textShadow: textShadowSoft,
              opacity: 0.95,
            }}
          >
            LAB LOU INVITATIONS
          </div>

          <div style={{ color: "white", textShadow: textShadowStrong }}>
            <div style={{ fontSize: 30, fontWeight: 900, marginTop: 6 }}>
              <Typewriter text={event.title || "—"} speed={18} />
            </div>

            {event.subtitle ? (
              <div style={{ marginTop: 8, opacity: 0.95, fontSize: 16 }}>
                <Typewriter text={event.subtitle} speed={20} />
              </div>
            ) : null}

            <div style={{ height: 18 }} />

            <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>
              <Typewriter text="Έχεις πρόσκληση από" />
            </div>

            <div style={{ fontSize: 20, fontWeight: 900 }}>
              <Typewriter text={`« ${inviter || "—"} »`} speed={24} />
            </div>
          </div>

          {event.start_iso ? (
            <div style={{ marginTop: 18 }}>
<Countdown startISO={event.start_iso!} />
            </div>
          ) : null}

          <div style={{ height: 18 }} />

          <img
            src={envelopeImg}
            alt="Envelope"
            style={{
              width: "min(92vw, 680px)", // ✅ μεγάλος φάκελος
              maxWidth: "100%",
              height: "auto",
              filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.35))",
              transformOrigin: "50% 70%",
              animation: "envelopeFloat 2.2s ease-in-out infinite",
              borderRadius: 14,
              userSelect: "none",
            }}
            draggable={false}
          />

          <div style={{ height: 18 }} />

          <button
            type="button"
            onClick={openInvite}
            style={{
              padding: "14px 18px",
              borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.25)",
              background: "rgba(255,255,255,0.14)",
              color: "white",
              fontWeight: 900,
              cursor: "pointer",
              boxShadow: "0 16px 44px rgba(0,0,0,0.25)",
              backdropFilter: "blur(8px)",
            }}
          >
            Άνοιγμα προσκλητηρίου
          </button>

          <div style={{ marginTop: 12, fontSize: 13, opacity: 0.95, color: "white", textShadow: textShadowSoft }}>
            (Την επόμενη φορά θα ανοίγει κατευθείαν.)
          </div>

          <style jsx>{`
            @keyframes envelopeFloat {
              0% {
                transform: translateY(0px) rotate(0deg);
              }
              50% {
                transform: translateY(-6px) rotate(-0.6deg);
              }
              100% {
                transform: translateY(0px) rotate(0deg);
              }
            }
          `}</style>
        </div>
      </div>
    );
  }

  /* =========================
     MAIN (cards + navigation)
  ========================= */
  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    padding: 24,
    backgroundImage: `url(${pageBg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
  };

  return (
    <div style={pageStyle}>
      {/* “πέπλο” για να γίνει πιο αχνό */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(255,255,255,${MAIN_FADE})`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 980, margin: "0 auto" }}>
        <div style={{ textAlign: "center", color: "white", textShadow: textShadowStrong }}>
          <div
            style={{
              fontSize: 13,
              letterSpacing: 1,
              marginTop: 6,
              fontWeight: 800,
              opacity: 0.95,
            }}
          >
            LAB LOU INVITATIONS
          </div>

          <div style={{ fontSize: 30, fontWeight: 900, marginTop: 10 }}>{event.title}</div>
          {event.subtitle ? <div style={{ marginTop: 8, opacity: 0.95, fontSize: 16 }}>{event.subtitle}</div> : null}
        </div>

        {event.start_iso ? (
          <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
<Countdown startISO={event.start_iso!} />
          </div>
        ) : null}

        <CollageNav slug={slug} t={t} />

        <div
          style={{
            textAlign: "center",
            marginTop: 10,
            color: "white",
            opacity: 0.95,
            fontSize: 13,
            textShadow: textShadowSoft,
          }}
        >
          Πάτα σε μία κάρτα για να ανοίξει η αντίστοιχη ενότητα.
        </div>
      </div>
    </div>
  );
}