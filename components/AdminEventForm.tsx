"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

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
};

function generateToken(length = 32) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export default function AdminEventForm({
  event,
  onSaved,
}: {
  event: EventRow | null;
  onSaved?: () => void;
}) {
  const [form, setForm] = useState<EventRow>(
    event || {
      slug: "",
      template: "elegant",
      title: "",
      subtitle: "",
      share_token: "",
    }
  );

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (event) setForm(event);
  }, [event]);

  function update<K extends keyof EventRow>(key: K, value: EventRow[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const publicLink = useMemo(() => {
    if (!form.slug || !form.share_token) return "";
    return `https://lablouinvitations.gr/e/${form.slug}?t=${form.share_token}`;
  }, [form.slug, form.share_token]);

  async function save() {
    setSaving(true);
    setMsg("");

    const payload = {
      ...form,
      slug: form.slug?.trim(),
      share_token: form.share_token?.trim() || generateToken(),
    };

    const { error } = await supabase
      .from("events")
      .upsert([payload], { onConflict: "slug" });

    if (error) {
      setMsg("❌ " + error.message);
    } else {
      setMsg("✅ Αποθηκεύτηκε!");
      setForm((p) => ({ ...p, share_token: payload.share_token }));
      onSaved?.();
    }

    setSaving(false);
  }

  async function copyLink() {
    if (!publicLink) return;
    await navigator.clipboard.writeText(publicLink);
    setMsg("📋 Αντιγράφηκε το link!");
  }

  return (
    <div style={card}>
      <h2>Event Editor</h2>

      <div style={grid}>
        <Input label="Slug" value={form.slug || ""} onChange={(v) => update("slug", v)} />
        <Input label="Title" value={form.title || ""} onChange={(v) => update("title", v)} />
        <Input label="Subtitle" value={form.subtitle || ""} onChange={(v) => update("subtitle", v)} />

        <Input label="Ημερομηνία" value={form.date_text || ""} onChange={(v) => update("date_text", v)} />
        <Input label="Ώρα" value={form.time_text || ""} onChange={(v) => update("time_text", v)} />

        <Input label="Εκκλησία" value={form.church_name || ""} onChange={(v) => update("church_name", v)} />
        <Input label="Διεύθυνση εκκλησίας" value={form.church_address || ""} onChange={(v) => update("church_address", v)} />
        <Input label="Map εκκλησίας" value={form.church_map_url || ""} onChange={(v) => update("church_map_url", v)} />

        <Input label="Κέντρο" value={form.venue_name || ""} onChange={(v) => update("venue_name", v)} />
        <Input label="Διεύθυνση κέντρου" value={form.venue_address || ""} onChange={(v) => update("venue_address", v)} />
        <Input label="Map κέντρου" value={form.venue_map_url || ""} onChange={(v) => update("venue_map_url", v)} />

        <Input label="Invite image URL" value={form.invite_image_url || ""} onChange={(v) => update("invite_image_url", v)} />
        <Input label="RSVP image URL" value={form.rsvp_image_url || ""} onChange={(v) => update("rsvp_image_url", v)} />
      </div>

      <div style={{ marginTop: 20 }}>
        <Input
          label="Share token"
          value={form.share_token || ""}
          onChange={(v) => update("share_token", v)}
        />

        <button style={btn} onClick={() => update("share_token", generateToken())}>
          🎲 Generate Token
        </button>
      </div>

      <div style={linkBox}>
        {publicLink || "👉 Συμπλήρωσε slug + token"}
      </div>

      <div style={{ marginTop: 10 }}>
        <button style={btn} onClick={save} disabled={saving}>
          {saving ? "Αποθήκευση..." : "💾 Save"}
        </button>

        <button style={btn} onClick={copyLink}>
          📋 Copy link
        </button>

        {publicLink && (
          <a style={btn} href={publicLink} target="_blank">
            🔗 Preview
          </a>
        )}
      </div>

      {msg && <div style={{ marginTop: 10 }}>{msg}</div>}
    </div>
  );
}

/* ---------- INPUT COMPONENT ---------- */
function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <div style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: 10,
          border: "1px solid #ccc",
          background: "#ffffff",
          color: "#111111",
          caretColor: "#111111",
        }}
      />
    </div>
  );
}

/* ---------- STYLES ---------- */
const card: React.CSSProperties = {
  background: "white",
  padding: 20,
  borderRadius: 16,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
};

const linkBox: React.CSSProperties = {
  marginTop: 10,
  padding: 10,
  background: "#f3f3f3",
  borderRadius: 10,
  color: "#111",
};

const btn: React.CSSProperties = {
  marginRight: 10,
  marginTop: 10,
  padding: "10px 14px",
  borderRadius: 10,
  border: "none",
  background: "#e6d3c3",
  cursor: "pointer",
};