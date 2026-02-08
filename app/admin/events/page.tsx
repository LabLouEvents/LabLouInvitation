"use client";

import { useEffect, useMemo, useState } from "react";

type EventRow = {
  slug: string;
  title: string | null;
};

type EventFull = {
  slug: string;
  template: "elegant" | "playful";
  title: string;
  subtitle: string | null;

  cover_image: string | null;

  church_name: string | null;
  church_address: string | null;
  church_map_url: string | null;

  venue_name: string | null;
  venue_address: string | null;
  venue_map_url: string | null;

  start_iso: string;
  end_iso: string | null;

  rsvp_deadline: string | null; // DD/MM/YYYY
  extra_note: string | null;
};

/* =========================
   helpers
========================= */

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isoToLocalInput(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// datetime-local → ISO με timezone offset
function localInputToISOWithOffset(localValue: string) {
  const d = new Date(localValue);
  const pad = (n: number) => String(n).padStart(2, "0");

  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());

  const tzMin = -d.getTimezoneOffset();
  const sign = tzMin >= 0 ? "+" : "-";
  const tzh = pad(Math.floor(Math.abs(tzMin) / 60));
  const tzm = pad(Math.abs(tzMin) % 60);

  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:00${sign}${tzh}:${tzm}`;
}

function emptyEvent(slug: string): EventFull {
  // default start = σήμερα σε 18:00
  const now = new Date();
  now.setHours(18, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  const local = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;

  return {
    slug,
    template: "elegant",
    title: "",
    subtitle: "",

    cover_image: null,

    church_name: "",
    church_address: "",
    church_map_url: "",

    venue_name: "",
    venue_address: "",
    venue_map_url: "",

    start_iso: localInputToISOWithOffset(local),
    end_iso: null,

    rsvp_deadline: "",
    extra_note: "",
  };
}

/* =========================
   page
========================= */

export default function AdminEventsPage() {
  const [list, setList] = useState<EventRow[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  const [selectedSlug, setSelectedSlug] = useState<string>("");
  const [e, setE] = useState<EventFull | null>(null);

  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [file, setFile] = useState<File | null>(null);

  // CREATE UI
  const [newTitle, setNewTitle] = useState("");
  const newSlug = useMemo(() => slugify(newTitle), [newTitle]);

  async function loadList() {
    setLoadingList(true);
    const res = await fetch("/api/admin/list-events");
    const data = await res.json();
    setList(data.events || []);
    setLoadingList(false);
  }

  async function loadEvent(slug: string) {
    const res = await fetch(`/api/admin/get-event?slug=${encodeURIComponent(slug)}`);
    const data = await res.json();
    if (!data.ok) {
      alert("Δεν βρέθηκε event");
      return;
    }
    setSelectedSlug(slug);
    setE(data.event);
    setFile(null);
  }

  useEffect(() => {
    loadList();
  }, []);

  /* =========================
     CREATE NEW
  ========================= */

  async function createNew() {
    if (!newTitle.trim()) return alert("Γράψε τίτλο για το νέο event 🙂");
    if (!newSlug) return alert("Δεν βγαίνει slug από τον τίτλο (γράψε κάτι πιο απλό) 🙂");

    setCreating(true);
    try {
      // δημιουργούμε με ελάχιστα mandatory
      const payload = emptyEvent(newSlug);
      payload.title = newTitle.trim();

      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert("Σφάλμα create:\n" + (data.error || "unknown"));
        return;
      }

      await loadList();
      setNewTitle("");
      await loadEvent(newSlug);
      alert("Νέο event δημιουργήθηκε ✅");
    } finally {
      setCreating(false);
    }
  }

  /* =========================
     SAVE EDIT
  ========================= */

  async function save() {
    if (!e) return;
    if (!e.slug) return alert("Missing slug");
    if (!e.title?.trim()) return alert("Βάλε τίτλο");
    if (!e.start_iso) return alert("Βάλε Start date/time");

    setSaving(true);
    try {
      const res = await fetch("/api/admin/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(e),
      });
      const data = await res.json();
      if (!data.ok) return alert(data.error || "Save error");

      await loadList();
      alert("Αποθηκεύτηκε ✅");
    } finally {
      setSaving(false);
    }
  }

  /* =========================
     DELETE
  ========================= */

  async function del() {
    if (!e?.slug) return;
    const ok = confirm(`Σίγουρα delete το event "${e.slug}" ;`);
    if (!ok) return;

    const res = await fetch("/api/admin/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: e.slug }),
    });
    const data = await res.json();
    if (!data.ok) return alert(data.error || "Delete error");

    setE(null);
    setSelectedSlug("");
    await loadList();
    alert("Διαγράφηκε ✅");
  }

  /* =========================
     UPLOAD COVER
  ========================= */

  async function uploadCover() {
    if (!e?.slug) return alert("Διάλεξε event πρώτα");
    if (!file) return alert("Διάλεξε εικόνα πρώτα");

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("slug", e.slug);
      fd.append("file", file);

      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!data.ok) return alert(data.error || "Upload error");

      // γράφουμε στη βάση
      const saveRes = await fetch("/api/admin/events", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: e.slug, cover_image: data.publicUrl }),
      });
      const saveData = await saveRes.json();
      if (!saveData.ok) return alert(saveData.error || "Save cover error");

      setE({ ...e, cover_image: data.publicUrl });
      alert("Cover updated ✅");
    } finally {
      setUploading(false);
    }
  }

  /* =========================
     UI
  ========================= */

  return (
    <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 18, padding: 20 }}>
      {/* LEFT */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>Events</h3>
          <button onClick={loadList} style={{ padding: "6px 10px" }}>
            Refresh
          </button>
        </div>

        {/* CREATE NEW */}
        <div style={{ marginTop: 10, padding: 12, border: "1px solid #ddd", borderRadius: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>＋ Νέο Event</div>
          <input
            placeholder="Τίτλος νέου event"
            value={newTitle}
            onChange={(ev) => setNewTitle(ev.target.value)}
            style={{ width: "100%", padding: 10 }}
          />
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
            Slug: <b>{newSlug || "-"}</b>
          </div>
          <button
            onClick={createNew}
            disabled={creating}
            style={{ marginTop: 10, width: "100%", padding: "10px 12px" }}
          >
            {creating ? "Creating…" : "Create"}
          </button>
        </div>

        {/* LIST */}
        <div style={{ marginTop: 12, border: "1px solid #ddd", borderRadius: 12, overflow: "hidden" }}>
          {loadingList ? (
            <div style={{ padding: 12, opacity: 0.7 }}>Loading…</div>
          ) : list.length === 0 ? (
            <div style={{ padding: 12, opacity: 0.7 }}>No events</div>
          ) : (
            list.map((row) => (
              <button
                key={row.slug}
                onClick={() => loadEvent(row.slug)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: 12,
                  border: "0",
                  borderBottom: "1px solid #eee",
                  background: selectedSlug === row.slug ? "#f3f3f3" : "white",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 700 }}>{row.title || row.slug}</div>
                <div style={{ fontSize: 12, opacity: 0.7 }}>{row.slug}</div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* RIGHT */}
      <div>
        <h3 style={{ marginTop: 0 }}>Edit: {e?.slug || "-"}</h3>

        {!e ? (
          <div style={{ opacity: 0.7 }}>Διάλεξε ένα event από αριστερά ή φτιάξε νέο.</div>
        ) : (
          <div style={{ display: "grid", gap: 10, maxWidth: 760 }}>
            {/* BASIC */}
            <label>
              Title
              <input
                value={e.title || ""}
                onChange={(ev) => setE({ ...e, title: ev.target.value })}
                style={{ width: "100%", padding: 10 }}
              />
            </label>

            <label>
              Subtitle
              <input
                value={e.subtitle || ""}
                onChange={(ev) => setE({ ...e, subtitle: ev.target.value })}
                style={{ width: "100%", padding: 10 }}
              />
            </label>

            <label>
              Template
              <select
                value={e.template}
                onChange={(ev) => setE({ ...e, template: ev.target.value as any })}
                style={{ width: "100%", padding: 10 }}
              >
                <option value="elegant">elegant</option>
                <option value="playful">playful</option>
              </select>
            </label>

            <hr />

            {/* DATES */}
            <label>
              Start (picker)
              <input
                type="datetime-local"
                value={isoToLocalInput(e.start_iso)}
                onChange={(ev) => setE({ ...e, start_iso: localInputToISOWithOffset(ev.target.value) })}
                style={{ width: "100%", padding: 10 }}
              />
            </label>

            <label>
              End (optional)
              <input
                type="datetime-local"
                value={isoToLocalInput(e.end_iso)}
                onChange={(ev) =>
                  setE({ ...e, end_iso: ev.target.value ? localInputToISOWithOffset(ev.target.value) : null })
                }
                style={{ width: "100%", padding: 10 }}
              />
            </label>

            <label>
              RSVP deadline (DD/MM/YYYY)
              <input
                value={e.rsvp_deadline || ""}
                onChange={(ev) => setE({ ...e, rsvp_deadline: ev.target.value })}
                style={{ width: "100%", padding: 10 }}
                placeholder="01/07/2026"
              />
            </label>

            <label>
              Extra note
              <input
                value={e.extra_note || ""}
                onChange={(ev) => setE({ ...e, extra_note: ev.target.value })}
                style={{ width: "100%", padding: 10 }}
              />
            </label>

            <hr />

            {/* CHURCH */}
            <h4 style={{ margin: "6px 0 0" }}>Church</h4>
            <input
              placeholder="church_name"
              value={e.church_name || ""}
              onChange={(ev) => setE({ ...e, church_name: ev.target.value })}
              style={{ padding: 10 }}
            />
            <input
              placeholder="church_address"
              value={e.church_address || ""}
              onChange={(ev) => setE({ ...e, church_address: ev.target.value })}
              style={{ padding: 10 }}
            />
            <input
              placeholder="church_map_url (Google Maps link)"
              value={e.church_map_url || ""}
              onChange={(ev) => setE({ ...e, church_map_url: ev.target.value })}
              style={{ padding: 10 }}
            />

            {/* VENUE */}
            <h4 style={{ margin: "10px 0 0" }}>Venue</h4>
            <input
              placeholder="venue_name"
              value={e.venue_name || ""}
              onChange={(ev) => setE({ ...e, venue_name: ev.target.value })}
              style={{ padding: 10 }}
            />
            <input
              placeholder="venue_address"
              value={e.venue_address || ""}
              onChange={(ev) => setE({ ...e, venue_address: ev.target.value })}
              style={{ padding: 10 }}
            />
            <input
              placeholder="venue_map_url (Google Maps link)"
              value={e.venue_map_url || ""}
              onChange={(ev) => setE({ ...e, venue_map_url: ev.target.value })}
              style={{ padding: 10 }}
            />

            <hr />

            {/* COVER */}
            <h4 style={{ margin: "6px 0 0" }}>Cover</h4>
            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              <input type="file" accept="image/*" onChange={(ev) => setFile(ev.target.files?.[0] || null)} />
              <button onClick={uploadCover} disabled={uploading} style={{ padding: "8px 12px" }}>
                {uploading ? "Uploading…" : "Upload Cover"}
              </button>
            </div>

            {e.cover_image ? (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 12, opacity: 0.7, wordBreak: "break-all" }}>{e.cover_image}</div>
                <img src={e.cover_image} alt="cover" style={{ maxWidth: 320, borderRadius: 12, marginTop: 8 }} />
              </div>
            ) : (
              <div style={{ opacity: 0.6, marginTop: 6 }}>(No cover yet)</div>
            )}

            <hr />

            {/* ACTIONS */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button onClick={save} disabled={saving} style={{ padding: "10px 14px" }}>
                {saving ? "Saving…" : "Save"}
              </button>

              <button onClick={del} style={{ padding: "10px 14px", background: "#d33", color: "white", border: 0 }}>
                Delete
              </button>

              <a href={`/e/${e.slug}`} target="_blank" rel="noreferrer" style={{ padding: "10px 14px" }}>
                Preview
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}