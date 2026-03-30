"use client";

import CalendarButtons from "@/components/CalendarButtons";
import { useState, type FormEvent } from "react";

type AttendanceOption =
  | "Όχι"
  | "Ναι, μόνο στην τελετή"
  | "Ναι, μόνο στην δεξίωση"
  | "Ναι, στην τελετή και στην δεξίωση";

export default function RSVPForm({
  slug,
  t,
}: {
  slug: string;
  t: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attending, setAttending] =
    useState<AttendanceOption>("Ναι, στην τελετή και στην δεξίωση");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [allergies, setAllergies] = useState("");
  const [loading, setLoading] = useState(false);

  const isComing = attending !== "Όχι";

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
      const payload = {
        slug,
        name: name.trim(),
        phone: phone.trim(),
        attending: attending !== "Όχι",
        attendance_label: attending,
        ceremony:
          attending === "Ναι, μόνο στην τελετή" ||
          attending === "Ναι, στην τελετή και στην δεξίωση",
        reception:
          attending === "Ναι, μόνο στην δεξίωση" ||
          attending === "Ναι, στην τελετή και στην δεξίωση",
        guests: isComing ? Number(adults || 0) + Number(children || 0) : 0,
        adults: isComing ? Number(adults) || 0 : 0,
        children: isComing ? Number(children) || 0 : 0,
        allergies: isComing ? allergies.trim() : "",
      };

      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        alert(
          "Σφάλμα στο RSVP:\n" +
            (data?.error || JSON.stringify(data) || "Unknown error")
        );
        return;
      }

      alert("Ευχαριστούμε! Καταχωρήθηκε 💛");

      setName("");
      setPhone("");
      setAttending("Ναι, στην τελετή και στην δεξίωση");
      setAdults(1);
      setChildren(0);
      setAllergies("");
    } catch (err: any) {
      alert("Κάτι πήγε στραβά:\n" + (err?.message || String(err)));
    } finally {
      setLoading(false);
    }
  }

  const boxStyle: React.CSSProperties = {
    padding: 0,
    border: "none",
    maxWidth: 420,
  };

  const radioRow: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    fontSize: 14,
  };

  const twoCols: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 10,
  };

  return (
    <div>
      <CalendarButtons slug={slug} t={t} mode="inline" />

      <form onSubmit={submitRSVP} style={boxStyle}>
        <label style={{ display: "block", marginTop: 10 }}>Ονοματεπώνυμο</label>
        <input
          className="e-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="π.χ. Γιώργος Παπαδόπουλος"
        />

        <label style={{ display: "block", marginTop: 12 }}>Κινητό τηλέφωνο</label>
        <input
          className="e-input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="π.χ. 69xxxxxxxx"
        />

        <div style={{ marginTop: 14, fontWeight: 600 }}>Θα παρευρεθείς;</div>

        <label style={radioRow}>
          <input
            type="radio"
            name="attendance"
            value="Όχι"
            checked={attending === "Όχι"}
            onChange={(e) => setAttending(e.target.value as AttendanceOption)}
          />
          Δυστυχώς δεν θα μπορέσω
        </label>

        <label style={radioRow}>
          <input
            type="radio"
            name="attendance"
            value="Ναι, μόνο στην τελετή"
            checked={attending === "Ναι, μόνο στην τελετή"}
            onChange={(e) => setAttending(e.target.value as AttendanceOption)}
          />
          Ναι, μόνο στην τελετή
        </label>

        <label style={radioRow}>
          <input
            type="radio"
            name="attendance"
            value="Ναι, μόνο στην δεξίωση"
            checked={attending === "Ναι, μόνο στην δεξίωση"}
            onChange={(e) => setAttending(e.target.value as AttendanceOption)}
          />
          Ναι, μόνο στην δεξίωση
        </label>

        <label style={radioRow}>
          <input
            type="radio"
            name="attendance"
            value="Ναι, στην τελετή και στην δεξίωση"
            checked={attending === "Ναι, στην τελετή και στην δεξίωση"}
            onChange={(e) => setAttending(e.target.value as AttendanceOption)}
          />
          Ναι, στην τελετή και στην δεξίωση
        </label>

        {isComing && (
          <>
            <div style={{ ...twoCols, marginTop: 14 }}>
              <div>
                <label style={{ display: "block", marginBottom: 6 }}>
                  Ενήλικες (πόσοι)
                </label>
                <input
                  className="e-input"
                  type="number"
                  min={1}
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: 6 }}>
                  Παιδιά (πόσα)
                </label>
                <input
                  className="e-input"
                  type="number"
                  min={0}
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                />
              </div>
            </div>

            <label style={{ display: "block", marginTop: 12 }}>
              Σχόλια / Παρατηρήσεις
            </label>
            <input
              className="e-input"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="π.χ. αλλεργίες, ειδικές πληροφορίες, σχόλια"
            />
          </>
        )}

        <button
          type="submit"
          className="e-btn"
          style={{ marginTop: 14 }}
          disabled={loading}
        >
          {loading ? "Αποστολή..." : "Αποστολή RSVP"}
        </button>
      </form>
    </div>
  );
}