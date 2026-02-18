"use client";

export default function CollageNav({
  images,
}: {
  images: { src: string; alt: string; href: string }[];
}) {
  return (
    <div style={{ position: "relative", height: 340, maxWidth: 520, margin: "0 auto 22px" }}>
      {images.map((img, i) => {
        const styles: any[] = [
          { top: 20, left: 10, rotate: "-6deg" },
          { top: 40, left: 150, rotate: "5deg" },
          { top: 150, left: 40, rotate: "3deg" },
          { top: 170, left: 210, rotate: "-4deg" },
        ];

        const s = styles[i] || { top: 0, left: 0, rotate: "0deg" };

        return (
          <a
            key={i}
            href={img.href}
            style={{
              position: "absolute",
              top: s.top,
              left: s.left,
              width: 240,
              height: 160,
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
              transform: `rotate(${s.rotate})`,
              border: "6px solid rgba(255,255,255,0.9)",
              background: "#fff",
              cursor: "pointer",
              display: "block",
            }}
            title={img.alt}
          >
            <img
              src={img.src}
              alt={img.alt}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </a>
        );
      })}
    </div>
  );
}