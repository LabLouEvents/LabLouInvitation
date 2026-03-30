"use client";

import React from "react";

export default function CalendarButtons({
  slug,
  t,
}: {
  slug: string;
  t: string;
}) {
  const wrap: React.CSSProperties = {
    position: "absolute",
    top: 14,
    right: 14,
    display: "flex",
    gap: 8,
    zIndex: 999,
    flexWrap: "wrap",
    justifyContent: "flex-end",
    maxWidth: "calc(100% - 28px)",
  };

  const btn: React.CSSProperties = {
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    color: "white",
    padding: "8px 12px",
    borderRadius: 999,
    fontSize: 12,
    lineHeight: 1.2,
    textDecoration: "none",
    fontWeight: 600,
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    whiteSpace: "nowrap",
  };

  const detailsUrl = `https://lablouinvitations.gr/e/${encodeURIComponent(
    slug
  )}?t=${encodeURIComponent(t)}`;

  const googleUrl =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent("Πρόσκληση")}` +
    `&details=${encodeURIComponent(detailsUrl)}`;

  const appleUrl = `/api/calendar/${encodeURIComponent(
    slug
  )}?t=${encodeURIComponent(t)}`;

  return (
    <div style={wrap}>
      <a href={googleUrl} target="_blank" rel="noreferrer" style={btn}>
        Google Calendar
      </a>

      <a href={appleUrl} style={btn}>
        Apple Calendar
      </a>
    </div>
  );
}