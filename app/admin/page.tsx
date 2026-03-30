"use client";

import Link from "next/link";
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

type RSVPRow = {
  id?: string;
  slug: string;
  name: string;
  phone?: string | null;
  attending?: boolean | null;
  adults?: number | null;
  kids?: number | null;
  guests?: number | null;
  notes?: string | null;
  allergies?: string | null;
  created_at?: string | null;
};

export default function AdminPage() {
  const [rows, setRows] = useState<RSVPRow[]>([]);
  const [eventsList, setEventsList] = useState<EventRow[]>([]);
  const [selectedSlug, setSelectedSlug] = useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

    if (error) {
      setError(error.message);
      setRows([]);
    } else {
      setRows((data as RSVPRow[]) || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadEventsList();
    loadRSVPs();
  }, []);

  useEffect(() => {
    loadRSVPs();
  }, [selectedSlug]);

  const selectedEventTitle = useMemo(() => {
    if (selectedSlug === "all") return "Όλα τα events";
    const ev = eventsList.find((e) => e.slug === selectedSlug);
    return ev?.title ? `${ev.title} (${ev.slug})` : selectedSlug;
  }, [eventsList, selectedSlug]);

  function exportCSV() {
    if (!rows.length) {
      alert("Δεν υπάρχουν RSVP για export.");
      return;
    }

    const headers = [
      "Ημερομηνία",
      "Event",
      "Όνομα",
      "Τηλέφωνο",
      "Παρουσία",
      "Ενήλικοι",
      "Παιδιά",
      "Σύνολο",
      "Σχόλια",
    ];

    const csvEscape = (value: unknown) => {
      const s = String(value ?? "");
      if (s.includes('"') || s.includes(",") || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const csvRows = rows.map((r) => {
      const adults = Number(r.adults || 0);
      const kids = Number(r.kids || 0);
      const total = adults + kids > 0 ? adults + kids : Number(r.guests || 0);

      return [
        r.created_at ? new Date(r.created_at).toLocaleDateString("el-GR") : "",
        r.slug || "",
        r.name || "",
        r.phone || "",
        r.attending ? "Ναι" : "Όχι",
        r.attending ? adults : 0,
        r.attending ? kids : 0,
        r.attending ? total : 0,
        r.notes || r.allergies || "",
      ];
    });

    const csv = [
      headers.map(csvEscape).join(","),
      ...csvRows.map((row) => row.map(csvEscape).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download =
      selectedSlug === "all"
        ? "rsvp-all-events.csv"
        : `rsvp-${selectedSlug}.csv`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div style={page}>
      <div style={container}>
        <div style={headerRow}>
          <div>
            <h1 style={title}>RSVP Admin</h1>
            <p style={subtitle}>
              Διαχείριση απαντήσεων και γρήγορη πρόσβαση στα events σου.
            </p>
          </div>

          <div style={headerActions}>
            <Link href="/admin/events" style={primaryLinkBtn}>
              Events Editor
            </Link>
          </div>
        </div>

        <div style={card}>
          <div style={controlsRow}>
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              style={selectStyle}
            >
              <option value="all">Όλα τα events</option>
              {eventsList.map((ev) => (
                <option key={ev.slug} value={ev.slug}>
                  {ev.title ? `${ev.title} (${ev.slug})` : ev.slug}
                </option>
              ))}
            </select>

            <button onClick={loadRSVPs} style={secondaryBtn}>
              Ανανέωση
            </button>

            <button onClick={exportCSV} style={secondaryBtn}>
              Export Excel
            </button>
          </div>

          <div style={infoLine}>
            Προβολή: <b>{selectedEventTitle}</b>
          </div>

          {loading && <div style={statusText}>Φορτώνει RSVP…</div>}

          {error ? <div style={errorText}>Σφάλμα: {error}</div> : null}

          <div style={{ overflowX: "auto" }}>
            <table style={table}>
              <thead>
                <tr>
                  {[
                    "Ημερομηνία",
                    "Event",
                    "Όνομα",
                    "Τηλέφωνο",
                    "Παρουσία",
                    "Ενήλικοι",
                    "Παιδιά",
                    "Σύνολο",
                    "Σχόλια",
                  ].map((h) => (
                    <th key={h} style={th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => {
                  const adults = Number(r.adults || 0);
                  const kids = Number(r.kids || 0);
                  const total =
                    adults + kids > 0 ? adults + kids : Number(r.guests || 0);

                  return (
                    <tr key={r.id ?? `${r.slug}_${r.created_at}_${r.name}`}>
                      <td style={td}>
                        {r.created_at
                          ? new Date(r.created_at).toLocaleDateString("el-GR")
                          : ""}
                      </td>
                      <td style={td}>{r.slug}</td>
                      <td style={td}>{r.name}</td>
                      <td style={td}>{r.phone || ""}</td>
                      <td style={td}>{r.attending ? "Ναι" : "Όχι"}</td>
                      <td style={td}>{r.attending ? adults : 0}</td>
                      <td style={td}>{r.attending ? kids : 0}</td>
                      <td style={td}>{r.attending ? total : 0}</td>
                      <td style={td}>{r.notes || r.allergies || ""}</td>
                    </tr>
                  );
                })}

                {!loading && rows.length === 0 && (
                  <tr>
                    <td colSpan={9} style={emptyTd}>
                      Δεν υπάρχουν RSVP ακόμα.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "#f7f3ee",
  padding: 24,
};

const container: React.CSSProperties = {
  maxWidth: 1280,
  margin: "0 auto",
};

const headerRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 16,
  flexWrap: "wrap",
  marginBottom: 20,
};

const headerActions: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const title: React.CSSProperties = {
  margin: 0,
  fontSize: 34,
  lineHeight: 1.05,
  color: "#2b2623",
};

const subtitle: React.CSSProperties = {
  marginTop: 8,
  marginBottom: 0,
  color: "rgba(0,0,0,0.6)",
  fontWeight: 600,
};

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: 24,
  padding: 18,
  border: "1px solid rgba(0,0,0,0.05)",
  boxShadow: "0 18px 48px rgba(0,0,0,0.07)",
};

const controlsRow: React.CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
  alignItems: "center",
  marginBottom: 12,
};

const selectStyle: React.CSSProperties = {
  minWidth: 320,
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.12)",
  background: "white",
  fontSize: 14,
};

const primaryLinkBtn: React.CSSProperties = {
  textDecoration: "none",
  padding: "12px 16px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.06)",
  background: "#dcc7b1",
  color: "#3a2d24",
  fontWeight: 800,
};

const secondaryBtn: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.08)",
  background: "white",
  color: "#3a2d24",
  fontWeight: 800,
  cursor: "pointer",
};

const infoLine: React.CSSProperties = {
  marginBottom: 14,
  color: "rgba(0,0,0,0.7)",
};

const statusText: React.CSSProperties = {
  marginBottom: 10,
};

const errorText: React.CSSProperties = {
  marginBottom: 12,
  color: "crimson",
  fontWeight: 700,
};

const table: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
};

const th: React.CSSProperties = {
  textAlign: "left",
  padding: 12,
  borderBottom: "1px solid #e8dfd6",
  whiteSpace: "nowrap",
  fontSize: 14,
  color: "#57483f",
};

const td: React.CSSProperties = {
  padding: 12,
  borderBottom: "1px solid #f0e8df",
  verticalAlign: "top",
  fontSize: 14,
};

const emptyTd: React.CSSProperties = {
  padding: 18,
  textAlign: "center",
  color: "rgba(0,0,0,0.55)",
};