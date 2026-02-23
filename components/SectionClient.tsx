"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

type EventFull = {
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
  backgroundUrl = "/intro/background.jpg",
}: {
  event: EventFull;
  slug: string;
  t: string;
  backgroundUrl?: string;
}) {
  const router = useRouter();

  const venueTitle = (event.venue_name || "Κέντρο").trim();
  const churchTitle = (event.church_name || "Εκκλησία").trim();

  const venueMapUrl =
    (event.venue_map_url || "").trim() ||
    (event.venue_address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          event.venue_address
        )}`
      : "");

  const churchMapUrl =
    (event.church_map_url || "").trim() ||
    (event.church_address
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          event.church_address
        )}`
      : "");

  const openMap = (url: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // ✅ ΣΙΓΟΥΡΟ “πίσω” (όχι router.back που μπορεί να σε πετάξει 404)
  const goBackSafe = () => {
    router.push(`/e/${encodeURIComponent(slug)}?t=${encodeURIComponent(t)}`);
  };

  const goRSVP = () => {
    const url = `/e/${encodeURIComponent(slug)}/rsvp?t=${encodeURIComponent(t)}`;
    window.location.assign(url);
  };

  return (
    <div style={page(backgroundUrl)}>
      <div style={fog} />

      <div style={shell}>
        {/* SCALE: μεγαλώνει όλο το layout */}
        <div style={scaleWrap}>
          <div style={layout}>
            {/* ΑΡΙΣΤΕΡΑ – ΠΡΟΣΚΛΗΤΗΡΙΟ + ΦΑΚΕΛΟΣ ΠΙΣΩ */}
            <div style={leftCol}>
              <div style={inviteWrapper}>
                <Image
                  src="/section/invite.png"
                  alt="Προσκλητήριο"
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* ΦΑΚΕΛΟΣ: ένα επίπεδο πίσω + να φαίνεται ~1/4 */}
              <div style={envelopeWrapper} aria-hidden="true">
                <div style={envelopeShadow}>
                  <Image
                    src="/envelope/envelope-open.png"
                    alt="Envelope"
                    fill
                    priority
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            </div>

            {/* ΜΕΣΗ – 2 μικρές κάρτες */}
            <div style={midCol}>
              {/* Εκκλησία -> MAPS */}
              <button
                type="button"
                className="liftBtn liftSmall"
                style={smallCard}
                onClick={() => openMap(churchMapUrl)}
                title={churchMapUrl ? "Άνοιγμα χάρτη" : "Δεν υπάρχει link"}
              >
                <div style={imgShadow}>
                  <Image
                    src="/section/card-church.png"
                    alt="Εκκλησία"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </button>
              <div style={miniLabel}>{churchTitle}</div>

              {/* RSVP -> φόρμα */}
              <button
                type="button"
                className="liftBtn liftSmall"
                style={smallCard}
                onClick={goRSVP}
                title="RSVP"
              >
                <div style={imgShadow}>
                  <Image
                    src="/section/card-rsvp.png"
                    alt="RSVP"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </button>
              <div style={miniLabel}>RSVP</div>
            </div>

            {/* ΔΕΞΙΑ – μεγάλη κάρτα Κέντρο -> MAPS */}
            <div style={rightCol}>
              <button
                type="button"
                className="liftBtn liftLarge"
                style={largeCard}
                onClick={() => openMap(venueMapUrl)}
                title={venueMapUrl ? "Άνοιγμα χάρτη" : "Δεν υπάρχει link"}
              >
                <div style={imgShadow}>
                  <Image
                    src="/section/card-venue.png"
                    alt="Κέντρο"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </button>
              <div style={bigLabel}>{venueTitle}</div>
            </div>
          </div>

          <button className="pressBtn" style={backBtn} onClick={goBackSafe}>
            Πίσω
          </button>
        </div>
      </div>

      {/* ✅ animations για ΟΛΑ τα clickable κουμπιά */}
      <style>{`
        .liftBtn{
          transition: transform .22s ease, box-shadow .22s ease, filter .22s ease;
          will-change: transform;
        }
        .liftBtn:hover{
          transform: translateY(-8px) scale(1.02);
        }
        .liftBtn:active{
          transform: translateY(-4px) scale(1.01);
        }

        /* μικρές κάρτες: πιο “γλυκιά” σκιά */
        .liftSmall:hover{ box-shadow: 0 35px 90px rgba(0,0,0,0.28) !important; }
        .liftSmall:active{ box-shadow: 0 22px 60px rgba(0,0,0,0.22) !important; }

        /* μεγάλη κάρτα: πιο “βαριά” σκιά */
        .liftLarge:hover{ box-shadow: 0 45px 110px rgba(0,0,0,0.30) !important; }
        .liftLarge:active{ box-shadow: 0 30px 90px rgba(0,0,0,0.24) !important; }

        /* Πίσω κουμπί: μικρό lift */
        .pressBtn{
          transition: transform .18s ease, box-shadow .18s ease;
          will-change: transform;
        }
        .pressBtn:hover{
          transform: translateY(-50%) translateY(-3px);
          box-shadow: 0 14px 40px rgba(0,0,0,0.14);
        }
        .pressBtn:active{
          transform: translateY(-50%) translateY(-1px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.10);
        }
      `}</style>
    </div>
  );
}

