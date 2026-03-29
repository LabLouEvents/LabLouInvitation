"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import ImageUpload from "@/components/ImageUpload";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type EventRow = {
    slug: string;
    title?: string | null;
    subtitle?: string | null;
    date_text?: string | null;
    time_text?: string | null;
  
    church_name?: string | null;
    church_address?: string | null;
    church_map_url?: string | null;
  
    venue_name?: string | null;
    venue_address?: string | null;
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
      title: "",
      subtitle: "",
      share_token: "",
    }
  );

  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (event) setForm(event);
  }, [event]);

  function update(key: keyof EventRow, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const publicLink = useMemo(() => {
    if (!form.slug || !form.share_token) return "";
    return `https://lablouinvitations.gr/e/${form.slug}?t=${form.share_token}`;
  }, [form.slug, form.share_token]);

  async function save() {
    const payload = {
      ...form,
      share_token: form.share_token || generateToken(),
    };

    const { error } = await supabase
      .from("events")
      .upsert([payload], { onConflict: "slug" });

    if (error) {
      setMsg("❌ " + error.message);
    } else {
      setMsg("✅ Αποθηκεύτηκε!");
      onSaved?.();
    }
  }

  return (
    <div style={card}>
      <h2>Event Editor</h2>

      {/* BASIC */}
      <Input label="Slug (π.χ. maria-nikos)" value={form.slug} onChange={(v) => update("slug", v)} />
      <Input label="Τίτλος" value={form.title || ""} onChange={(v) => update("title", v)} />
      <Input label="Υπότιτλος" value={form.subtitle || ""} onChange={(v) => update("subtitle", v)} />

      {/* DATE */}
      <Input label="Ημερομηνία" value={form.date_text || ""} onChange={(v) => update("date_text", v)} />
      <Input label="Ώρα" value={form.time_text || ""} onChange={(v) => update("time_text", v)} />

      {/* CHURCH */}
      <Input label="Εκκλησία" value={form.church_name || ""} onChange={(v) => update("church_name", v)} />
      <Input label="Διεύθυνση εκκλησίας" value={form.church_address || ""} onChange={(v) => update("church_address", v)} />
      <Input label="Link εκκλησίας" value={form.church_map_url || ""} onChange={(v) => update("church_map_url", v)} />

      {/* VENUE */}
      <Input label="Κέντρο" value={form.venue_name || ""} onChange={(v) => update("venue_name", v)} />
      <Input label="Διεύθυνση κέντρου" value={form.venue_address || ""} onChange={(v) => update("venue_address", v)} />
      <Input label="Link κέντρου" value={form.venue_map_url || ""} onChange={(v) => update("venue_map_url", v)} />

      {/* IMAGES */}
      <h3 style={{ marginTop: 20 }}>Εικόνες</h3>

      <ImageUpload label="Προσκλητήριο" onUpload={(url) => update("invite_image_url", url)} />
      <ImageUpload label="Εκκλησία" onUpload={(url) => update("church_card_image_url", url)} />
      <ImageUpload label="Κέντρο" onUpload={(url) => update("venue_card_image_url", url)} />
      <ImageUpload label="RSVP" onUpload={(url) => update("rsvp_image_url", url)} />

      {/* PREVIEW */}
      <div style={previewGrid}>
        {form.invite_image_url && <Preview title="Προσκλητήριο" src={form.invite_image_url} />}
        {form.church_card_image_url && <Preview title="Εκκλησία" src={form.church_card_image_url} />}
        {form.venue_card_image_url && <Preview title="Κέντρο" src={form.venue_card_image_url} />}
        {form.rsvp_image_url && <Preview title="RSVP" src={form.rsvp_image_url} />}
      </div>

      {/* TOKEN */}
      <Input label="Token" value={form.share_token || ""} onChange={(v) => update("share_token", v)} />

      <button style={btn} onClick={() => update("share_token", generateToken())}>
        Generate Token
      </button>

      <div style={linkBox}>{publicLink}</div>

      <button style={btn} onClick={save}>Save</button>

      {msg && <div>{msg}</div>}
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
        <div>{label}</div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 10,
            border: "1px solid #ccc",
          }}
        />
      </div>
    );
  }

function Preview({ title, src }: any) {
  return (
    <div>
      <div>{title}</div>
      <img src={src} style={{ width: 150, borderRadius: 10 }} />
    </div>
  );
}

const previewGrid = {
  display: "flex",
  gap: 10,
  marginTop: 10,
};

const card = {
  background: "white",
  padding: 20,
  borderRadius: 16,
};

const btn = {
  marginTop: 10,
  padding: 10,
  borderRadius: 10,
  background: "#e6d3c3",
  border: "none",
};

const linkBox = {
  marginTop: 10,
};