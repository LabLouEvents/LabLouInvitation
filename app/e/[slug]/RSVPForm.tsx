"use client";

import CalendarButtons from "@/components/CalendarButtons";
import { useState, type FormEvent } from "react";

export default function RSVPForm({
  slug,
  t,
}: {
  slug: string;
  t: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attending, setAttending] = useState("Ναι");
  const [loading, setLoading] = useState(false);

  async function submitRSVP(e: FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Γράψε ονοματεπώνυμο 🙂");
      return;
    }

    if (!phone.trim()) {
      alert("Γράψε κινητό 🙂");
      return;
    }

    setLoading(true);

    try {
      await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, name, phone, attending }),
      });

      alert("Ευχαριστούμε! 💛");

      setName("");
      setPhone("");
      setAttending("Ναι");
    } catch (err: any) {
      alert("Σφάλμα");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto" }}>
      {/* 👉 ΕΔΩ ΜΠΑΙΝΟΥΝ ΤΑ BUTTONS */}
      <CalendarButtons slug={slug} t={t} mode="inline" />

      <form onSubmit={submitRSVP}>
        <label>Ονοματεπώνυμο</label>
        <input
          className="e-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Κινητό</label>
        <input
          className="e-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label>Θα παρευρεθείς;</label>

        <select
          className="e-select"
          value={attending}
          onChange={(e) => setAttending(e.target.value)}
        >
          <option value="Όχι">Όχι</option>
          <option value="Ναι, μόνο στην τελετή">Ναι, μόνο στην τελετή</option>
          <option value="Ναι, μόνο στην δεξίωση">Ναι, μόνο στην δεξίωση</option>
          <option value="Ναι, και στα δύο">Ναι, και στα δύο</option>
        </select>

        <button className="e-btn" type="submit" disabled={loading}>
          {loading ? "..." : "Αποστολή"}
        </button>
      </form>
    </div>
  );
}