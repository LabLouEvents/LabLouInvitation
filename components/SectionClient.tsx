"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";

type EventFull = {
  title: string;
  subtitle?: string;

  // venue (κέντρο)
  venue_name?: string;
  venue_address?: string;
  venue_map_url?: string;

  // church (εκκλησία)
  church_name?: string;
  church_address?: string;
  church_map_url?: string;
};

export default function SectionClient({
  event,
  slug,
  t,
  backgroundUrl = "/intro/background.jpg",
}: {
  event: EventFull;
  slug: string;
  t: string;
  backgroundUrl?: string;
}) {
  const router = useRouter();

  const venueTitle = useMemo(() => event.venue_name || "Κέντρο", [event.venue_name]);
  const churchTitle = useMemo(() => event.church_name || "Εκκλησία", [event.church_name]);

  const venueMapUrl = event.venue_map_url || "";
  const churchMapUrl = event.church_map_url || "";

  const openMap = (url: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={page(backgroundUrl)}>
      {/* extra fog για να γίνει ΠΟΛΥ αχνό */}
      <div style={fog} />

      <div style={shell}>
        {/* μικρός ανοιχτός φάκελος πάνω */}
        <div style={topEnvelope}>
          <Image
            src="/envelope/envelope-open.png"
            alt="Envelope"
            width={160}
            height={120}
            style={{ objectFit: "contain", opacity: 0.9 }}
            priority
          />
        </div>

        <div style={layout}>
          {/* Αριστερά: Προσκλητήριο (ΜΗ clickable) */}
          <div style={leftCol}>
            <div style={bigCard}>
              <Image
                src="/section/invite.png"
                alt="Προσκλητήριο"
                fill
                priority
                style={{ objectFit: "contain" }}
              />
            </div>
            <div style={leftLabel}>Προσκλητήριο</div>
          </div>

          {/* Μέση: 2 μικρές κάρτες (Εκκλησία + RSVP) */}
          <div style={midCol}>
            {/* Εκκλησία (clickable maps) */}
            <button
              type="button"
              style={smallCardBtn}
              onClick={() => openMap(churchMapUrl)}
              title={churchMapUrl ? "Άνοιγμα χάρτη" : "Δεν υπάρχει link χάρτη"}
            >
              <div style={smallCardImg}>
                <Image
                  src="/section/card-church.png"
                  alt="Εκκλησία"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div style={cardTitle}>{churchTitle}</div>
              <div style={cardSub}>
                {event.church_address
                  ? event.church_address
                  : churchMapUrl
                    ? "Άνοιγμα χάρτη"
                    : "Δεν υπάρχει link χάρτη"}
              </div>
            </button>

            {/* RSVP (clickable σε φόρμα) */}
            <button
              type="button"
              style={smallCardBtn}
              onClick={() =>
                router.push(`/e/${encodeURIComponent(slug)}/rsvp?t=${encodeURIComponent(t)}`)
              }
              title="RSVP"
            >
              <div style={smallCardImg}>
                <Image
                  src="/section/card-rsvp.png"
                  alt="RSVP"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div style={cardTitle}>RSVP</div>
              <div style={cardSub}>Δήλωση παρουσίας</div>
            </button>
          </div>

          {/* Δεξιά: Μεγάλη κάρτα Κέντρο (clickable maps) */}
          <div style={rightCol}>
            <button
              type="button"
              style={largeCardBtn}
              onClick={() => openMap(venueMapUrl)}
              title={venueMapUrl ? "Άνοιγμα χάρτη" : "Δεν υπάρχει link χάρτη"}
            >
              <div style={largeCardImg}>
                <Image
                  src="/section/card-venue.png"
                  alt="Κέντρο"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>

              <div style={largeTitle}>{venueTitle}</div>
              <div style={largeSub}>
                {event.venue_address
                  ? event.venue_address
                  : venueMapUrl
                    ? "Άνοιγμα χάρτη"
                    : "Δεν υπάρχει link χάρτη"}
              </div>
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
    position: "relative",
    display: "grid",
    placeItems: "center",
    padding: 22,
    backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#efe7df",
    overflow: "hidden",
  };
}

const fog: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "rgba(255,255,255,0.70)", // ΠΟΛΥ πιο αχνό
  pointerEvents: "none",
};

const shell: React.CSSProperties = {
  width: "min(1200px, 96vw)",
  position: "relative",
  zIndex: 1,
};

const topEnvelope: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  marginBottom: 12,
  opacity: 0.85,
};

const layout: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.25fr 0.75fr 1fr",
  gap: 18,
  alignItems: "start",
};

const glass: React.CSSProperties = {
  borderRadius: 20,
  border: "1px solid rgba(0,0,0,0.10)",
  background: "rgba(255,255,255,0.45)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 18px 50px rgba(0,0,0,0.12)",
};

const leftCol: React.CSSProperties = {
  display: "grid",
  gap: 10,
};

const bigCard: React.CSSProperties = {
  ...glass,
  position: "relative",
  width: "100%",
  height: "min(540px, 70vh)",
  overflow: "hidden",
};

const leftLabel: React.CSSProperties = {
  fontWeight: 900,
  color: "#2a2a2a",
  opacity: 0.9,
  textAlign: "left",
  paddingLeft: 6,
};

const midCol: React.CSSProperties = {
  display: "grid",
  gap: 14,
};

const smallCardBtn: React.CSSProperties = {
  ...glass,
  width: "100%",
  padding: 14,
  cursor: "pointer",
  textAlign: "left",
};

const smallCardImg: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: 120,
  overflow: "hidden",
};

const cardTitle: React.CSSProperties = {
  marginTop: 10,
  fontWeight: 950,
  fontSize: 16,
  color: "#1a1a1a",
};

const cardSub: React.CSSProperties = {
  marginTop: 4,
  fontSize: 12,
  opacity: 0.75,
  color: "#1a1a1a",
};

const rightCol: React.CSSProperties = {
  display: "grid",
};

const largeCardBtn: React.CSSProperties = {
  ...glass,
  width: "100%",
  padding: 16,
  cursor: "pointer",
  textAlign: "left",
};

const largeCardImg: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: 260,
  overflow: "hidden",
};

const largeTitle: React.CSSProperties = {
  marginTop: 12,
  fontWeight: 1000,
  fontSize: 18,
  color: "#111",
};

const largeSub: React.CSSProperties = {
  marginTop: 6,
  fontSize: 13,
  opacity: 0.8,
  color: "#111",
};

const backBtn: React.CSSProperties = {
  width: "min(360px, 92vw)",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(255,255,255,0.55)",
  backdropFilter: "blur(8px)",
  fontWeight: 900,
  cursor: "pointer",
};