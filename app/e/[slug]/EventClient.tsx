"use client";
<div style={{position:"fixed",top:10,left:10,zIndex:99999,background:"black",color:"white",padding:"6px 10px",borderRadius:8,fontSize:12}}>
  NEW VERSION ✅
</div>

import { useEffect, useMemo, useState } from "react";
import Countdown from "./Countdown";

type EventFull = {
  slug: string;
  template: "elegant" | "playful";
  title: string;
  subtitle?: string | null;

  inviter_names?: string | null; // αν το βάλουμε αργότερα στη βάση
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
  const isElegant = event.template === "elegant";

  const inviter = useMemo(() => {
    return (event.inviter_names || event.subtitle || event.title || "").trim();
  }, [event.inviter_names, event.subtitle, event.title]);

  const [showIntro, setShowIntro] = useState(true);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ✅ INTRO SCREEN
  if (showIntro) {
    return (
      <div
        style={{
          minHeight: "100vh",
          padding: 24,
          display: "grid",
          placeItems: "center",
          background: "radial-gradient(circle at 30% 10%, #f4f5f8 0%, #eef1f6 50%, #e6eaf0 100%)",
        }}
      >
        <div
          className="e-card"
          style={{
            width: "min(92vw, 620px)",
            textAlign: "center",
            padding: 26,
          }}
        >
          <div style={{ opacity: 0.75, letterSpacing: 0.6, fontSize: 13 }}>
            LAB LOU INVITATIONS
          </div>

          <h1 className="elegant-title" style={{ margin: "14px 0 10px" }}>
            Έχεις πρόσκληση από
          </h1>

          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
            « {inviter || "—"} »
          </div>

          {event.start_iso && (
            <div style={{ marginTop: 14 }}>
              <div style={{ opacity: 0.75, marginBottom: 10 }}>
                Μέχρι να ξεκινήσει:
              </div>
              <div className="e-card" style={{ padding: 12 }}>
                <Countdown startISO={event.start_iso} />
              </div>
            </div>
          )}

          <button
            className="e-btn"
            onClick={enterInvite}
            style={{ marginTop: 18, width: "100%" }}
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

  // ✅ MAIN (προσωρινά απλό, για να φύγει το error)
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        background: "radial-gradient(circle at 30% 10%, #f4f5f8 0%, #eef1f6 50%, #e6eaf0 100%)",
      }}
    >
      <div className="e-wrap">
        <div className="e-card" style={{ padding: 20, textAlign: "center" }}>
          <h1 className="elegant-title" style={{ margin: 0 }}>
            {event.title}
          </h1>

          {event.subtitle && (
            <p className="elegant-text" style={{ marginTop: 10, opacity: 0.85 }}>
              {event.subtitle}
            </p>
          )}

          <div style={{ height: 12 }} />

          <a
            className="e-btn"
            href={gcalUrl}
            target="_blank"
            rel="noreferrer"
            style={{ display: "inline-block", textDecoration: "none" }}
          >
            Προσθήκη στο Google Calendar
          </a>

          <div style={{ marginTop: 14, opacity: 0.65, fontSize: 13 }}>
            Επόμενο βήμα: βάζουμε το “4 φωτογραφίες σαν inviart” εδώ, χωρίς να εμφανίζεται τίποτα κάτω,
            και να ανοίγει ενότητα μόνο όταν πατάς φωτογραφία.
          </div>
        </div>
      </div>
    </div>
  );
}