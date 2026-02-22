"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EnvelopeIntro({ slug }: { slug: string }) {
  const [opening, setOpening] = useState(false);
  const router = useRouter();

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);

    setTimeout(() => {
      router.push(`/e/${slug}/section`);
    }, 1600); // μετά το animation
  };

  return (
    <div style={wrapper}>
      <div style={scene}>
        <div style={envelopeContainer}>
          {/* βάση */}
          <img
            src="/envelope/base.png"
            alt=""
            style={baseStyle}
          />

          {/* inside */}
          <img
            src="/envelope/inside.png"
            alt=""
            style={{
              ...insideStyle,
              opacity: opening ? 1 : 0,
              transform: opening
                ? "translateY(0px)"
                : "translateY(-10px)",
            }}
          />

          {/* flap */}
          <img
            src="/envelope/flap.png"
            alt=""
            style={{
              ...flapStyle,
              transform: opening
                ? "rotateX(165deg)"
                : "rotateX(0deg)",
            }}
          />
        </div>
      </div>

      <button onClick={handleOpen} style={buttonStyle}>
        Άνοιγμα προσκλητηρίου
      </button>
    </div>
  );
}

/* ================= STYLES ================= */

const wrapper: React.CSSProperties = {
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "#e8e2d9",
};

const scene: React.CSSProperties = {
  perspective: "1400px",
};

const envelopeContainer: React.CSSProperties = {
  position: "relative",
  width: 420,
  transformStyle: "preserve-3d",
};

const baseStyle: React.CSSProperties = {
  width: "100%",
  display: "block",
};

const insideStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  transition: "all 0.8s ease",
  zIndex: 1,
};

const flapStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  transformOrigin: "top center",
  transition: "transform 1s ease",
  zIndex: 2,
  backfaceVisibility: "hidden",
};

const buttonStyle: React.CSSProperties = {
  marginTop: 40,
  padding: "14px 28px",
  borderRadius: 30,
  border: "none",
  background: "#cbbfae",
  color: "#fff",
  fontSize: 16,
  cursor: "pointer",
};