"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type EventRow = {
  slug: string;
  title: string | null;
};

export default function AdminPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [eventsList, setEventsList] = useState<EventRow[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= LOAD EVENTS (dropdown) ================= */

  async function loadEventsList() {
    setError("");

    const { data, error } = await supabase
      .from("events")
      .select("slug,title")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      return;
    }

    setEventsList((data as EventRow[]) || []);
  }

  /* ================= LOAD RSVPs ================= */

  async function loadRSVPs() {
    setLoading(true);
    setError("");

    let q = supabase
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false });

    if (selectedSlug !== "all") {
      q = q.eq("slug", selectedSlug);
    }

    const { data, error } = await q;

    if (error) setError(error.message);

    setRows(data || []);
    setLoading(false);
  }

  /* ================= EFFECTS ================= */

  useEffect(() => {
    loadEventsList();
    loadRSVPs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadRSVPs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlug]);

  /* ================= HELPERS ================= */

  const exportHref =
    selectedSlug === "all"
      ? "/api/admin/export"
      : `/api/admin/export?slug=${encodeURIComponent(selectedSlug)}`;

  const editEventsHref =
    selectedSlug === "all"
      ? "/admin/events"
      : `/admin/events?slug=${encodeURIComponent(selectedSlug)}`;

  const selectedEventTitle = useMemo(() => {
    if (selectedSlug === "all") return "Όλα τα events";
    const ev = eventsList.find((e) => e.slug === selectedSlug);
    return ev?.title ? `${ev.title} (${ev.slug})` : selectedSlug;
  }, [eventsList, selectedSlug]);

  /* ================= UI ================= */

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      {/* HEADER (Logout υπάρχει στο Layout) */}
      <h1 style={{ marginBottom: 20 }}>RSVP Admin</h1>

      {/* CONTROLS */}
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 14,
          alignItems: "center",
        }}
      >
        {/* Dropdown events */}
        <select
          className="e-select"
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
          style={{ width: 360 }}
        >
          <option value="all">Όλα τα events</option>

          {eventsList.map((ev) => (
            <option key={ev.slug} value={ev.slug}>
              {ev.title ? `${ev.title} (${ev.slug})` : ev.slug}
            </option>
          ))}
        </select>

        {/* Refresh */}
        <button
          onClick={loadRSVPs}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #ddd",
            cursor: "pointer",
          }}
        >
          Ανανέωση
        </button>

        {/* ✅ NEW: Button to Events editor */}
        <a
          href={editEventsHref}
          className="e-btn"
          style={{
            width: "auto",
            padding: "10px 16px",
            textDecoration: "none",
          }}
          title="Άνοιγμα επεξεργασίας events"
        >
          Edit Events
        </a>

        {/* Export CSV */}
        <a
          href={exportHref}
          className="e-btn"
          style={{
            width: "auto",
            padding: "10px 16px",
            textDecoration: "none",
          }}
        >
          Export RSVPs (CSV)
        </a>
      </div>

      <div style={{ marginBottom: 10, opacity: 0.8 }}>
        Προβολή: <b>{selectedEventTitle}</b>
      </div>

      {loading && <div>Φορτώνει…</div>}

      {error && (
        <div style={{ color: "crimson", marginBottom: 10 }}>
          Σφάλμα: {error}
        </div>
      )}

      {/* TABLE */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {[
                "Ημερομηνία",
                "Event",
                "Όνομα",
                "Θα παρευρεθεί",
                "Άτομα",
                "Αλλεργίες",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: 10,
                    borderBottom: "1px solid #ddd",
                    whiteSpace: "nowrap",
                    fontSize: 14,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr key={r.id ?? `${r.slug}_${r.created_at}_${r.name}`}>
                <td style={{ padding: 10, borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>
                  {r.created_at
                    ? new Date(r.created_at).toLocaleDateString("el-GR")
                    : ""}
                </td>

                <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                  {r.slug}
                </td>

                <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                  {r.name}
                </td>

                <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                  {r.attending ? "Ναι" : "Όχι"}
                </td>

                <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                  {r.attending ? r.guests : 0}
                </td>

                <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                  {r.attending ? (r.allergies || "") : ""}
                </td>
              </tr>
            ))}

            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 12, opacity: 0.7 }}>
                  Δεν υπάρχουν RSVP ακόμα.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}