"use client";

import { useEffect, useMemo, useState } from "react";
import ImageUpload from "@/components/ImageUpload";

type EventRow = {
  slug: string;
  title?: string | null;
  subtitle?: string | null;
  date_text?: string | null;
  time_text?: string | null;

  church_name?: string | null;
  church_map_url?: string | null;

  venue_name?: string | null;
  venue_map_url?: string | null;

  invite_image_url?: string | null;
  church_card_image_url?: string | null;
  venue_card_image_url?: string | null;
  rsvp_image_url?: string | null;

  share_token?: string | null;
};

function generateToken() {
  const words = ["love", "event", "gold", "rose", "luna", "dream"];
  const randomWord = words[Math.floor(Math.random() * words.length)];
  const number = Math.floor(1000 + Math.random() * 9000);
  return `${randomWord}${number}`;
}

function cleanSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const emptyForm: EventRow = {
  slug: "",
  title: "",
  subtitle: "",
  date_text: "",
  time_text: "",
  church_name: "",
  church_map_url: "",
  venue_name: "",
  venue_map_url: "",
  invite_image_url: "",
  church_card_image_url: "",
  venue_card_image_url: "",
  rsvp_image_url: "",
  share_token: "",
};

export default function AdminEventForm({
  event,
  onSaved,
}: {
  event: EventRow | null;
  onSaved?: () => void;
}) {
  const [form, setForm] = useState<EventRow>(emptyForm);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setForm({
        slug: event.slug || "",
        title: event.title || "",
        subtitle: event.subtitle || "",
        date_text: event.date_text || "",
        time_text: event.time_text || "",
        church_name: event.church_name || "",
        church_map_url: event.church_map_url || "",
        venue_name: event.venue_name || "",
        venue_map_url: event.venue_map_url || "",
        invite_image_url: event.invite_image_url || "",
        church_card_image_url: event.church_card_image_url || "",
        venue_card_image_url: event.venue_card_image_url || "",
        rsvp_image_url: event.rsvp_image_url || "",
        share_token: event.share_token || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [event]);

  function update(key: keyof EventRow, value: string) {
    if (key === "slug") {
      setForm((prev) => ({ ...prev, slug: cleanSlug(value) }));
      return;
    }
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const inviteLink = useMemo(() => {
    if (!form.slug || !form.share_token) return "";
    return `https://lablouinvitations.gr/e/${encodeURIComponent(
      form.slug
    )}?t=${encodeURIComponent(form.share_token)}`;
  }, [form.slug, form.share_token]);

  const resultsLink = useMemo(() => {
    if (!form.slug || !form.share_token) return "";
    return `https://lablouinvitations.gr/results/${encodeURIComponent(
      form.slug
    )}?t=${encodeURIComponent(form.share_token)}`;
  }, [form.slug, form.share_token]);

  async function save() {
    if (!form.slug.trim()) {
      setMsg("❌ Βάλε πρώτα slug.");
      return;
    }

    const payload = {
      ...form,
      slug: cleanSlug(form.slug),
      share_token: form.share_token || generateToken(),
    };

    try {
      setSaving(true);
      setMsg("");

      const res = await fetch("/api/admin/save-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const rawText = await res.text();

      let data: any = null;
      try {
        data = JSON.parse(rawText);
      } catch {
        setMsg("❌ Invalid JSON response: " + rawText);
        setSaving(false);
        return;
      }

      if (!res.ok || !data?.ok) {
        setMsg("❌ " + (data?.error || "Αποτυχία αποθήκευσης"));
        setSaving(false);
        return;
      }

      setForm((prev) => ({
        ...prev,
        slug: data?.slug || payload.slug,
        share_token: data?.share_token || payload.share_token,
      }));

      setMsg("✅ Αποθηκεύτηκε!");
      setSaving(false);
      onSaved?.();
    } catch (e: any) {
      setMsg("❌ " + (e?.message || String(e)));
      setSaving(false);
    }
  }

  async function copyInviteLink() {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setMsg("📋 Αντιγράφηκε το Invite Link!");
  }

  async function copyResultsLink() {
    if (!resultsLink) return;
    await navigator.clipboard.writeText(resultsLink);
    setMsg("📋 Αντιγράφηκε το Results Link!");
  }

  return (
    <div style={card}>
      <h2 style={heading}>Event Editor</h2>

      <Input
        label="Slug"
        value={form.slug || ""}
        onChange={(v) => update("slug", v)}
      />

      <Input
        label="Τίτλος"
        value={form.title || ""}
        onChange={(v) => update("title", v)}
      />

      <Input
        label="Υπότιτλος"
        value={form.subtitle || ""}
        onChange={(v) => update("subtitle", v)}
      />

      <Input
        label="Ημερομηνία"
        value={form.date_text || ""}
        onChange={(v) => update("date_text", v)}
      />

      <Input
        label="Ώρα"
        value={form.time_text || ""}
        onChange={(v) => update("time_text", v)}
      />

      <Input
        label="Εκκλησία"
        value={form.church_name || ""}
        onChange={(v) => update("church_name", v)}
      />

      <Input
        label="Link εκκλησίας"
        value={form.church_map_url || ""}
        onChange={(v) => update("church_map_url", v)}
      />

      <Input
        label="Κέντρο"
        value={form.venue_name || ""}
        onChange={(v) => update("venue_name", v)}
      />

      <Input
        label="Link κέντρου"
        value={form.venue_map_url || ""}
        onChange={(v) => update("venue_map_url", v)}
      />

      <h3 style={sectionTitle}>Εικόνες</h3>

      <ImageUpload
        label="1. Προσκλητήριο"
        slug={form.slug || ""}
        onUpload={(url) => update("invite_image_url", url)}
      />
      {form.invite_image_url ? (
        <PreviewImage
          title="Preview προσκλητηρίου"
          src={form.invite_image_url}
        />
      ) : null}

      <ImageUpload
        label="2. Εκκλησία"
        slug={form.slug || ""}
        onUpload={(url) => update("church_card_image_url", url)}
      />
      {form.church_card_image_url ? (
        <PreviewImage
          title="Preview εκκλησίας"
          src={form.church_card_image_url}
        />
      ) : null}

      <ImageUpload
        label="3. Κέντρο"
        slug={form.slug || ""}
        onUpload={(url) => update("venue_card_image_url", url)}
      />
      {form.venue_card_image_url ? (
        <PreviewImage title="Preview κέντρου" src={form.venue_card_image_url} />
      ) : null}

      <ImageUpload
        label="4. RSVP"
        slug={form.slug || ""}
        onUpload={(url) => update("rsvp_image_url", url)}
      />
      {form.rsvp_image_url ? (
        <PreviewImage title="Preview RSVP" src={form.rsvp_image_url} />
      ) : null}

      <Input
        label="Token"
        value={form.share_token || ""}
        onChange={(v) => update("share_token", v)}
      />

      <div style={btnRow}>
        <button
          type="button"
          style={btn}
          onClick={() => update("share_token", generateToken())}
        >
          Generate Token
        </button>

        <button type="button" style={btn} onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>

        <button type="button" style={btn} onClick={copyInviteLink}>
          Copy Invite Link
        </button>

        <button type="button" style={btn} onClick={copyResultsLink}>
          Copy Results Link
        </button>
      </div>

      <div style={linksWrap}>
        <div style={linkLabel}>Invite Link</div>
        <div style={linkBox}>{inviteLink || "Συμπλήρωσε slug και token"}</div>

        <div style={{ ...linkLabel, marginTop: 12 }}>Results Link</div>
        <div style={linkBox}>{resultsLink || "Συμπλήρωσε slug και token"}</div>
      </div>

      {msg ? <div style={message}>{msg}</div> : null}
    </div>
  );
}

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
    <div style={{ marginTop: 10 }}>
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

function PreviewImage({
  title,
  src,
}: {
  title: string;
  src: string;
}) {
  return (
    <div
      style={{
        marginTop: 8,
        marginBottom: 14,
        padding: 10,
        border: "1px solid #e2d8cf",
        borderRadius: 12,
        background: "#faf7f3",
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "#4b4038",
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <img
        src={src}
        alt={title}
        style={{
          width: "100%",
          maxWidth: 220,
          height: "auto",
          borderRadius: 10,
          display: "block",
          border: "1px solid #ddd",
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

const heading: React.CSSProperties = {
  marginTop: 0,
  color: "#2f241d",
};

const sectionTitle: React.CSSProperties = {
  marginTop: 20,
  color: "#2f241d",
};

const btnRow: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 12,
};

const btn: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 10,
  border: "none",
  background: "#e6d3c3",
  cursor: "pointer",
  color: "#2f241d",
  fontWeight: 600,
};

const linksWrap: React.CSSProperties = {
  marginTop: 12,
};

const linkLabel: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: "#4b4038",
  marginBottom: 6,
};

const linkBox: React.CSSProperties = {
  padding: 12,
  background: "#f3f3f3",
  borderRadius: 10,
  color: "#111",
  wordBreak: "break-all",
};

const message: React.CSSProperties = {
  marginTop: 10,
  color: "#2f241d",
  fontWeight: 600,
};