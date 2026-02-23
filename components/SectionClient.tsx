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

  // ✅ ΣΙΓΟΥΡΟ “πίσω”
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
            {/* ΑΡΙΣΤΕΡΑ – ΠΡΟΣΚΛΗΤΗΡΙΟ + ΦΑΚΕΛΟΣ ΠΙΣΩ */}
            <div style={leftCol} className="leftCol">
              <div style={inviteWrapper} className="inviteWrapper">
                <Image
                  src="/section/invite.png"
                  alt="Προσκλητήριο"
                  fill
                  priority
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* ΦΑΚΕΛΟΣ πίσω */}
              <div style={envelopeWrapper} className="envelopeWrapper" aria-hidden="true">
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
              {/* Εκκλησία -> MAPS */}
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
                      src="/section/card-church.png"
                      alt="Εκκλησία"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </button>
                <div style={miniLabel}>{churchTitle}</div>
              </div>

              {/* RSVP -> φόρμα */}
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
                      src="/section/card-rsvp.png"
                      alt="RSVP"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </button>
                <div style={miniLabel}>RSVP</div>
              </div>
            </div>

            {/* ΔΕΞΙΑ – μεγάλη κάρτα Κέντρο -> MAPS */}
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

          {/* ΠΙΣΩ (desktop: στη μέση αριστερά, mobile: fixed πάνω αριστερά) */}
          <button
            type="button"
            className="pressBtn backBtnMobile"
            style={backBtn}
            onClick={goBackSafe}
          >
            Πίσω
          </button>
        </div>
      </div>

      {/* ✅ animations + mobile layout */}
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

  /* μικρές κάρτες: πιο “γλυκιά” σκιά */
  .liftSmall:hover {
    box-shadow: 0 35px 90px rgba(0, 0, 0, 0.28) !important;
  }
  .liftSmall:active {
    box-shadow: 0 22px 60px rgba(0, 0, 0, 0.22) !important;
  }

  /* μεγάλη κάρτα: πιο “βαριά” σκιά */
  .liftLarge:hover {
    box-shadow: 0 45px 110px rgba(0, 0, 0, 0.3) !important;
  }
  .liftLarge:active {
    box-shadow: 0 30px 90px rgba(0, 0, 0, 0.24) !important;
  }

  /* ΠΙΣΩ */
  .pressBtn {
    will-change: transform;
  }
  
  .pressBtn:hover {
    transform: translateY(-50%) translateY(-6px);
    box-shadow: 0 18px 50px rgba(0,0,0,0.18);
  }
  
  .pressBtn:active {
    transform: translateY(-50%) translateY(-3px);
    box-shadow: 0 12px 35px rgba(0,0,0,0.14);
  }

  /* Touch devices: δεν υπάρχει hover, κρατάμε μόνο active */
  @media (hover: none) {
    .liftBtn:hover {
      transform: none;
      box-shadow: inherit;
    }
    /* ΠΙΣΩ */
.pressBtn {
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  will-change: transform;
}

.pressBtn:hover {
  transform: translateY(-50%) translateY(-6px);
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.18);
}

.pressBtn:active {
  transform: translateY(-50%) translateY(-3px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.14);
}
  }

  /* ------------------ MOBILE LAYOUT ------------------ */
  @media (max-width: 768px) {

    .scaleWrap {
      transform: none !important;
      width: 100% !important;
      margin: 0 auto !important;
      margin-left: 0 !important;
    }
  
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
  
    .envelopeWrapper {
      left: 50% !important;
      top: -20px !important;
      transform: translateX(-50%) scale(0.6) !important;
      width: 500px !important;
      height: 260px !important;
      opacity: 0.85 !important;
      pointer-events: none !important;
    }
  
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
  
    .rightCol button {
      transform: none !important;
      width: 82vw !important;
      max-width: 360px !important;
      height: 240px !important;
    }
  
    .backBtnMobile {
      position: fixed !important;
      left: 14px !important;
      top: 14px !important;
      z-index: 9999 !important;
    }
  
    .backBtnMobile.pressBtn {
      transform: none !important;
    }
  
    .backBtnMobile.pressBtn:hover {
      transform: translateY(-4px) !important;
    }
  
    .backBtnMobile.pressBtn:active {
      transform: translateY(-2px) !important;
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
transform: "translateY(-50%)",
transition: "transform 0.18s ease, box-shadow 0.18s ease",
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