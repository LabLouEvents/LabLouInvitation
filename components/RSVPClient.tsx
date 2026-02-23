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
  venueName?: string | null;
  churchName?: string | null;
  venueMapUrl?: string | null;
  churchMapUrl?: string | null;
}) {
  const router = useRouter();

  const BG = "/intro/background.jpg"; // ίδιο με intro
  const FADE = 0.75; // 👈 πιο μεγάλο = πιο αχνό (δοκίμασε 0.70–0.82)

  const openMap = (url?: string | null) => {
    const u = (url || "").trim();
    if (!u) return;
    window.open(u, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={page(BG)}>
      {/* ΠΕΠΛΟ για να γίνει πιο αχνό το background */}
      <div style={veil(FADE)} />

      <div style={{ position: "relative", width: "min(1100px, 96vw)" }}>
        {/* Decorative open envelope on top */}
        <div style={{ display: "grid", placeItems: "center", marginBottom: 10 }}>
          <div
            style={{
              position: "relative",
              width: "min(520px, 86vw)",
              height: "min(260px, 40vw)",
            }}
          >
            <Image
              src="/envelope/envelope-open.png"
              alt="Open envelope"
              fill
              priority
              style={{
                objectFit: "contain",
                filter: "drop-shadow(0 18px 34px rgba(0,0,0,0.18))",
              }}
            />
          </div>
        </div>

        <div style={wrap}>
          {/* Left: invite preview (NOT clickable) */}
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

          {/* Right: cards */}
          <div style={right}>
            <div style={grid}>
              {/* Venue */}
              <button type="button" style={cardBtn} onClick={() => openMap(venueMapUrl)}>
                <div style={imgBox}>
                  <Image
                    src="/section/card-venue.png"
                    alt="Κέντρο"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div style={label}>{venueName || "Κέντρο"}</div>
                {!venueMapUrl ? <div style={sub}>Δεν υπάρχει link χάρτη</div> : null}
              </button>

              {/* RSVP */}
              <button
                type="button"
                style={cardBtn}
                onClick={() =>
                  router.push(
                    `/e/${encodeURIComponent(slug)}/rsvp?t=${encodeURIComponent(t)}`
                  )
                }
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

              {/* Church */}
              <button type="button" style={cardBtn} onClick={() => openMap(churchMapUrl)}>
                <div style={imgBox}>
                  <Image
                    src="/section/card-church.png"
                    alt="Εκκλησία"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div style={label}>{churchName || "Εκκλησία"}</div>
                {!churchMapUrl ? <div style={sub}>Δεν υπάρχει link χάρτη</div> : null}
              </button>

              {/* Back */}
              <button type="button" onClick={() => router.back()} style={backBtn}>
                Πίσω
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: stack columns */}
      <style>{`
        @media (max-width: 900px){
          ._wrap {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function page(bgUrl: string): React.CSSProperties {
  return {
    minHeight: "100vh",
    padding: 20,
    display: "grid",
    placeItems: "center",
    backgroundImage: `url(${bgUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    overflow: "hidden",
  };
}

function veil(fade: number): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    background: `rgba(255,255,255,${fade})`,
    pointerEvents: "none",
  };
}

const wrap: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1.2fr 0.8fr",
  gap: 18,
  alignItems: "center",
};
// βοηθάει το media query παραπάνω
// (βάζουμε className με inline τρόπο)
(wrap as any).className = "_wrap";

const left: React.CSSProperties = { display: "grid", placeItems: "center" };

const leftCard: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: "min(620px, 70vh)",
  borderRadius: 18,
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  overflow: "hidden",
  boxShadow: "0 18px 60px rgba(0,0,0,0.18)",
};

const right: React.CSSProperties = { display: "grid", placeItems: "center" };

const grid: React.CSSProperties = { width: "100%", display: "grid", gap: 14 };

const cardBtn: React.CSSProperties = {
  width: "100%",
  textAlign: "left",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.08)",
  padding: 14,
  cursor: "pointer",
  color: "white",
  backdropFilter: "blur(6px)",
};

const imgBox: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: 170,
  borderRadius: 12,
  background: "rgba(0,0,0,0.16)",
  overflow: "hidden",
};

const label: React.CSSProperties = {
  marginTop: 10,
  fontWeight: 900,
  fontSize: 16,
  textShadow: "0 2px 10px rgba(0,0,0,0.35)",
};

const sub: React.CSSProperties = { marginTop: 4, fontSize: 12, opacity: 0.75 };

const backBtn: React.CSSProperties = {
  marginTop: 6,
  width: "100%",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.10)",
  color: "white",
  fontWeight: 900,
  cursor: "pointer",
  backdropFilter: "blur(6px)",
};