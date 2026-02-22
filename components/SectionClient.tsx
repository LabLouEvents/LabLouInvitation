"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SectionClient({
  slug,
  t,
  venueName,
  churchName,
  venueMapUrl,
  churchMapUrl,
}: {
  slug: string;
  t: string;
  venueName: string;
  churchName: string;
  venueMapUrl: string;
  churchMapUrl: string;
}) {
  const router = useRouter();

  const openMap = (url: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={page}>
      <div style={wrap}>
        {/* Αριστερά: preview (ΟΧΙ clickable) */}
        <div style={left}>
          <div style={leftCard}>
            <Image
              src="/section/invite.png"
              alt="Προσκλητήριο"
              fill
              priority
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        {/* Δεξιά: 3 κάρτες */}
        <div style={right}>
          <div style={grid}>
            {/* RSVP */}
            <button
              type="button"
              style={cardBtn}
              onClick={() => router.push(`/e/${encodeURIComponent(slug)}/rsvp?t=${encodeURIComponent(t)}`)}
            >
              <div style={imgBox}>
                <Image
                  src="/section/card-rsvp.png"
                  alt="RSVP"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div style={label}>RSVP</div>
            </button>

            {/* Κέντρο */}
            <button
              type="button"
              style={cardBtn}
              onClick={() => openMap(venueMapUrl)}
            >
              <div style={imgBox}>
                <Image
                  src="/section/card-venue.png"
                  alt="Κέντρο"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div style={label}>{venueName}</div>
              {!venueMapUrl ? <div style={sub}>Δεν υπάρχει link χάρτη</div> : null}
            </button>

            {/* Εκκλησία */}
            <button
              type="button"
              style={cardBtn}
              onClick={() => openMap(churchMapUrl)}
            >
              <div style={imgBox}>
                <Image
                  src="/section/card-church.png"
                  alt="Εκκλησία"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div style={label}>{churchName}</div>
              {!churchMapUrl ? <div style={sub}>Δεν υπάρχει link χάρτη</div> : null}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  padding: 20,
  display: "grid",
  placeItems: "center",
  background: "#0b1220",
};

const wrap: React.CSSProperties = {
  width: "min(1100px, 96vw)",
  display: "grid",
  gridTemplateColumns: "1.2fr 0.8fr",
  gap: 18,
  alignItems: "center",
};

const left: React.CSSProperties = {
  display: "grid",
  placeItems: "center",
};

const leftCard: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "min(620px, 70vh)",
  borderRadius: 18,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  overflow: "hidden",
};

const right: React.CSSProperties = {
  display: "grid",
  placeItems: "center",
};

const grid: React.CSSProperties = {
  width: "100%",
  display: "grid",
  gap: 14,
};

const cardBtn: React.CSSProperties = {
  width: "100%",
  textAlign: "left",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  padding: 14,
  cursor: "pointer",
  color: "white",
  transition: "transform 120ms ease, background 200ms ease",
};

const imgBox: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: 160,
  borderRadius: 12,
  background: "rgba(0,0,0,0.18)",
  overflow: "hidden",
};

const label: React.CSSProperties = {
  marginTop: 10,
  fontWeight: 900,
  fontSize: 16,
};

const sub: React.CSSProperties = {
  marginTop: 4,
  fontSize: 12,
  opacity: 0.7,
};