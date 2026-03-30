"use client";

import CalendarButtons from "@/components/CalendarButtons";
import { useState, type FormEvent } from "react";

type AttendanceOption =
  | "Ναι"
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
  const [guests, setGuests] = useState(1);
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
          attending === "Ναι" ||
          attending === "Ναι, στην τελετή και στην δεξίωση",
        guests: isComing ? Number(guests) || 1 : 0,
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
      setGuests(1);
      setAllergies("");
    } catch (err: any) {
      alert("Κάτι πήγε στραβά:\n" + (err?.message || String(err)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <CalendarButtons slug={slug} t={t} mode="inline" />

      <form
        onSubmit={submitRSVP}
        style={{ padding: 0, border: "none", maxWidth: 420 }}
      >
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

<label style={{ display: "block", marginTop: 12 }}>TEST RSVP 999</label>
        <select
          className="e-select"
          value={attending}
          onChange={(e) => setAttending(e.target.value as AttendanceOption)}
        >
          <option value="Όχι">Δυστυχώς δεν θα μπορέσω</option>
          <option value="Ναι, μόνο στην τελετή">Ναι, μόνο στην τελετή</option>
          <option value="Ναι, μόνο στην δεξίωση">Ναι, μόνο στην δεξίωση</option>
          <option value="Ναι, στην τελετή και στην δεξίωση">
            Ναι, στην τελετή και στην δεξίωση
          </option>
        </select>

        {isComing && (
          <>
            <label style={{ display: "block", marginTop: 12 }}>
              Πόσα άτομα θα είστε;
            </label>
            <input
              className="e-input"
              type="number"
              min={1}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
            />

            <label style={{ display: "block", marginTop: 12 }}>
              Διατροφικές αλλεργίες (αν υπάρχουν)
            </label>
            <input
              className="e-input"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              placeholder="π.χ. ξηροί καρποί"
            />
          </>
        )}

        <button
          type="submit"
          className="e-btn"
          style={{ marginTop: 12 }}
          disabled={loading}
        >
          {loading ? "Αποστολή..." : "Αποστολή RSVP"}
        </button>
      </form>
    </>
  );
}