/* ---------------- CONFIG ---------------- */

const SCALE = 1.5;

/* ---------------- STYLES ---------------- */

function page(bgUrl: string): React.CSSProperties {
  return {
    minHeight: "100vh",
    backgroundImage: `url(${bgUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: "120px",
    overflow: "hidden",
  };
}

const fog: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "rgba(255,255,255,0.55)",
  zIndex: 0,
};

const shell: React.CSSProperties = {
  width: "min(1200px, 96vw)",
  position: "relative",
  zIndex: 1,
};

const scaleWrap: React.CSSProperties = {
  transform: `scale(${SCALE})`,
  transformOrigin: "top center",
  width: `${100 / SCALE}%`,
  margin: "0 auto",
  marginLeft: "260px", // 👈 μετακινεί ΟΛΟ το layout δεξιά
};

const layout: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto auto auto",
  gap: 40,
  alignItems: "center",
  marginLeft: "100px",
};

/* ΑΡΙΣΤΕΡΑ */
const leftCol: React.CSSProperties = {
  position: "relative",
  width: 260,
  height: 380,
};

const inviteWrapper: React.CSSProperties = {
  position: "relative",
  width: "260px",
  height: "380px",
  borderRadius: 20,
  overflow: "hidden",
  zIndex: 2,
  transform: "translateX(-30px)", // 👈 ΜΟΝΟ αυτό κουνάει το προσκλητήριο
  boxShadow: "0 22px 70px rgba(0,0,0,0.22)",
};

const envelopeWrapper: React.CSSProperties = {
  position: "absolute",
  left: "40%",
  transform: "translateX(-50%)",
  top: "5px", // 👈 ρυθμίζεις πόσο φαίνεται
  width: "850px",
  height: "460px",
  pointerEvents: "none",
  zIndex: 1,
  opacity: 0.95,
};

const envelopeShadow: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  filter: "drop-shadow(0 28px 58px rgba(0,0,0,0.28))",
};

/* ΜΕΣΗ */
const midCol: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 14,
  alignItems: "center",
};

const smallCard: React.CSSProperties = {
  position: "relative",
  width: "130px",
  height: "80px",
  borderRadius: 16,
  overflow: "hidden",
  border: "none",
  cursor: "pointer",
  padding: 0,
  background: "transparent",
  boxShadow: "0 18px 55px rgba(0,0,0,0.16)",
};

const imgShadow: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  filter: "drop-shadow(0 18px 40px rgba(0,0,0,0.22))",
};

const miniLabel: React.CSSProperties = {
  marginTop: 6,
  fontSize: 13,
  fontWeight: 800,
  opacity: 0.75,
  color: "#111",
};

/* ΔΕΞΙΑ */
const rightCol: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const largeCard: React.CSSProperties = {
  position: "relative",
  width: "220px",
  height: "320px",
  borderRadius: 20,
  overflow: "hidden",
  border: "none",
  cursor: "pointer",
  padding: 0,
  background: "transparent",
  boxShadow: "0 26px 80px rgba(0,0,0,0.18)",
};

const bigLabel: React.CSSProperties = {
  marginTop: 10,
  fontSize: 15,
  fontWeight: 900,
  opacity: 0.8,
  color: "#111",
};

const backBtn: React.CSSProperties = {
  position: "absolute",
  left: "-150px",
  top: "50%",
  transform: "translateY(-50%)",
  padding: "12px 28px",
  borderRadius: 20,
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(6px)",
  color: "#6e5a63",
  fontWeight: 600,
  fontSize: "15px",
  letterSpacing: "0.5px",
  border: "1px solid rgba(110,90,99,0.25)",
  cursor: "pointer",
  zIndex: 10,
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};