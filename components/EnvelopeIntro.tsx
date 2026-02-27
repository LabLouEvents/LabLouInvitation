"use client";

import CalendarButtons from "@/components/CalendarButtons";
import Image from "next/image";
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import TypewriterText from "@/components/TypewriterText";

const brandFont = Inter({
  subsets: ["latin", "greek"],
  weight: ["300", "400", "500", "600"],
});

function clampText(s: string, max = 50) {
  const t = (s || "").trim();
  if (!t) return "";
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

export default function EnvelopeIntro({
  slug,
  t,
  inviter,
  fromName,
  backgroundUrl = "/intro/background.jpg",
}: {
  slug: string;
  t: string;
  inviter?: string;
  fromName?: string;
  backgroundUrl?: string;
}) {
  const router = useRouter();

  // =========================
  // ΡΥΘΜΙΣΕΙΣ ΘΕΣΗΣ (μόνο αυτά πείραζε)
  // =========================
  const LOGO_Y = -60; // logo μόνο του
  const EVENTS_Y = -70; // "Lab Lou Events" ΜΟΝΟ του (ξεχωριστά)
  const CONTENT_Y = 20; // φάκελος + "Έχεις πρόσκληση από" + όνομα + κουμπί (όλα μαζί)
  // =========================

  const safeFrom = useMemo(
    () => clampText((inviter || fromName || "").trim(), 40),
    [inviter, fromName]
  );

  const openInvite = () => {
    // ΠΗΓΑΙΝΕΙ ΣΤΗΝ ΑΛΛΗ ΣΕΛΙΔΑ
    // Αν η σελίδα σου είναι αλλού, άλλαξε μόνο το "/section" (δες σημείωση στο τέλος)
    const url = `/e/${encodeURIComponent(slug)}/section?t=${encodeURIComponent(t)}`;
    router.push(url);
  };

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${backgroundUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    overflow: "hidden",
    fontFamily: "system-ui",
  };

  const glass: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.08), transparent 55%)",
    pointerEvents: "none",
  };

  const shell: React.CSSProperties = {
    width: "min(560px, 92vw)",
    textAlign: "center",
    position: "relative",
  };

  // ---------- LOGO GROUP (μόνο logo) ----------
  const logoGroup: React.CSSProperties = {
    marginTop: LOGO_Y,
    position: "relative",
    zIndex: 5,
  };

  const logoWrap: React.CSSProperties = {
    position: "relative",
    display: "inline-block",
  };

  const halo: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: "72%",
    height: "72%",
    transform: "translate(-50%, -50%)",
    background:
      "radial-gradient(circle, rgba(0,0,0,0.16) 0%, rgba(0,0,0,0.08) 38%, transparent 72%)",
    filter: "blur(10px)",
    opacity: 0.55,
    pointerEvents: "none",
    zIndex: 0,
  };

  const logoStyle: React.CSSProperties = {
    width: "min(230px, 52vw)",
    height: "auto",
    objectFit: "contain",
    position: "relative",
    zIndex: 1,
    filter: "drop-shadow(0 10px 22px rgba(0,0,0,0.22))",
  };

  // ---------- EVENTS TITLE (μόνο Lab Lou Events) ----------
  const eventsStyle: React.CSSProperties = {
    marginTop: EVENTS_Y,
    fontSize: "clamp(22px, 4vw, 40px)",
    fontWeight: 400,
    letterSpacing: "0.06em",
    color: "white",
    textShadow: "0 6px 20px rgba(0,0,0,0.45)",
    opacity: 0.9,
    lineHeight: 1.05,
    position: "relative",
    zIndex: 5,
  };

  // ---------- CONTENT GROUP (φάκελος + κείμενα + κουμπί μαζί) ----------
  const contentGroup: React.CSSProperties = {
    marginTop: CONTENT_Y,
    position: "relative",
    zIndex: 4,
  };

  const envelopeBox: React.CSSProperties = {
    position: "relative",
    width: "min(520px, 86vw)",
    height: "min(360px, 62vw)",
    margin: "0 auto",
    filter: "drop-shadow(0 18px 34px rgba(0,0,0,0.20))",
  };

  const inviteLine: React.CSSProperties = {
    marginTop: 18,
    fontSize: "clamp(14px, 2.2vw, 18px)",
    color: "rgba(255,255,255,0.85)",
    textShadow: "0 4px 14px rgba(0,0,0,0.35)",
    letterSpacing: "0.04em",
  };

  const fromLine: React.CSSProperties = {
    marginTop: 6,
    fontSize: "clamp(16px, 2.8vw, 22px)",
    color: "rgba(255,255,255,0.95)",
    textShadow: "0 6px 18px rgba(0,0,0,0.4)",
    letterSpacing: "0.05em",
    minHeight: 28, // για να μη “πηδάει” το layout όσο γράφει
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: 18,
    padding: "14px 22px",
    borderRadius: 999,
    color: "rgba(20,20,20,0.95)",
background: "rgba(255,255,255,0.55)",
border: "1px solid rgba(255,255,255,0.75)",
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: "0.02em",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
  };

  const calendarBtn: React.CSSProperties = {
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    color: "white",
    padding: "8px 14px",
    borderRadius: 999,
    fontSize: 13,
    textDecoration: "none",
    fontWeight: 600,
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  };

  const calendarWrap: React.CSSProperties = {
    position: "absolute",
    top: 18,
    right: 18,
    display: "flex",
    gap: 10,
    zIndex: 999,
  };

  return (
    <div style={pageStyle}>
      <div style={glass} />
      <CalendarButtons slug={slug} t={t} />
      <div style={calendarWrap}>
        <a
          href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
            "Πρόσκληση"
          )}&details=${encodeURIComponent(
            `https://lablouinvitations.gr/e/${slug}?t=${t}`
          )}`}
          target="_blank"
          rel="noreferrer"
          style={calendarBtn}
        >
          Google
        </a>

        <a href={`/api/calendar/${slug}?t=${encodeURIComponent(t)}`} style={calendarBtn}>
          Apple
        </a>
      </div>

      <div style={shell}>
        {/* LOGO (μόνο του) */}
        <div style={logoGroup}>
          <div style={logoWrap}>
            <div style={halo} aria-hidden="true" />
            <Image
              src="/brand/logo.png"
              alt="Lab Lou"
              width={220}
              height={220}
              priority
              style={logoStyle}
            />
          </div>
        </div>

        {/* Lab Lou Events (ξεχωριστό από logo) */}
        <div className={brandFont.className} style={eventsStyle}>
          Lab Lou Events
        </div>

        {/* CONTENT GROUP (όλα μαζί) */}
        <div style={contentGroup}>
          <div style={envelopeBox}>
            <Image
              src="/envelope/envelope-closed.png"
              alt="Closed envelope"
              fill
              priority
              style={{ objectFit: "contain" }}
            />
          </div>

          <div className={brandFont.className} style={inviteLine}>
            Έχεις πρόσκληση από
          </div>

          <div className={brandFont.className} style={fromLine}>
            {safeFrom ? (
              <TypewriterText
                key={safeFrom} // σημαντικό: restart όταν αλλάξει όνομα
                text={safeFrom}
                active={true}
                speed={180}
              />
            ) : (
              "…"
            )}
          </div>

          <button type="button" style={buttonStyle} onClick={openInvite}>
            Άνοιγμα προσκλητηρίου
          </button>
        </div>
      </div>
    </div>
  );
}