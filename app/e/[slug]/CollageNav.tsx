"use client";

type CollageImage = {
  src: string;
  alt: string;
  targetId: string; // π.χ. "rsvp", "invite", "church", "venue"
  label?: string;
};

export default function CollageNav({ images }: { images: CollageImage[] }) {
  const CARD_H = 360;
  const STEP = 290; // πιο αραιά προς τα κάτω
  const totalHeight = Math.max(1, images.length) * STEP + CARD_H;

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ marginTop: 18 }}>
      <div
        style={{
          position: "relative",
          height: totalHeight,
          maxWidth: 820,
          margin: "0 auto",
        }}
      >
        {images.map((img, index) => {
          const y = index * STEP;
          const x = index % 2 === 0 ? -30 : 30;
          const rot = index % 2 === 0 ? -4 : 4;
          const z = 10 + index;

          return (
            <button
              key={index}
              type="button"
              onClick={() => goTo(img.targetId)}
              style={{
                position: "absolute",
                top: y,
                left: "50%",
                transform: `translateX(-50%) translateX(${x}px) rotate(${rot}deg)`,
                width: "92%",
                maxWidth: 760,
                display: "block",
                textDecoration: "none",
                zIndex: z,
                cursor: "pointer",
                border: "none",
                background: "transparent",
                padding: 0,
              }}
              aria-label={img.alt}
            >
              <div
                style={{
                  borderRadius: 18,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.70)",
                  boxShadow: "0 18px 50px rgba(0,0,0,0.14)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    margin: 12,
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.78)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#222",
                  }}
                >
                  {img.label || img.alt}
                </div>

                <div style={{ height: CARD_H }}>
                  {img.src ? (
                    <img
                      src={img.src}
                      alt={img.alt}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "grid",
                        placeItems: "center",
                        color: "rgba(0,0,0,0.55)",
                        fontSize: 14,
                      }}
                    >
                      (Δεν έχει ανέβει φωτογραφία ακόμα)
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ textAlign: "center", fontSize: 12, opacity: 0.7, marginTop: 10 }}>
        Πάτα σε φωτογραφία για να πας στην αντίστοιχη ενότητα.
      </div>
    </div>
  );
}