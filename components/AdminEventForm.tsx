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

function generateToken() {
    const words = ["love", "event", "gold", "rose", "luna", "dream"];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const number = Math.floor(1000 + Math.random() * 9000);
  
    return `${randomWord}${number}`;
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
    if (event) {
      setForm(event);
    }
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
      <h2 style={{ marginTop: 0, color: "#2f241d" }}>Event Editor</h2>

      <div style={grid}>
        <Input
          label="Slug"
          placeholder="π.χ. thanasis-myrto"
          value={form.slug || ""}
          onChange={(v) => update("slug", v)}
        />

        <Input
          label="Τίτλος"
          placeholder="π.χ. Θανάσης & Μυρτώ"
          value={form.title || ""}
          onChange={(v) => update("title", v)}
        />

        <Input
          label="Υπότιτλος"
          placeholder="π.χ. Με χαρά σας προσκαλούμε..."
          value={form.subtitle || ""}
          onChange={(v) => update("subtitle", v)}
        />

        <Input
          label="Template"
          placeholder="π.χ. elegant"
          value={form.template || ""}
          onChange={(v) => update("template", v)}
        />

        <Input
          label="Ημερομηνία"
          placeholder="π.χ. Κυριακή 12 Ιουλίου 2026"
          value={form.date_text || ""}
          onChange={(v) => update("date_text", v)}
        />

        <Input
          label="Ώρα"
          placeholder="π.χ. 18:30"
          value={form.time_text || ""}
          onChange={(v) => update("time_text", v)}
        />

        <Input
          label="Έναρξη ISO"
          placeholder="2026-07-12T18:30:00+03:00"
          value={form.start_iso || ""}
          onChange={(v) => update("start_iso", v)}
        />

        <Input
          label="Λήξη ISO"
          placeholder="2026-07-12T21:00:00+03:00"
          value={form.end_iso || ""}
          onChange={(v) => update("end_iso", v)}
        />

        <Input
          label="Εκκλησία"
          placeholder="π.χ. Ι.Ν. Αγίου Νικολάου"
          value={form.church_name || ""}
          onChange={(v) => update("church_name", v)}
        />

        <Input
          label="Διεύθυνση εκκλησίας"
          placeholder="π.χ. Ιωάννινα"
          value={form.church_address || ""}
          onChange={(v) => update("church_address", v)}
        />

        <Input
          label="Link χάρτη εκκλησίας"
          placeholder="Google Maps URL"
          value={form.church_map_url || ""}
          onChange={(v) => update("church_map_url", v)}
        />

        <Input
          label="Κέντρο"
          placeholder="π.χ. Κτήμα Αριάδνη"
          value={form.venue_name || ""}
          onChange={(v) => update("venue_name", v)}
        />

        <Input
          label="Διεύθυνση κέντρου"
          placeholder="π.χ. Ιωάννινα"
          value={form.venue_address || ""}
          onChange={(v) => update("venue_address", v)}
        />

        <Input
          label="Link χάρτη κέντρου"
          placeholder="Google Maps URL"
          value={form.venue_map_url || ""}
          onChange={(v) => update("venue_map_url", v)}
        />

        <Input
          label="Invite image URL"
          placeholder="URL εικόνας προσκλητηρίου"
          value={form.invite_image_url || ""}
          onChange={(v) => update("invite_image_url", v)}
        />

        <Input
          label="RSVP image URL"
          placeholder="URL εικόνας RSVP"
          value={form.rsvp_image_url || ""}
          onChange={(v) => update("rsvp_image_url", v)}
        />

        <Input
          label="Deadline RSVP"
          placeholder="π.χ. 01/07/2026"
          value={form.rsvp_deadline || ""}
          onChange={(v) => update("rsvp_deadline", v)}
        />

        <Input
          label="Extra note"
          placeholder="π.χ. Θα ακολουθήσει δεξίωση"
          value={form.extra_note || ""}
          onChange={(v) => update("extra_note", v)}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <Input
          label="Share token"
          placeholder="πάτα Generate Token ή γράψε δικό σου"
          value={form.share_token || ""}
          onChange={(v) => update("share_token", v)}
        />

        <button
          type="button"
          style={btn}
          onClick={() => update("share_token", generateToken())}
        >
          🎲 Generate Token
        </button>
      </div>

      <div style={linkBox}>
        {publicLink || "👉 Συμπλήρωσε slug + share token"}
      </div>

      <div style={{ marginTop: 10 }}>
        <button type="button" style={btn} onClick={save} disabled={saving}>
          {saving ? "Αποθήκευση..." : "💾 Save"}
        </button>

        <button type="button" style={btn} onClick={copyLink}>
          📋 Copy link
        </button>

        {publicLink && (
          <a style={btnLink} href={publicLink} target="_blank" rel="noreferrer">
            🔗 Preview
          </a>
        )}
      </div>

      {msg && <div style={{ marginTop: 10, color: "#2f241d" }}>{msg}</div>}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 13,
          marginBottom: 6,
          color: "#4b4038",
          fontWeight: 700,
        }}
      >
        {label}
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "12px 14px",
          borderRadius: 10,
          border: "1px solid #d8cfc6",
          background: "#ffffff",
          color: "#111111",
          caretColor: "#111111",
          fontSize: 14,
        }}
      />
    </div>
  );
}

const card: React.CSSProperties = {
  background: "white",
  padding: 20,
  borderRadius: 16,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
};

const linkBox: React.CSSProperties = {
  marginTop: 10,
  padding: 12,
  background: "#f3f3f3",
  borderRadius: 10,
  color: "#111",
  wordBreak: "break-all",
};

const btn: React.CSSProperties = {
  marginRight: 10,
  marginTop: 10,
  padding: "10px 14px",
  borderRadius: 10,
  border: "none",
  background: "#e6d3c3",
  cursor: "pointer",
  color: "#2f241d",
  fontWeight: 600,
};

const btnLink: React.CSSProperties = {
  display: "inline-block",
  marginRight: 10,
  marginTop: 10,
  padding: "10px 14px",
  borderRadius: 10,
  border: "none",
  background: "#e6d3c3",
  cursor: "pointer",
  color: "#2f241d",
  fontWeight: 600,
  textDecoration: "none",
};