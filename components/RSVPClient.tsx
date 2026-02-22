"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RSVPClient({ slug, t }: { slug: string; t: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [guests, setGuests] = useState(1);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const submit = async () => {
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          t,
          name,
          attending: attending === "yes",
          guests,
          note,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Κάτι πήγε στραβά");

      setMsg("✅ Καταχωρήθηκε!");
      setTimeout(() => router.push(`/e/${encodeURIComponent(slug)}/section?t=${encodeURIComponent(t)}`), 900);
    } catch (e: any) {
      setMsg(`❌ ${e?.message || "Σφάλμα"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 10 }}>RSVP</div>

        <label style={lbl}>Όνομα</label>
        <input style={inp} value={name} onChange={(e) => setName(e.target.value)} />

        <div style={{ height: 10 }} />

        <label style={lbl}>Θα έρθω</label>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            onClick={() => setAttending("yes")}
            style={pill(attending === "yes")}
          >
            Ναι
          </button>
          <button
            type="button"
            onClick={() => setAttending("no")}
            style={pill(attending === "no")}
          >
            Όχι
          </button>
        </div>

        <div style={{ height: 10 }} />

        <label style={lbl}>Άτομα</label>
        <input
          style={inp}
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value || 1))}
        />

        <div style={{ height: 10 }} />

        <label style={lbl}>Σημείωση</label>
        <textarea style={{ ...inp, height: 90 }} value={note} onChange={(e) => setNote(e.target.value)} />

        <div style={{ height: 14 }} />

        <button type="button" onClick={submit} disabled={loading || !name.trim()} style={btn}>
          {loading ? "Αποστολή…" : "Υποβολή"}
        </button>

        {msg ? <div style={{ marginTop: 10, opacity: 0.9 }}>{msg}</div> : null}
      </div>
    </div>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: 18,
  background: "#0b1220",
};

const card: React.CSSProperties = {
  width: "min(520px, 92vw)",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.06)",
  padding: 16,
  color: "white",
};

const lbl: React.CSSProperties = { fontSize: 12, opacity: 0.8 };

const inp: React.CSSProperties = {
  width: "100%",
  marginTop: 6,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(0,0,0,0.18)",
  color: "white",
  padding: "10px 12px",
  outline: "none",
};

const btn: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.9)",
  color: "#111",
  fontWeight: 900,
  cursor: "pointer",
};

const pill = (active: boolean): React.CSSProperties => ({
  padding: "10px 12px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.18)",
  background: active ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.18)",
  color: active ? "#111" : "white",
  fontWeight: 900,
  cursor: "pointer",
});