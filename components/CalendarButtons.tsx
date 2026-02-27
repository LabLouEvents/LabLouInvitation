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
    top: 18,
    right: 18,
    display: "flex",
    gap: 10,
    zIndex: 999,
  };

  const btn: React.CSSProperties = {
    background: "rgba(0,0,0,0.45)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    color: "white",
    padding: "8px 14px",
    borderRadius: 999,
    fontSize: 13,
    textDecoration: "none",
    fontWeight: 600,
    border: "1px solid rgba(255,255,255,0.18)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  };

  const detailsUrl = `https://lablouinvitations.gr/e/${encodeURIComponent(
    slug
  )}?t=${encodeURIComponent(t)}`;

  const googleUrl =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent("Πρόσκληση")}` +
    `&details=${encodeURIComponent(detailsUrl)}`;

  const appleUrl = `/api/calendar/${encodeURIComponent(slug)}?t=${encodeURIComponent(
    t
  )}`;

  return (
    <div style={wrap}>
      <a href={googleUrl} target="_blank" rel="noreferrer" style={btn}>
        Google
      </a>
      <a href={appleUrl} style={btn}>
        Apple
      </a>
    </div>
  );
}