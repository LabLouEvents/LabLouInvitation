"use client";

import React, { useEffect, useState } from "react";

type Props = {
  text: string;
  speed?: number; // ms per character
  active?: boolean;
  cursor?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function TypewriterText({
  text,
  speed = 55,
  active = true,
  cursor = true,
  className,
  style,
}: Props) {
  const [out, setOut] = useState("");

  useEffect(() => {
    if (!active) {
      setOut(text);
      return;
    }

    setOut("");
    let i = 0;

    const id = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, speed);

    return () => window.clearInterval(id);
  }, [text, speed, active]);

  const showCursor = cursor && active && out.length < text.length;

  return (
    <span className={className} style={style}>
      {out}
      {showCursor ? <span style={{ opacity: 0.75 }}>▍</span> : null}
    </span>
  );
}