"use client";

import { useState } from "react";

export default function AdminEventsPage() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    slug: "",
    template: "elegant",
    title: "",
    subtitle: "",
    cover_image: "",

    church_name: "",
    church_address: "",
    church_map_url: "",

    venue_name: "",
    venue_address: "",
    venue_map_url: "",

    start_iso: "",
    end_iso: "",
    rsvp_deadline: "",
    extra_note: "",
  });

  function set(key: string, val: string) {
    setForm((p) => ({ ...p, [key]: val }));
  }

  async function submit() {
    if (!form.slug.trim() || !form.title.trim()) {
      alert("Θέλω τουλάχιστον slug + τίτλο 🙂");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert("Σφάλμα:\n" + (data?.error || "Unknown"));
        return;
      }

      alert("✅ Event δημιουργήθηκε!\nLink: /e/" + form.slug.trim());
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 780, margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>Νέο Event</h1>

      <div className="e-card" style={{ display: "grid", gap: 12 }}>
        <label>
          Slug (π.χ. nikolas-12-7-2026)
          <input className="e-input" value={form.slug} onChange={(e) => set("slug", e.target.value)} />
        </label>

        <label>
          Template
          <select className="e-select" value={form.template} onChange={(e) => set("template", e.target.value)}>
            <option value="elegant">elegant</option>
            <option value="playful">playful</option>
          </select>
        </label>

        <label>
          Τίτλος
          <input className="e-input" value={form.title} onChange={(e) => set("title", e.target.value)} />
        </label>

        <label>
          Υπότιτλος
          <input className="e-input" value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
        </label>

        <label>
          Cover image (προς το παρόν URL ή /invites/xxx.jpg)
          <input className="e-input" value={form.cover_image} onChange={(e) => set("cover_image", e.target.value)} />
        </label>

        <hr />

        <label>
          Εκκλησία (όνομα)
          <input className="e-input" value={form.church_name} onChange={(e) => set("church_name", e.target.value)} />
        </label>

        <label>
          Εκκλησία (διεύθυνση)
          <input className="e-input" value={form.church_address} onChange={(e) => set("church_address", e.target.value)} />
        </label>

        <label>
          Link χάρτη Εκκλησίας (Google Maps)
          <input className="e-input" value={form.church_map_url} onChange={(e) => set("church_map_url", e.target.value)} />
        </label>

        <hr />

        <label>
          Κέντρο (όνομα)
          <input className="e-input" value={form.venue_name} onChange={(e) => set("venue_name", e.target.value)} />
        </label>

        <label>
          Κέντρο (διεύθυνση)
          <input className="e-input" value={form.venue_address} onChange={(e) => set("venue_address", e.target.value)} />
        </label>

        <label>
          Link χάρτη Κέντρου
          <input className="e-input" value={form.venue_map_url} onChange={(e) => set("venue_map_url", e.target.value)} />
        </label>

        <hr />

        <label>
          Start ISO (π.χ. 2026-07-12T18:30:00+03:00)
          <input className="e-input" value={form.start_iso} onChange={(e) => set("start_iso", e.target.value)} />
        </label>

        <label>
          End ISO
          <input className="e-input" value={form.end_iso} onChange={(e) => set("end_iso", e.target.value)} />
        </label>

        <label>
          RSVP deadline (π.χ. 01/07/2026)
          <input className="e-input" value={form.rsvp_deadline} onChange={(e) => set("rsvp_deadline", e.target.value)} />
        </label>

        <label>
          Extra note
          <input className="e-input" value={form.extra_note} onChange={(e) => set("extra_note", e.target.value)} />
        </label>

        <button className="e-btn" type="button" onClick={submit} disabled={loading}>
          {loading ? "Αποθήκευση..." : "Δημιουργία Event"}
        </button>
      </div>
    </div>
  );
}