"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";

type EventFull = {
  title: string;
  subtitle?: string;

  venue_name?: string;
  venue_address?: string;
  venue_map_url?: string;

  church_name?: string;
  church_address?: string;
  church_map_url?: string;
};

export default function SectionClient({
  event,
  slug,
  t,
  venueName,
  churchName,
  venueMapUrl,
  churchMapUrl,
  backgroundUrl = "/intro/background.jpg",
}: {
  event: EventFull;
  slug: string;
  t: string;
  venueName: string;
  churchName: string;
  venueMapUrl: string;
  churchMapUrl: string;
  backgroundUrl?: string;
}) {
  const router = useRouter();

  const venueTitle = useMemo(
    () => (event.venue_name || venueName || "Κέντρο").trim(),
    [event.venue_name, venueName]
  );
  const churchTitle = useMemo(
    () => (event.church_name || churchName || "Εκκλησία").trim(),
    [event.church_name, churchName]
  );

  const openMap = (url: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  /**
   * Μετατρέπουμε “cm” σε οθόνη με κλίμακα.
   * ΔΕΝ είναι πραγματικά cm στην οθόνη, είναι “σχετική κλίμακα”.
   * Αλλά κρατάμε τις αναλογίες σωστές.
   */
  const UNIT = "clamp(10px, 0.9vw, 16px)"; // 1 “μονάδα”
  // Invite 16x23 => 16u x 23u
  // Mid cards 8x5 => 8u x 5u
  // Right card 13x19 => 13u x 19u

  return (
    <div style={page(backgroundUrl)}>
      {/* Fog layer για να γίνει ΠΟΛΥ αχνό */}
      <div style={fog} />

      <div style={shell}>
        <div style={layout}>
          {/* LEFT: Προσκλητήριο (ΜΗ clickable) */}
          <div style={leftCol}>
            <div style={{ position: "relative" }}>
              {/* Φάκελος: μεγαλύτερος και λίγο πίσω/κάτω από το προσκλητήριο */}
              <div style={envelopeWrap}>
                <div style={envelopeBox}>
                  <Image
                    src="/envelope/envelope-open.png"
                    alt="Envelope"
                    fill
                    priority
                    style={{
                      objectFit: "contain",
                      filter: "drop-shadow(0 18px 34px rgba(0,0,0,0.20))",
                      opacity: 0.95,
                    }}
                  />
                </div>
              </div>

              {/* Προσκλητήριο */}
              <div
                style={{
                  ...glass,
                  ...inviteCard,
                  width: `calc(${UNIT} * 16)`,
                  aspectRatio: "16 / 23",
                }}
              >
                <Image
                  src="/section/invite.png"
                  alt="Προσκλητήριο"
                  fill
                  priority
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>

            <div style={leftLabel}>Προσκλητήριο</div>
          </div>

          {/* MID: 2 μικρές κάρτες (Εκκλησία + RSVP) */}
          <div style={midCol}>
            {/* Εκκλησία */}
            <button
              type="button"
              style={{
                ...glass,
                ...smallCardBtn,
                width: `calc(${UNIT} * 8)`,
                aspectRatio: "8 / 5",
              }}
              onClick={() => openMap(churchMapUrl)}
            >
              <div style={smallImg}>
                <Image
                  src="/section/card-church.png"
                  alt="Εκκλησία"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div style={cardTitle}>{churchTitle}</div>
            </button>

            {/* RSVP */}
            <button
              type="button"
              style={{
                ...glass,
                ...smallCardBtn,
                width: `calc(${UNIT} * 8)`,
                aspectRatio: "8 / 5",
              }}
              onClick={() =>
                router.push(`/e/${encodeURIComponent(slug)}/rsvp?t=${encodeURIComponent(t)}`)
              }
            >
              <div style={smallImg}>
                <Image
                  src="/section/card-rsvp.png"
                  alt="RSVP"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div style={cardTitle}>RSVP</div>
            </button>
          </div>

          {/* RIGHT: Μεγάλη κάρτα Κέντρο */}
          <div style={rightCol}>
            <button
              type="button"
              style={{
                ...glass,
                ...largeCardBtn,
                width: `calc(${UNIT} * 13)`,
                aspectRatio: "13 / 19",
              }}
              onClick={() => openMap(venueMapUrl)}
            >
              <div style={largeImg}>
                <Image
                  src="/section/card-venue.png"
                  alt="Κέντρο"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>

              <div style={largeTitle}>{venueTitle}</div>
            </button>
          </div>
        </div>

        <div style={{ height: 16 }} />

        <button
          type="button"
          onClick={() => router.back()}
          style={backBtn}
        >
          Πίσω
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

function page(bgUrl: string): React.CSSProperties {
  return {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 22,
    backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#efe7df",
    position: "relative",
    overflow: "hidden",
  };
}

const fog: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "rgba(255,255,255,0.78)", // πιο αχνό
  pointerEvents: "none",
};

const shell: React.CSSProperties = {
  width: "min(1200px, 96vw)",
  position: "relative",
  zIndex: 1,
};

const layout: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.25fr 0.85fr 1fr",
  gap: 22,
  alignItems: "start",
};

const glass: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(0,0,0,0.10)",
  background: "rgba(255,255,255,0.55)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 18px 50px rgba(0,0,0,0.12)",
};

const leftCol: React.CSSProperties = {
  display: "grid",
  gap: 10,
  alignContent: "start",
};

const inviteCard: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  borderRadius: 18,
  justifySelf: "start",
};

const envelopeWrap: React.CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "8%",
  transform: "translateX(-50%)",
  zIndex: 0,
  pointerEvents: "none",
};

const envelopeBox: React.CSSProperties = {
  position: "relative",
  width: "min(560px, 60vw)",
  height: "min(320px, 34vw)",
  transform: "translateY(85px)", // να “μπαίνει” λίγο κάτω από προσκλητήριο
  opacity: 0.95,
};

const leftLabel: React.CSSProperties = {
  fontWeight: 900,
  color: "#1a1a1a",
  opacity: 0.9,
  paddingLeft: 6,
};

const midCol: React.CSSProperties = {
  display: "grid",
  gap: 16,
  alignContent: "start",
};

const smallCardBtn: React.CSSProperties = {
  cursor: "pointer",
  textAlign: "left",
  padding: 14,
  color: "#111",
  position: "relative",
};

const smallImg: React.CSSProperties = {
  position: "absolute",
  inset: 12,
  borderRadius: 14,
  overflow: "hidden",
};

const cardTitle: React.CSSProperties = {
  position: "absolute",
  left: 14,
  bottom: 12,
  fontWeight: 950,
  fontSize: 14,
  color: "#111",
  textShadow: "0 2px 10px rgba(255,255,255,0.7)",
};

const rightCol: React.CSSProperties = {
  display: "grid",
  alignContent: "start",
};

const largeCardBtn: React.CSSProperties = {
  cursor: "pointer",
  textAlign: "left",
  padding: 16,
  color: "#111",
  position: "relative",
};

const largeImg: React.CSSProperties = {
  position: "absolute",
  inset: 12,
  borderRadius: 16,
  overflow: "hidden",
};

const largeTitle: React.CSSProperties = {
  position: "absolute",
  left: 16,
  bottom: 14,
  fontWeight: 1000,
  fontSize: 16,
  color: "#111",
  textShadow: "0 2px 10px rgba(255,255,255,0.7)",
};

const backBtn: React.CSSProperties = {
  width: "min(360px, 92vw)",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(255,255,255,0.75)",
  fontWeight: 900,
  cursor: "pointer",
};