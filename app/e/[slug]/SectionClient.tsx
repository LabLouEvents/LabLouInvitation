"use client";

import RSVPForm from "./RSVPForm";

type EventFull = {
  title: string;
  subtitle?: string | null;
  extra_note?: string | null;

  rsvp_deadline?: string | null;

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
  gcalUrl,
}: {
  event: EventFull;
  slug: string;
  t: string;
  section: string;
  gcalUrl: string;
}) {
  const pageBg = "/intro/background.jpg";
  const FADE = 0.45; // ίδιο “αχνό” όπως στην main

  const textShadow = "0 3px 14px rgba(0,0,0,0.55)";

  const title =
    section === "invite" ? "Προσκλητήριο" :
    section === "rsvp" ? "RSVP" :
    section === "church" ? "Εκκλησία" :
    section === "venue" ? "Κέντρο" : "Ενότητα";

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
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

      <div style={{ position: "relative", maxWidth: 820, margin: "0 auto" }}>
        <a
          href={`/e/${encodeURIComponent(slug)}?t=${encodeURIComponent(t)}`}
          style={{
            display: "inline-block",
            padding: "10px 14px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.9)",
            textDecoration: "none",
            color: "#111",
            fontWeight: 900,
            boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
          }}
        >
          ← Πίσω
        </a>

        <div style={{ height: 14 }} />

        <h1 style={{ margin: 0, color: "white", textShadow, fontSize: 34, fontWeight: 900 }}>
          {title}
        </h1>

        <div
          style={{
            marginTop: 14,
            borderRadius: 18,
            background: "rgba(255,255,255,0.92)",
            padding: 18,
            boxShadow: "0 18px 60px rgba(0,0,0,0.16)",
          }}
        >
          {section === "invite" && (
            <div style={{ lineHeight: 1.6 }}>
              <div style={{ fontWeight: 900, fontSize: 18 }}>{event.title}</div>
              {event.subtitle && <div style={{ marginTop: 6 }}>{event.subtitle}</div>}
              {(event.date_text || event.time_text) && (
                <div style={{ marginTop: 10, opacity: 0.9 }}>
                  {event.date_text && <div>Ημερομηνία: <b>{event.date_text}</b></div>}
                  {event.time_text && <div>Ώρα: <b>{event.time_text}</b></div>}
                </div>
              )}
              {event.extra_note && <div style={{ marginTop: 10, opacity: 0.9 }}>{event.extra_note}</div>}
            </div>
          )}

          {section === "rsvp" && (
            <div>
              {event.rsvp_deadline && (
                <div style={{ marginBottom: 10, fontWeight: 800 }}>
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

          {section === "church" && (
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

          {section === "venue" && (
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
      </div>
    </div>
  );
}