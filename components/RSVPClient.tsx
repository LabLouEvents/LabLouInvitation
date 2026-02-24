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

function normalizeGreekMobile(input: string) {
  const d = digitsOnly(input);
  if (d.startsWith("0030")) return `+30 ${d.slice(4)}`;
  if (d.startsWith("30") && d.length >= 12) return `+30 ${d.slice(2)}`;
  if (d.startsWith("69")) return d;
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
  const [attendance, setAttendance] =
    useState<Attendance>("ceremony_and_reception");
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
    const p = digitsOnly(phone).length >= 10;
    if (!n || !p) return false;
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
        name: name.trim(),
        phone: normalizeGreekMobile(phone),
        attendance,
        adults: isAttending ? adults : 0,
        kids: isAttending ? kids : 0,
        notes: isAttending ? notes.trim() : "",
        attending: isAttending,
        guests: totalGuests,
        allergies: isAttending ? notes.trim() : "",
      };

      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Κάτι πήγε στραβά.");
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
              quality={100}
              sizes="(max-width:768px) 92vw, 560px"
              style={{ objectFit: "contain" }}
            />
          </div>
        ) : null}

        <button
          type="button"
          onClick={() =>
            router.push(
              `/e/${encodeURIComponent(slug)}/section?t=${encodeURIComponent(
                t
              )}`
            )
          }
          style={backBtn}
        >
          Πίσω
        </button>

        <div style={title}>RSVP</div>
        <div style={sub}>Παρακαλώ συμπλήρωσε τα στοιχεία σου.</div>

        {done ? (
          <div style={successBox}>
            <div style={successTitle}>Ευχαριστούμε! ✅</div>
            <div style={successText}>Η απάντησή σου καταχωρήθηκε.</div>
          </div>
        ) : (
          <>
            <div style={field}>
              <label style={label}>Ονοματεπώνυμο</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="π.χ. Γιώργος Παπαδόπουλος"
                style={input}
              />
            </div>

            <div style={field}>
              <label style={label}>Κινητό τηλέφωνο</label>
              <input
                value={phone}
                onChange={(e) =>
                  setPhone(normalizeGreekMobile(e.target.value))
                }
                placeholder="69xxxxxxxx"
                style={input}
              />
            </div>

            {error && <div style={errorBox}>{error}</div>}

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button
                type="button"
                style={btn}
                disabled={!canSubmit || loading}
                onClick={submit}
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
  display: "grid",
  placeItems: "center",
  padding: 20,
  position: "relative",
};

const veil: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "rgba(255,255,255,0.7)",
};

const card: React.CSSProperties = {
  position: "relative",
  width: "min(560px,92vw)",
  background: "white",
  borderRadius: 22,
  padding: 22,
  boxShadow: "0 24px 70px rgba(0,0,0,0.14)",
};

const topImgWrap: React.CSSProperties = {
  position: "relative",
  width: "100%",
  height: 220,
  borderRadius: 18,
  overflow: "hidden",
  marginBottom: 14,
  background: "white",
};

const backBtn: React.CSSProperties = {
  position: "absolute",
  top: 18,
  right: 18,
  padding: "8px 16px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.1)",
  background: "rgba(255,255,255,0.9)",
  cursor: "pointer",
  fontWeight: 700,
};

const title: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 900,
};

const sub: React.CSSProperties = {
  marginTop: 6,
  marginBottom: 18,
  color: "rgba(0,0,0,0.6)",
};

const field: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  marginTop: 12,
};

const label: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
};

const input: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid rgba(0,0,0,0.15)",
};

const btn: React.CSSProperties = {
  flex: 1,
  padding: "12px 14px",
  borderRadius: 16,
  border: "none",
  background: "#6e5a63",
  color: "white",
  fontWeight: 900,
  cursor: "pointer",
};

const errorBox: React.CSSProperties = {
  marginTop: 12,
  padding: 10,
  borderRadius: 12,
  background: "rgba(255,0,0,0.08)",
  color: "#8a1f1f",
};

const successBox: React.CSSProperties = {
  marginTop: 12,
  padding: 14,
  borderRadius: 16,
  background: "rgba(0,150,90,0.1)",
};

const successTitle: React.CSSProperties = {
  fontWeight: 900,
  color: "#0b5b3a",
};

const successText: React.CSSProperties = {
  marginTop: 4,
};