"use client";

import React from "react";
import { useRouter } from "next/navigation";
import RSVPForm from "../../RSVPForm";

type EventFull = {
  title: string;
  subtitle?: string | null;

  inviter_names?: string | null;

  start_iso: string;
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

export default function SectionClient({
  event,
  slug,
  t,
  section,
}: {
  event: EventFull;
  slug: string;
  t: string;
  section: string; // "invite" | "rsvp" | "church" | "venue"
}) {
  const router = useRouter();

  const pageBg = "/intro/background.jpg";
  const FADE = 0.62;

  const title =
    section === "invite"
      ? "Προσκλητήριο"
      : section === "rsvp"
      ? "RSVP"
      : section === "church"
      ? "Εκκλησία"
      : section === "venue"
      ? "Κέντρο"
      : "Ενότητα";

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 18,
        backgroundImage: `url(${pageBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `rgba(255,255,255,${FADE})`,
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            type="button"
            onClick={() => router.push(`/e/${encodeURIComponent(slug)}?t=${encodeURIComponent(t || "")}`)}
            style={{
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.12)",
              background: "rgba(255,255,255,0.9)",
              cursor: "pointer",
              fontWeight: 900,
            }}
          >
            ← Πίσω
          </button>

          <div style={{ fontWeight: 900, fontSize: 18 }}>{title}</div>
        </div>

        <div style={{ height: 14 }} />

        <div
          style={{
            borderRadius: 18,
            padding: 18,
            background: "rgba(255,255,255,0.86)",
            boxShadow: "0 18px 60px rgba(0,0,0,0.16)",
            backdropFilter: "blur(8px)",
          }}
        >
          {section === "invite" && (
            <div style={{ lineHeight: 1.6 }}>
              <div style={{ fontWeight: 900, fontSize: 18 }}>{event.title}</div>
              {event.subtitle ? <div style={{ marginTop: 6 }}>{event.subtitle}</div> : null}

              {(event.date_text || event.time_text) && (
                <div style={{ marginTop: 10, opacity: 0.9 }}>
                  {event.date_text ? (
                    <div>
                      Ημερομηνία: <b>{event.date_text}</b>
                    </div>
                  ) : null}
                  {event.time_text ? (
                    <div>
                      Ώρα: <b>{event.time_text}</b>
                    </div>
                  ) : null}
                </div>
              )}

              {event.extra_note ? <div style={{ marginTop: 10, opacity: 0.9 }}>{event.extra_note}</div> : null}
            </div>
          )}

          {section === "rsvp" && (
            <div>
              {event.rsvp_deadline ? (
                <div style={{ marginBottom: 10, fontWeight: 800 }}>
                  Παρακαλούμε απαντήστε έως: <span style={{ textDecoration: "underline" }}>{event.rsvp_deadline}</span>
                </div>
              ) : null}

              <RSVPForm slug={slug} />
            </div>
          )}

          {section === "church" && (
            <div style={{ lineHeight: 1.6 }}>
              <div style={{ fontWeight: 900 }}>{event.church_name || "-"}</div>
              {event.church_address ? <div style={{ marginTop: 6, opacity: 0.9 }}>{event.church_address}</div> : null}
              {event.church_map_url ? (
                <a
                  href={event.church_map_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "inline-block", marginTop: 10, color: "#111", fontWeight: 900 }}
                >
                  Άνοιγμα χάρτη →
                </a>
              ) : null}
            </div>
          )}

          {section === "venue" && (
            <div style={{ lineHeight: 1.6 }}>
              <div style={{ fontWeight: 900 }}>{event.venue_name || "-"}</div>
              {event.venue_address ? <div style={{ marginTop: 6, opacity: 0.9 }}>{event.venue_address}</div> : null}
              {event.venue_map_url ? (
                <a
                  href={event.venue_map_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: "inline-block", marginTop: 10, color: "#111", fontWeight: 900 }}
                >
                  Άνοιγμα χάρτη →
                </a>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}