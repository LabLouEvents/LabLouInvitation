"use client";

import { useEffect, useState } from "react";

type Props = {
  startISO: string;
};

function diff(target: Date) {
  const now = new Date();
  const ms = target.getTime() - now.getTime();

  if (ms <= 0) return null;

  const totalSec = Math.floor(ms / 1000);

  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);

  return { days, hours, minutes };
}

export default function Countdown({ startISO }: Props) {
  const [time, setTime] = useState(() => diff(new Date(startISO)));

  useEffect(() => {
    const i = setInterval(() => {
      setTime(diff(new Date(startISO)));
    }, 60000); // κάθε 1 λεπτό

    return () => clearInterval(i);
  }, [startISO]);

  if (!time) return null;

  return (
    <div className="e-card" style={{ textAlign: "center", marginTop: 20 }}>
      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 6 }}>
        Μέχρι το event
      </div>

      <div style={{ fontSize: 20, fontWeight: 600 }}>
        ⏳ {time.days} μέρες • {time.hours} ώρες • {time.minutes} λεπτά
      </div>
    </div>
  );
}