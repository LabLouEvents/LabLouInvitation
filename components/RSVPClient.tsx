"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RSVPClient({ slug, t }: { slug: string; t: string }) {
  const router = useRouter();

  const BG = "/intro/background.jpg";
  const FADE = 0.72;

  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [guests, setGuests] = useState(1);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

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
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Κάτι πήγε στραβά");

      setMsg("✅ Καταχωρήθηκε!");
      setTimeout(() => {
        router.push(`/e/${encodeURIComponent(slug)}/section?t=${encodeURIComponent(t)}`);
      }, 900);
    } catch (e: any) {
      setMsg(`❌ ${e?.message || "Σφάλμα"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={page(BG)}>
      <div style={veil(FADE)} />
      <div style={{ position: "relative", width: "min(520px, 92vw)" }}>
        <div style={card}>
          <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 10, textShadow: "0 2px 10px rgba(0,0,0,0.25)" }}>
            RSVP
          </div>

          <label style={lbl}>Όνομα</label>
          <input style={inp} value={name} onChange={(e) => setName(e.target.value)} />

          <div style={{ height: 10 }} />

          <label style={lbl}>Θα έρθω</label>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={() => setAttending("yes")} style={pill(attending === "yes")}>
              Ναι
            </button>
            <button type="button" onClick={() => setAttending("no")} style={pill(attending === "no")}>
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

          <button
            type="button"
            onClick={() => router.back()}
            style={{
              marginTop: 10,
              width: "100%",
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.10)",
              color: "white",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            Πίσω
          </button>

          {msg ? <div style={{ marginTop: 10, opacity: 0.95 }}>{msg}</div> : null}
        </div>
      </div>
    </div>
  );
}

function page(bgUrl: string): React.CSSProperties {
  return {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: 18,
    backgroundImage: `url(${bgUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    position: "relative",
    overflow: "hidden",
  };
}

function veil(fade: number): React.CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    background: `rgba(255,255,255,${fade})`,
    pointerEvents: "none",
  };
}

const card: React.CSSProperties = {
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.10)",
  padding: 16,
  color: "white",
  backdropFilter: "blur(10px)",
  boxShadow: "0 18px 60px rgba(0,0,0,0.18)",
};

const lbl: React.CSSProperties = { fontSize: 12, opacity: 0.85, textShadow: "0 2px 10px rgba(0,0,0,0.25)" };

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
  background: "rgba(255,255,255,0.92)",
  color: "#111",
  fontWeight: 900,
  cursor: "pointer",
};

const pill = (active: boolean): React.CSSProperties => ({
  padding: "10px 12px",
  borderRadius: 999,
  border: "1px solid rgba(255,255,255,0.18)",
  background: active ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.18)",
  color: active ? "#111" : "white",
  fontWeight: 900,
  cursor: "pointer",
});