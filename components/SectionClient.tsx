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

  // εικόνες από Supabase (public URLs)
  invite_image_url?: string;
  rsvp_image_url?: string;
  church_card_image_url?: string;
  venue_card_image_url?: string;
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

  // ✅ Σταθεροί τίτλοι
  const venueTitle = "Κέντρο";
  const churchTitle = "Εκκλησία";
  const rsvpTitle = "RSVP";

  // ✅ Εικόνες (dynamic από admin/Supabase) + fallback στα local
  const inviteImg =
    (event.invite_image_url || "").trim() || "/section/invite.png";
  const churchImg =
    (event.church_card_image_url || "").trim() || "/section/card-church.png";
  const venueImg =
    (event.venue_card_image_url || "").trim() || "/section/card-venue.png";
  const rsvpImg = (event.rsvp_image_url || "").trim() || "/section/card-rsvp.png";

  // ✅ URLs (από admin ή fallback σε maps search με address)
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

  const goBackSafe = () => {
    router.push(`/e/${encodeURIComponent(slug)}?t=${encodeURIComponent(t)}`);
  };

  const goRSVP = () => {
    const url = `/e/${encodeURIComponent(slug)}/rsvp?t=${encodeURIComponent(t)}`;
    window.location.assign(url);
  };

  return (
    <div style={page(backgroundUrl)} className="page">
      <div style={fog} />

      <div style={shell} className="shell">
        <div style={scaleWrap} className="scaleWrap">
          <div style={layout} className="layoutGrid">
            {/* ΑΡΙΣΤΕΡΑ – ΠΡΟΣΚΛΗΤΗΡΙΟ + ΦΑΚΕΛΟΣ */}
            <div style={leftCol} className="leftCol">
              <div style={inviteWrapper} className="inviteWrapper">
                {/* ❌ ΜΗ clickable */}
                <Image
                  src={inviteImg}
                  alt="Προσκλητήριο"
                  fill
                  priority
                  quality={95}
                  sizes="(max-width: 768px) 92vw, 260px"
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* ΦΑΚΕΛΟΣ πίσω */}
              <div
                style={envelopeWrapper}
                className="envelopeWrapper"
                aria-hidden="true"
              >
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
            <div style={midCol} className="midCol">
              {/* Εκκλησία */}
              <div className="cardBlock">
                <button
                  type="button"
                  className="liftBtn liftSmall"
                  style={smallCard}
                  onClick={() => openMap(churchMapUrl)}
                  title={churchMapUrl ? "Άνοιγμα χάρτη" : "Δεν υπάρχει link"}
                >
                  <div style={imgShadow}>
                  <Image
  src={churchImg}              // ή rsvpImg αντίστοιχα
  alt="Εκκλησία"
  fill
  quality={100}
  sizes="(max-width: 768px) 45vw, 130px"
  style={{ objectFit: "cover" }}
/>
                  </div>
                </button>
                <div style={miniLabel}>{churchTitle}</div>
              </div>

              {/* RSVP */}
              <div className="cardBlock">
                <button
                  type="button"
                  className="liftBtn liftSmall"
                  style={smallCard}
                  onClick={goRSVP}
                  title="RSVP"
                >
                  <div style={imgShadow}>
                  <Image
  src={rsvpImg}
  alt="RSVP"
  fill
  quality={100}
  sizes="(max-width: 768px) 45vw, 130px"
  style={{ objectFit: "cover" }}
