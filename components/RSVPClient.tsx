"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  slug: string;
  t: string;
};

export default function RSVPClient({ slug, t }: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [guests, setGuests] = useState(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // ✅ Αν έχεις άλλο endpoint, άλλαξε αυτό:
  const POST_URL = "/api/public/rsvp";

  const safeSlug = useMemo(() => encodeURIComponent(slug), [slug]);
  const safeT = useMemo(() => encodeURIComponent(t || ""), [t]);

  async function submit() {
    setMsg(null);

    if (!name.trim()) {
      setMsg("Γράψε ονοματεπώνυμο 🙂");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(POST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          t,
          name: name.trim(),
          attending,
          guests,
          notes: notes.trim(),
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Submit failed");
      }

      setMsg("✅ Καταχωρήθηκε! Ευχαριστούμε 💌");
    } catch (e: any) {
      setMsg(
        "❌ Δεν έγινε υποβολή. Αν έχεις άλλο endpoint για RSVP, πες μου ποιο είναι για να το βάλω σωστά."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={page}>
      <div style={card}>
        <div style={title}>RSVP</div>
        <div style={sub}>
          Συμπλήρωσε την επιβεβαίωση παρουσίας σου.
        </div>

        <div style={row}>
          <label style={label}>Ονοματεπώνυμο</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={input}
            placeholder="π.χ. Μαρία Σταυριανάκου"
          />
        </div>

        <div style={row}>
          <label style={label}>Θα παρευρεθείς;</label>
          <div style={seg}>
            <button
              type="button"
              onClick={() => setAttending("yes")}
              style={attending === "yes" ? segOn : segOff}
            >
              Ναι
            </button>
            <button
              type="button"
              onClick={() => setAttending("no")}
              style={attending === "no" ? segOn : segOff}
            >
              Όχι
            </button>
          </div>
        </div>

        <div style={row}>
          <label style={label}>Άτομα</label>
          <input
            type="number"
            min={1}
            max={20}
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value || 1))}
            style={input}
          />
        </div>

        <div style={row}>
          <label style={label}>Σημειώσεις</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={textarea}
            placeholder="Αλλεργίες, σχόλια κλπ."
          />
        </div>

        {msg ? <div style={msgStyle}>{msg}</div> : null}

        <div style={actions}>
          <button
            type="button"
            onClick={() => router.push(`/vaftisi/section?t=${safeT}`)}
            style={ghost}
            disabled={loading}
          >
            Πίσω
          </button>

          <button type="button" onClick={submit} style={primary} disabled={loading}>
            {loading ? "Αποστολή..." : "Υποβολή"}
          </button>
        </div>

        <div style={tiny}>
          debug: /e/{safeSlug}/rsvp?t={safeT}
        </div>
      </div>
    </div>
  );
}

/* styles */
const page: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: 18,
  background: "linear-gradient(180deg, #f4f0f2, #efe9ec)",
};

const card: React.CSSProperties = {
  width: "min(560px, 92vw)",
  borderRadius: 20,
  padding: 18,
  background: "rgba(255,255,255,0.85)",
  border: "1px solid rgba(0,0,0,0.08)",
  boxShadow: "0 18px 60px rgba(0,0,0,0.12)",
  backdropFilter: "blur(8px)",
};

const title: React.CSSProperties = { fontSize: 26, fontWeight: 900, color: "#2a2226" };
const sub: React.CSSProperties = { marginTop: 6, opacity: 0.75, color: "#2a2226" };

const row: React.CSSProperties = { marginTop: 14, display: "grid", gap: 8 };
const label: React.CSSProperties = { fontWeight: 800, color: "#2a2226" };

const input: React.CSSProperties = {
  padding: "12px 12px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.12)",
  outline: "none",
  fontSize: 14,
};

const textarea: React.CSSProperties = {
  ...input,
  minHeight: 90,
  resize: "vertical",
};

const seg: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 };

const segOn: React.CSSProperties = {
  padding: "12px 12px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(110,90,99,0.12)",
  fontWeight: 900,
  cursor: "pointer",
};

const segOff: React.CSSProperties = {
  ...segOn,
  background: "rgba(255,255,255,0.7)",
  fontWeight: 800,
};

const actions: React.CSSProperties = { marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 };

const primary: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "none",
  background: "#6e5a63",
  color: "white",
  fontWeight: 900,
  cursor: "pointer",
};

const ghost: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(255,255,255,0.7)",
  color: "#2a2226",
  fontWeight: 900,
  cursor: "pointer",
};

const msgStyle: React.CSSProperties = {
  marginTop: 12,
  padding: 12,
  borderRadius: 14,
  background: "rgba(0,0,0,0.04)",
  border: "1px solid rgba(0,0,0,0.08)",
  fontWeight: 700,
};

const tiny: React.CSSProperties = { marginTop: 12, fontSize: 12, opacity: 0.55 };