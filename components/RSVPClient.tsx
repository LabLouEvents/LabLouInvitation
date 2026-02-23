"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Attendance =
  | "decline"
  | "ceremony_only"
  | "ceremony_and_reception";

const attendanceLabel: Record<Attendance, string> = {
  decline: "Δυστυχώς δεν θα μπορέσω",
  ceremony_only: "Ναι, μόνο στην τελετή",
  ceremony_and_reception: "Ναι, στην τελετή και στην δεξίωση",
};

function digitsOnly(s: string) {
  return (s || "").replace(/\D+/g, "");
}

/** Επιτρέπει:
 * - 69xxxxxxxx
 * - +3069xxxxxxxx
 * - 003069xxxxxxxx
 */
function normalizeGreekMobile(input: string) {
  const d = digitsOnly(input);

  // +30 / 0030 prefix
  if (d.startsWith("0030")) return `+30 ${d.slice(4)}`;
  if (d.startsWith("30") && d.length >= 12) return `+30 ${d.slice(2)}`;

  // plain 69xxxxxxxx
  if (d.startsWith("69")) return d;

  // fallback: show digits as-is (user still can type)
  return d;
}

function toInt(value: string) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.floor(n));
}

export default function RSVPClient({
  slug,
  t,
  rsvpImageUrl,
}: {
  slug: string;
  t: string;
  rsvpImageUrl?: string;
}) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("ceremony_and_reception");
  const [adults, setAdults] = useState<number>(1);
  const [kids, setKids] = useState<number>(0);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAttending = attendance !== "decline";

  const totalGuests = useMemo(() => {
    if (!isAttending) return 0;
    return Math.max(0, adults) + Math.max(0, kids);
  }, [isAttending, adults, kids]);

  const canSubmit = useMemo(() => {
    const n = name.trim().length > 1;
    const p = digitsOnly(phone).length >= 10; // απλό check για κινητό
    if (!n || !p) return false;

    // αν έρθει, να έχει τουλάχιστον 1 ενήλικα (συνήθως)
    if (isAttending && adults <= 0) return false;

    return true;
  }, [name, phone, isAttending, adults]);

  async function submit() {
    setError(null);

    if (!canSubmit) {
      setError("Συμπλήρωσε ονοματεπώνυμο και έγκυρο κινητό.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        slug,
        t,

        // νέα πεδία
        name: name.trim(),
        phone: normalizeGreekMobile(phone),
        attendance, // "decline" | "ceremony_only" | "ceremony_and_reception"
        adults: isAttending ? adults : 0,
        kids: isAttending ? kids : 0,
        notes: isAttending ? notes.trim() : "",

        // συμβατότητα με το παλιό route (αν δεν το έχεις αλλάξει ακόμα)
        attending: isAttending, // boolean
        guests: totalGuests, // integer
        allergies: isAttending ? notes.trim() : "", // (παλιά στήλη)
      };

      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Κάτι πήγε στραβά. Δοκίμασε ξανά.");
      }

      setDone(true);
    } catch (e: any) {
      setError(e?.message || "Κάτι πήγε στραβά.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={page}>
      <div style={veil} />

      <div style={card}>
      {rsvpImageUrl ? (
  <div style={topImgWrap}>
    <Image
      src={rsvpImageUrl}
      alt="RSVP"
      fill
      priority
      style={{ objectFit: "cover" }}
    />
  </div>
) : null}
      <button
  type="button"
  onClick={() =>
    router.push(`/e/${encodeURIComponent(slug)}/section?t=${encodeURIComponent(t)}`)
  }
  style={backBtn}
>
  Πίσω
</button>
        <div style={title}>RSVP</div>
        <div style={sub}>
          Παρακαλώ συμπλήρωσε τα στοιχεία σου.
        </div>

        {done ? (
          <div style={successBox}>
            <div style={successTitle}>Ευχαριστούμε! ✅</div>
            <div style={successText}>Η απάντησή σου καταχωρήθηκε.</div>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button
                type="button"
                style={btnGhost}
                onClick={() => router.back()}
              >
                Πίσω
              </button>
              <button
                type="button"
                style={btn}
                onClick={() => {
                  // ξανά νέα υποβολή αν χρειαστεί
                  setDone(false);
                  setName("");
                  setPhone("");
                  setAttendance("ceremony_and_reception");
                  setAdults(1);
                  setKids(0);
                  setNotes("");
                  setError(null);
                }}
              >
                Νέα απάντηση
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Ονοματεπώνυμο */}
            <div style={field}>
              <label style={label}>Ονοματεπώνυμο</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="π.χ. Γιώργος Παπαδόπουλος"
                style={input}
                autoComplete="name"
              />
            </div>

            {/* Κινητό */}
            <div style={field}>
              <label style={label}>Κινητό τηλέφωνο</label>
              <input
                value={phone}
                onChange={(e) => setPhone(normalizeGreekMobile(e.target.value))}
                placeholder="π.χ. 69xxxxxxxx ή +30 69xxxxxxxx"
                style={input}
                inputMode="tel"
                autoComplete="tel"
              />
              <div style={hint}>Τα στοιχεία χρησιμοποιούνται μόνο για την οργάνωση της εκδήλωσης.</div>
            </div>

            {/* Παρουσία */}
            <div style={field}>
              <label style={label}>Θα παρευρεθείς;</label>

              <div style={radioGroup}>
                {(
                  ["decline", "ceremony_only", "ceremony_and_reception"] as Attendance[]
                ).map((key) => (
                  <label key={key} style={radioRow}>
                    <input
                      type="radio"
                      name="attendance"
                      checked={attendance === key}
                      onChange={() => setAttendance(key)}
                      style={radio}
                    />
                    <span style={radioText}>{attendanceLabel[key]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Μετρήσεις */}
            <div style={twoCols}>
              <div style={field}>
                <label style={label}>Ενήλικοι (πόσοι)</label>
                <input
                  type="number"
                  min={0}
                  value={adults}
                  disabled={!isAttending}
                  onChange={(e) => setAdults(toInt(e.target.value))}
                  style={{ ...input, opacity: isAttending ? 1 : 0.55 }}
                />
              </div>

              <div style={field}>
                <label style={label}>Παιδιά (πόσα)</label>
                <input
                  type="number"
                  min={0}
                  value={kids}
                  disabled={!isAttending}
                  onChange={(e) => setKids(toInt(e.target.value))}
                  style={{ ...input, opacity: isAttending ? 1 : 0.55 }}
                />
              </div>
            </div>

            {/* Σχόλια */}
            <div style={field}>
              <label style={label}>Σχόλια / Παρατηρήσεις</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="π.χ. αλλεργίες, ειδικές πληροφορίες, σχόλια"
                style={textareaStyle}
                rows={4}
                disabled={!isAttending}
              />
            </div>

            {/* Σύνολο */}
            <div style={summaryRow}>
              <div style={summaryLabel}>Σύνολο ατόμων:</div>
              <div style={summaryValue}>{totalGuests}</div>
            </div>

            {error ? <div style={errorBox}>{error}</div> : null}

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button
                type="button"
                style={btnGhost}
                onClick={() => router.back()}
                disabled={loading}
              >
                Πίσω
              </button>

              <button
                type="button"
                style={{
                  ...btn,
                  opacity: loading || !canSubmit ? 0.6 : 1,
                  cursor: loading || !canSubmit ? "not-allowed" : "pointer",
                }}
                onClick={submit}
                disabled={loading || !canSubmit}
              >
                {loading ? "Αποστολή..." : "Αποστολή"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const page: React.CSSProperties = {
  minHeight: "100vh",
  backgroundImage: `url(/intro/background.jpg)`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  position: "relative",
  display: "grid",
  placeItems: "center",
  padding: 20,
};

const backBtn: React.CSSProperties = {
  position: "absolute",
  top: 18,
  right: 18,
  padding: "8px 16px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.1)",
  background: "rgba(255,255,255,0.85)",
  cursor: "pointer",
  fontWeight: 700,
  color: "#444",
};

const veil: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "rgba(255,255,255,0.70)",
  pointerEvents: "none",
};
const topImgWrap: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: 180,
  borderRadius: 18,
  overflow: "hidden",
  marginBottom: 14,
  boxShadow: "0 18px 55px rgba(0,0,0,0.14)",
};
const card: React.CSSProperties = {
  position: "relative",
  width: "min(560px, 92vw)",
  borderRadius: 22,
  padding: 22,
  background: "rgba(255,255,255,0.92)",
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 24px 70px rgba(0,0,0,0.14)",
};

const title: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
  color: "#2b2b2b",
};

const sub: React.CSSProperties = {
  marginTop: 6,
  marginBottom: 18,
  color: "rgba(0,0,0,0.60)",
  fontSize: 14,
  fontWeight: 600,
};

const field: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  marginTop: 12,
};

const label: React.CSSProperties = {
  color: "rgba(0,0,0,0.75)",
  fontSize: 13,
  fontWeight: 800,
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.15)",
  background: "rgba(255,255,255,0.98)",
  color: "#111",
  fontSize: 15,
  outline: "none",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.15)",
  background: "rgba(255,255,255,0.98)",
  color: "#111",
  fontSize: 15,
  outline: "none",
  minHeight: 110,
  resize: "vertical",
  opacity: 1,
};

const hint: React.CSSProperties = {
  marginTop: 2,
  fontSize: 12,
  color: "rgba(0,0,0,0.50)",
  fontWeight: 600,
};

const radioGroup: React.CSSProperties = {
  display: "grid",
  gap: 10,
  marginTop: 4,
};

const radioRow: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  padding: "10px 12px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.08)",
  background: "rgba(255,255,255,0.7)",
};