/>
                  </div>
                </button>
                <div style={miniLabel}>{rsvpTitle}</div>
              </div>
            </div>

            {/* ΔΕΞΙΑ – μεγάλη κάρτα Κέντρο */}
            <div style={rightCol} className="rightCol">
              <button
                type="button"
                className="liftBtn liftLarge"
                style={largeCard}
                onClick={() => openMap(venueMapUrl)}
                title={venueMapUrl ? "Άνοιγμα χάρτη" : "Δεν υπάρχει link"}
              >
                <div style={imgShadow}>
                  <Image
                    src={venueImg}
                    alt="Κέντρο"
                    fill
                    quality={95}
                    sizes="(max-width: 768px) 82vw, 220px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </button>
              <div style={bigLabel}>{venueTitle}</div>
            </div>
          </div>

          {/* ΠΙΣΩ */}
          <button
            type="button"
            className="pressBtn backBtn"
            style={backBtn}
            onClick={goBackSafe}
          >
            Πίσω
          </button>
        </div>
      </div>

      <style jsx>{`
        /* ------------------ CLICKABLE ANIMATIONS ------------------ */

        /* ΚΑΡΤΕΣ */
        .liftBtn {
          transition: transform 0.22s ease, box-shadow 0.22s ease;
          will-change: transform;
        }

        .liftBtn:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.16);
        }

        .liftBtn:active {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.12);
        }

        .liftSmall:hover {
          box-shadow: 0 35px 90px rgba(0, 0, 0, 0.28) !important;
        }
        .liftSmall:active {
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.22) !important;
        }

        .liftLarge:hover {
          box-shadow: 0 45px 110px rgba(0, 0, 0, 0.3) !important;
        }
        .liftLarge:active {
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.24) !important;
        }

        /* ΠΙΣΩ (DESKTOP BASE: επειδή είναι absolute με top:50%) */
        .pressBtn {
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          will-change: transform;
        }

        .backBtn {
          transform: translateY(-50%);
        }

        .backBtn:hover {
          transform: translateY(calc(-50% - 6px));
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.14);
        }

        .backBtn:active {
          transform: translateY(calc(-50% - 3px));
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        /* Touch συσκευές: δεν υπάρχει hover */
        @media (hover: none) {
          .liftBtn:hover {
            transform: none !important;
            box-shadow: inherit !important;
          }
          .liftBtn:active {
            transform: translateY(-4px) scale(1.01);
          }

          .backBtn:hover {
            transform: translateY(-50%);
            box-shadow: inherit;
          }
          .backBtn:active {
            transform: translateY(calc(-50% - 3px));
          }
        }

        /* ------------------ MOBILE LAYOUT ------------------ */
        @media (max-width: 768px) {
          /* κόβουμε scale + margins */
          .scaleWrap {
            transform: none !important;
            width: 100% !important;
            margin: 0 auto !important;
            margin-left: 0 !important;
          }

          /* grid -> στήλη */
          .layoutGrid {
            display: flex !important;
            flex-direction: column !important;
            gap: 18px !important;
            align-items: center !important;
            margin-left: 0 !important;
          }

          .leftCol {
            width: 92vw !important;
            max-width: 360px !important;
            height: auto !important;
          }

          .inviteWrapper {
            width: 92vw !important;
            max-width: 360px !important;
            height: 520px !important;
            transform: none !important;
          }

          /* ΦΑΚΕΛΟΣ να φαίνεται στο mobile */
          .envelopeWrapper {
            display: block !important;
            left: 50% !important;
            top: -10px !important;
            transform: translateX(-50%) scale(0.6) !important;
            width: 500px !important;
            height: 260px !important;
            opacity: 0.85 !important;
            pointer-events: none !important;
          }

          /* 2 μικρές κάρτες δίπλα-δίπλα */
          .midCol {
            flex-direction: row !important;
            gap: 14px !important;
            align-items: flex-start !important;
          }

          .cardBlock {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }

          /* μεγάλη κάρτα */
          .rightCol {
            width: 92vw !important;
            max-width: 360px !important;
          }
          .rightCol button {
            width: 100% !important;
            height: 240px !important;
          }

          /* ΠΙΣΩ: fixed πάνω αριστερά */
          .backBtn {
            position: fixed !important;
            left: 14px !important;
            top: 14px !important;
            z-index: 9999 !important;

            /* στο mobile ΔΕΝ θέλουμε -50% βάση */
            transform: translateY(0) !important;
          }

          .backBtn:hover {
            transform: translateY(-4px) !important;
          }

          .backBtn:active {
            transform: translateY(-2px) !important;
          }

          @media (hover: none) {
            .backBtn:hover {
              transform: translateY(0) !important;
              box-shadow: inherit !important;
            }
            .backBtn:active {
              transform: translateY(-3px) !important;
              box-shadow: 0 14px 40px rgba(0, 0, 0, 0.14) !important;
            }
          }
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
  marginLeft: "260px",
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
  transform: "translateX(-30px)",
  boxShadow: "0 22px 70px rgba(0,0,0,0.22)",
};

const envelopeWrapper: React.CSSProperties = {
  position: "absolute",
  left: "40%",
  transform: "translateX(-50%)",
  top: "5px",
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

/* ΠΙΣΩ */
const backBtn: React.CSSProperties = {
  position: "absolute",
  left: "-180px",
  top: "50%",
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