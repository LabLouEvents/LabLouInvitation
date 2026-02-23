"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Props = { slug: string; t: string };

type AttendanceChoice =
  | "Δυστυχώς δεν θα μπορέσω"
  | "Ναι, μόνο στην τελετή"
  | "Ναι, στην τελετή και στην δεξίωση";

export default function RSVPClient({ slug }: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attendance, setAttendance] = useState<AttendanceChoice>(
    "Ναι, στην τελετή και στην δεξίωση"
  );

  const [adults, setAdults] = useState(1);
  const [kids, setKids] = useState(0);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const isDecline = attendance === "Δυστυχώς δεν θα μπορέσω";

  const totalPeople = useMemo(() => {
    const a = Number.isFinite(adults) ? adults : 0;
    const k = Number.isFinite(kids) ? kids : 0;
    return Math.max(0, a) + Math.max(0, k);
  }, [adults, kids]);

  const canSubmit = useMemo(() => {
    if (!name.trim()) return false;
    // κινητό: δεν κάνουμε πολύ αυστηρό regex για να μη σπάει με +30 / κενά
    if (!phone.trim()) return false;

    if (isDecline) return true;

    // αν έρθει, πρέπει να υπάρχει τουλάχιστον 1 άτομο (συνήθως)
    if (totalPeople < 1) return false;

    return true;
  }, [name, phone, isDecline, totalPeople]);

  const clampInt = (n: number, min: number, max: number) => {
    const x = Math.round(Number(n));
    if (!Number.isFinite(x)) return min;
    return Math.min(max, Math.max(min, x));
  };

  const normalizePhone = (v: string) =>
    v
      .replace(/[^\d+ ]/g, "") // αφήνει νούμερα, +, κενά
      .replace(/\s+/g, " ")
      .trim();

  async function submit() {
    setErr(null);

    if (!canSubmit) {
      setErr("Συμπλήρωσε όνομα και κινητό. Αν έρχεσαι, συμπλήρωσε και άτομα.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        slug,
        name: name.trim(),
        phone: normalizePhone(phone),
        attendance, // <-- νέο
        // κρατάμε και attending boolean για συμβατότητα αν θες
        attending: !isDecline,

        adults: isDecline ? 0 : clampInt(adults, 0, 20),
        kids: isDecline ? 0 : clampInt(kids, 0, 20),

        // αν θες συνολικό για εύκολα reports:
        peopleCount: isDecline ? 0 : clampInt(totalPeople, 0, 40),

        notes: isDecline ? "" : notes.trim(),
      };

      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Κάτι πήγε στραβά. Δοκίμασε ξανά.");
      }

      setDone(true);
    } catch (e: any) {
      setErr(e?.message || "Κάτι πήγε στραβά.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={page}>
      <div style={card}>
        <div style={title}>RSVP</div>
        <div style={sub}>Παρακαλώ συμπλήρωσε τα στοιχεία σου.</div>

        <div style={field}>
          <label style={label}>Ονοματεπώνυμο</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="π.χ. Μαρία Σταυριανάκου"
            style={input}
          />
        </div>
        
        const textarea: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.15)",
  background: "rgba(255,255,255,0.95)",
  color: "#111",
  fontSize: 15,
  outline: "none",
  minHeight: 110,
  resize: "vertical",
};

        <div style={field}>
          <label style={label}>Κινητό τηλέφωνο</label>
          <input
            value={phone}
            onChange={(e) => setPhone(normalizePhone(e.target.value))}
            placeholder="π.χ. 69XXXXXXXX ή +30 69XXXXXXXX"
            inputMode="tel"
            style={input}
          />
        </div>

        <div style={field}>
          <label style={label}>Θα παρευρεθείς;</label>
          <div style={choiceWrap}>
            {(
              [
                "Δυστυχώς δεν θα μπορέσω",
                "Ναι, μόνο στην τελετή",
                "Ναι, στην τελετή και στην δεξίωση",
              ] as AttendanceChoice[]
            ).map((opt) => {
              const active = attendance === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setAttendance(opt)}
                  style={{
                    ...choiceBtn,
                    ...(active ? choiceBtnActive : null),
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {!isDecline && (
          <>
            <div style={row2}>
              <div style={field}>
                <label style={label}>Ενήλικοι</label>
                <div style={counter}>
                  <button
                    type="button"
                    style={counterBtn}
                    onClick={() => setAdults((v) => clampInt(v - 1, 0, 20))}
                  >
                    −
                  </button>
                  <input
                    value={String(adults)}
                    onChange={(e) => setAdults(clampInt(Number(e.target.value), 0, 20))}
                    inputMode="numeric"
                    style={counterInput}
                  />
                  <button
                    type="button"
                    style={counterBtn}
                    onClick={() => setAdults((v) => clampInt(v + 1, 0, 20))}
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={field}>
                <label style={label}>Παιδιά</label>
                <div style={counter}>
                  <button
                    type="button"
                    style={counterBtn}
                    onClick={() => setKids((v) => clampInt(v - 1, 0, 20))}
                  >
                    −
                  </button>
                  <input
                    value={String(kids)}
                    onChange={(e) => setKids(clampInt(Number(e.target.value), 0, 20))}
                    inputMode="numeric"
                    style={counterInput}
                  />
                  <button
                    type="button"
                    style={counterBtn}
                    onClick={() => setKids((v) => clampInt(v + 1, 0, 20))}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div style={field}>
              <label style={label}>Σχόλια / Παρατηρήσεις</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="π.χ. αλλεργίες, ειδικές πληροφορίες, σχόλια"
                style={textarea}
                rows={4}
              />
            </div>
          </>
        )}

        {err ? <div style={errorBox}>{err}</div> : null}

        {!done ? (
          <button
            type="button"
            onClick={submit}
            disabled={loading || !canSubmit}
            style={{
              ...primaryBtn,
              opacity: loading || !canSubmit ? 0.6 : 1,
              cursor: loading || !canSubmit ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Αποστολή..." : "Υποβολή"}
          </button>
        ) : (
          <div style={successBox}>
            ✅ Καταχωρήθηκε!
            <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
              <button type="button" style={ghostBtn} onClick={() => router.back()}>
                Επιστροφή
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const page: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  padding: 20,
  background: "linear-gradient(180deg, rgba(250,250,250,1), rgba(245,245,245,1))",
};

const card: React.CSSProperties = {
  width: "min(560px, 94vw)",
  borderRadius: 22,
  padding: 22,
  background: "rgba(255,255,255,0.88)",
  border: "1px solid rgba(0,0,0,0.08)",
  boxShadow: "0 20px 70px rgba(0,0,0,0.10)",
};

const title: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
  letterSpacing: 0.4,
  color: "#2b2b2b",
};

const sub: React.CSSProperties = {
  marginTop: 6,
  marginBottom: 18,
  opacity: 0.7,
  color: "#2b2b2b",
};

const field: React.CSSProperties = { marginBottom: 14 };

const label: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontWeight: 800,
  fontSize: 13,
  opacity: 0.85,
  color: "#2b2b2b",
};

const input: React.CSSProperties = {
  width: "100%",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.12)",
  padding: "12px 12px",
  fontSize: 14,
  outline: "none",
  background: "rgba(255,255,255,0.9)",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 110,
  resize: "vertical",
};

const choiceWrap: React.CSSProperties = {
  display: "grid",
  gap: 10,
};

const choiceBtn: React.CSSProperties = {
  textAlign: "left",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(255,255,255,0.9)",
  cursor: "pointer",
  fontWeight: 700,
  color: "#2b2b2b",
};

const choiceBtnActive: React.CSSProperties = {
  border: "1px solid rgba(110,90,99,0.35)",
  background: "rgba(110,90,99,0.10)",
};

const row2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
};

const counter: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "44px 1fr 44px",
  gap: 8,
  alignItems: "center",
};

const counterBtn: React.CSSProperties = {
  height: 44,
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(255,255,255,0.9)",
  cursor: "pointer",
  fontSize: 20,
  fontWeight: 900,
  color: "#2b2b2b",
};

const counterInput: React.CSSProperties = {
  height: 44,
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.12)",
  textAlign: "center",
  fontWeight: 900,
  fontSize: 16,
  outline: "none",
  background: "rgba(255,255,255,0.9)",
};

const primaryBtn: React.CSSProperties = {
  width: "100%",
  marginTop: 8,
  padding: "12px 14px",
  borderRadius: 16,
  border: "1px solid rgba(110,90,99,0.25)",
  background: "rgba(110,90,99,0.12)",
  color: "#2b2b2b",
  fontWeight: 900,
};

const errorBox: React.CSSProperties = {
  marginTop: 8,
  marginBottom: 8,
  padding: "10px 12px",
  borderRadius: 14,
  background: "rgba(255, 90, 90, 0.12)",
  border: "1px solid rgba(255, 90, 90, 0.22)",
  color: "#7a1f1f",
  fontWeight: 700,
};

const successBox: React.CSSProperties = {
  marginTop: 8,
  padding: "12px 14px",
  borderRadius: 16,
  background: "rgba(80, 200, 120, 0.12)",
  border: "1px solid rgba(80, 200, 120, 0.22)",
  color: "#1f5a34",
  fontWeight: 900,
};

const ghostBtn: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(255,255,255,0.8)",
  cursor: "pointer",
  fontWeight: 800,
};