const radio: React.CSSProperties = {
  marginTop: 2,
};

const radioText: React.CSSProperties = {
  color: "#222",
  fontWeight: 700,
  lineHeight: 1.25,
};

const twoCols: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 12,
  marginTop: 6,
};

const summaryRow: React.CSSProperties = {
  marginTop: 14,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 12px",
  borderRadius: 14,
  background: "rgba(0,0,0,0.04)",
  border: "1px solid rgba(0,0,0,0.06)",
};

const summaryLabel: React.CSSProperties = {
  fontWeight: 900,
  color: "rgba(0,0,0,0.65)",
};

const summaryValue: React.CSSProperties = {
  fontWeight: 900,
  color: "#111",
  fontSize: 16,
};

const btn: React.CSSProperties = {
  flex: 1,
  padding: "12px 14px",
  borderRadius: 16,
  border: "1px solid rgba(0,0,0,0.10)",
  background: "rgba(110,90,99,0.12)",
  color: "#6e5a63",
  fontWeight: 900,
};

const btnGhost: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 16,
  border: "1px solid rgba(0,0,0,0.12)",
  background: "rgba(255,255,255,0.75)",
  color: "#333",
  fontWeight: 900,
  cursor: "pointer",
};

const errorBox: React.CSSProperties = {
  marginTop: 12,
  padding: "10px 12px",
  borderRadius: 14,
  background: "rgba(255, 0, 0, 0.08)",
  border: "1px solid rgba(255, 0, 0, 0.20)",
  color: "#8a1f1f",
  fontWeight: 800,
};

const successBox: React.CSSProperties = {
  marginTop: 10,
  padding: "14px 12px",
  borderRadius: 18,
  background: "rgba(0, 150, 90, 0.08)",
  border: "1px solid rgba(0, 150, 90, 0.18)",
};

const successTitle: React.CSSProperties = {
  fontWeight: 1000,
  color: "#0b5b3a",
  fontSize: 16,
};

const successText: React.CSSProperties = {
  marginTop: 4,
  color: "rgba(0,0,0,0.65)",
  fontWeight: 700,
};