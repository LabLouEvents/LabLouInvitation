"use client";

import { useEffect, useState } from "react";

export default function Countdown({ startISO }: { startISO: string }) {
  const calculate = () => {
    const diff = new Date(startISO).getTime() - new Date().getTime();

    if (diff <= 0) return { d: 0, h: 0, m: 0 };

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);

    return { d, h, m };
  };

  const [time, setTime] = useState(calculate());

  useEffect(() => {
    const i = setInterval(() => {
      setTime(calculate());
    }, 60000);

    return () => clearInterval(i);
  }, [startISO]);

  return (
    <span>
      {time.d} ημέρες · {time.h} ώρες · {time.m} λεπτά
    </span>
  );
}