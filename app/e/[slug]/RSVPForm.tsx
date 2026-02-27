"use client";

import CalendarButtons from "@/components/CalendarButtons";
import { useState, type FormEvent } from "react";

export default function RSVPForm({ slug, t }: { slug: string; t: string }) {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"Ναι" | "Όχι">("Ναι");
  const [guests, setGuests] = useState(1);
  const [allergies, setAllergies] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitRSVP(e: FormEvent) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Γράψε ονοματεπώνυμο 🙂");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        slug,
        t,
        name: name.trim(),
        attending: attending === "Ναι", // boolean
        guests: attending === "Ναι" ? Number(guests) || 1 : 0,
        allergies: attending === "Ναι" ? allergies.trim() : "",
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
      setAttending("Ναι");
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
      <CalendarButtons slug={slug} t={t} />
  
      <form
        onSubmit={submitRSVP}
        style={{ padding: 0, border: "none", maxWidth: 420 }}
      >
        <label style={{ display: "block", marginTop: 10 }}>
          Ονοματεπώνυμο
        </label>
  
        <input
          className="e-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Γιώργος Παπαδόπουλος"
        />
  
        <label style={{ display: "block", marginTop: 12 }}>
          Θα παρευρεθεί;
        </label>
  
        <select
          className="e-select"
          value={attending}
          onChange={(e) =>
            setAttending(e.target.value as "Ναι" | "Όχι")
          }
        >
          <option value="Ναι">Ναι</option>
          <option value="Όχι">Όχι</option>
        </select>
  
        {attending === "Ναι" && (
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