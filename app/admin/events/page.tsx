"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import AdminEventForm from "@/components/AdminEventForm";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type EventRow = {
  id?: string;
  slug: string;
  template?: string | null;
  title?: string | null;
  subtitle?: string | null;
  church_name?: string | null;
  church_address?: string | null;
  church_map_url?: string | null;
  venue_name?: string | null;
  venue_address?: string | null;
  venue_map_url?: string | null;
  date_text?: string | null;
  time_text?: string | null;
  start_iso?: string | null;
  end_iso?: string | null;
  rsvp_deadline?: string | null;
  extra_note?: string | null;
  cover_image?: string | null;
  share_token?: string | null;
  church_card_image_url?: string | null;
  venue_card_image_url?: string | null;
  rsvp_image_url?: string | null;
  invite_image_url?: string | null;
  meta?: any;
  created_at?: string | null;
};

const emptyEvent: EventRow = {
  slug: "",
  template: "elegant",
  title: "",
  subtitle: "",
  church_name: "",
  church_address: "",
  church_map_url: "",
  venue_name: "",
  venue_address: "",
  venue_map_url: "",
  date_text: "",
  time_text: "",
  start_iso: "",
  end_iso: "",
  rsvp_deadline: "",
  extra_note: "",
  cover_image: "",
  share_token: "",
  church_card_image_url: "",
  venue_card_image_url: "",
  rsvp_image_url: "",
  invite_image_url: "",
  meta: {},
};

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function loadEvents() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
      setEvents([]);
      setLoading(false);
      return;
    }

    const rows = (data as EventRow[]) || [];
    setEvents(rows);
    setSelectedEvent((prev) => {
      if (!rows.length) return null;
      if (!prev?.slug) return rows[0];
      return rows.find((r) => r.slug === prev.slug) || rows[0];
    });
    setLoading(false);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function handleDelete() {
    if (!selectedEvent?.slug) {
      alert("Δεν υπάρχει επιλεγμένο event.");
      return;
    }

    const ok = window.confirm(
      `Να διαγραφεί το event "${selectedEvent.title || selectedEvent.slug}" ;`
    );

    if (!ok) return;

    try {
      setDeleting(true);
      setError("");

      const res = await fetch("/api/admin/delete-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: selectedEvent.slug }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        alert("Delete error: " + (data?.error || "Unknown error"));
        setDeleting(false);
        return;
      }

      const deletedSlug = selectedEvent.slug;
      const nextEvents = events.filter((e) => e.slug !== deletedSlug);

      setEvents(nextEvents);
      setSelectedEvent(nextEvents[0] || { ...emptyEvent });
      setDeleting(false);
      alert("Το event διαγράφηκε.");
    } catch (e: any) {
      alert("Delete error: " + (e?.message || String(e)));
      setDeleting(false);
    }
  }

  return (
    <div style={page}>
      <div style={container}>
        <div style={{ marginBottom: 20 }}>
          <Link href="/admin" style={backBtn}>
            ← Πίσω στο RSVP Admin
          </Link>
        </div>

        <div style={header}>
          <div>
            <h1 style={title}>Events Admin</h1>
            <p style={subtitle}>
              Δημιουργία και επεξεργασία online προσκλητηρίων.
            </p>
          </div>

          <div style={topActions}>
            <button
              type="button"
              onClick={() => setSelectedEvent({ ...emptyEvent })}
              style={newEventBtnTop}
            >
              + Νέο Event
            </button>

            <button
              type="button"
              onClick={handleDelete}
              style={deleteBtnTop}
              disabled={!selectedEvent?.slug || deleting}
            >
              {deleting ? "Διαγραφή..." : "Διαγραφή Event"}
            </button>
          </div>
        </div>

        {error ? <div style={errorBox}>Σφάλμα: {error}</div> : null}

        {loading ? (
          <div style={loadingText}>Φορτώνει events…</div>
        ) : (
          <div style={grid}>
            <aside style={sidebar}>
              <div style={sidebarTitle}>Events</div>

              <button
                type="button"
                onClick={() => setSelectedEvent({ ...emptyEvent })}
                style={newEventBtn}
              >
                + Νέο Event
              </button>

              <div style={eventsList}>
                {events.map((ev) => {
                  const active = selectedEvent?.slug === ev.slug;
                  return (
                    <button
                      key={ev.id || ev.slug}
                      type="button"
                      onClick={() => setSelectedEvent(ev)}
                      style={{
                        ...eventBtn,
                        ...(active ? activeEventBtn : {}),
                      }}
                    >
                      <div style={eventBtnTitle}>
                        {ev.title || "Χωρίς τίτλο"}
                      </div>
                      <div style={eventBtnSlug}>{ev.slug}</div>
                    </button>
                  );
                })}

                {events.length === 0 && (
                  <div style={emptyEvents}>Δεν υπάρχουν ακόμα events.</div>
                )}
              </div>
            </aside>

            <main>
              <AdminEventForm event={selectedEvent} onSaved={loadEvents} />
            </main>
          </div>
        )}
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
  maxWidth: 1320,
  margin: "0 auto",
};

const backBtn: React.CSSProperties = {
  display: "inline-block",
  padding: "10px 16px",
  borderRadius: 12,
  background: "#e6d3c3",
  color: "#3a2d24",
  textDecoration: "none",
  fontWeight: 700,
};

const header: React.CSSProperties = {
  marginBottom: 18,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 14,
  flexWrap: "wrap",
};

const topActions: React.CSSProperties = {
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
  color: "rgba(0,0,0,0.6)",
  fontWeight: 600,
};

const errorBox: React.CSSProperties = {
  marginBottom: 14,
  color: "crimson",
  fontWeight: 700,
};

const loadingText: React.CSSProperties = {
  padding: 12,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "320px 1fr",
  gap: 20,
  alignItems: "start",
};

const sidebar: React.CSSProperties = {
  background: "rgba(255,255,255,0.92)",
  borderRadius: 24,
  padding: 16,
  border: "1px solid rgba(0,0,0,0.05)",
  boxShadow: "0 18px 48px rgba(0,0,0,0.07)",
};

const sidebarTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: 900,
  color: "#43342b",
  marginBottom: 12,
};

const newEventBtn: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.08)",
  background: "#e9dccd",
  color: "#3d3028",
  fontWeight: 800,
  cursor: "pointer",
  marginBottom: 14,
};

const newEventBtnTop: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.08)",
  background: "#e9dccd",
  color: "#3d3028",
  fontWeight: 800,
  cursor: "pointer",
};

const deleteBtnTop: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.08)",
  background: "#f4d6d6",
  color: "#7a1f1f",
  fontWeight: 800,
  cursor: "pointer",
};

const eventsList: React.CSSProperties = {
  display: "grid",
  gap: 10,
};

const eventBtn: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.06)",
  background: "white",
  cursor: "pointer",
};

const activeEventBtn: React.CSSProperties = {
  background: "#f5ece2",
  border: "1px solid #cdb29a",
};

const eventBtnTitle: React.CSSProperties = {
  fontWeight: 800,
  color: "#352922",
};

const eventBtnSlug: React.CSSProperties = {
  marginTop: 4,
  fontSize: 13,
  color: "rgba(0,0,0,0.6)",
};

const emptyEvents: React.CSSProperties = {
  color: "rgba(0,0,0,0.55)",
  padding: "8px 4px",
};