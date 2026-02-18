"use client";

import { useState } from "react";

type ImageItem = {
  src: string;
  alt: string;
  href: string;
};

interface CollageNavProps {
  images: ImageItem[];
}

export default function CollageNav({ images }: CollageNavProps) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div style={{ position: "relative", height: 520 }}>
      {images.map((img, index) => (
        <a
          key={index}
          href={img.href}
          onClick={() => setActive(img.src)}
          style={{
            position: "absolute",
            top: index * 120,
            left: index * 45,
            width: "86%",
            maxWidth: 680,
            transform: `rotate(${index % 2 === 0 ? -3 : 3}deg)`,
            zIndex: active === img.src ? 10 : index,
            transition: "0.3s ease",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            borderRadius: 16,
            overflow: "hidden",
            display: "block"
          }}
        >
          <img
            src={img.src}
            alt={img.alt}
            style={{
              width: "100%",
              height: 380,
              objectFit: "cover",
              display: "block"
            }}
          />
        </a>
      ))}
    </div>
  );
}