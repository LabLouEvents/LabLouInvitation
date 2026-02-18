"use client";

import { useState } from "react";

type Props = {
  onSelect: (section: string) => void;
};

export default function CollageNav({ onSelect }: Props) {
  const [active, setActive] = useState<string | null>(null);

  const items = [
    { id: "invite", img: "/invites/1.png" },
    { id: "church", img: "/invites/2.png" },
    { id: "rsvp", img: "/invites/3.png" },
    { id: "info", img: "/invites/4.png" },
  ];

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 1000,
        height: 750,
        margin: "0 auto",
      }}
    >
      {items.map((item, i) => (
        <img
          key={item.id}
          src={item.img}
          onClick={() => {
            setActive(item.id);
            onSelect(item.id);
          }}
          style={{
            position: "absolute",
            width: 460,
            borderRadius: 18,
            cursor: "pointer",
            transition: "all 0.4s ease",
            boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
            transform:
              i === 0
                ? "rotate(-6deg) translate(0px,0px)"
                : i === 1
                ? "rotate(5deg) translate(260px,40px)"
                : i === 2
                ? "rotate(-4deg) translate(120px,300px)"
                : "rotate(6deg) translate(420px,330px)",
            zIndex: active === item.id ? 20 : i,
          }}
        />
      ))}
    </div>
  );
}