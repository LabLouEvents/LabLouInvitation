import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { ok: false, error: "Missing Supabase env vars" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // ---- helpers ----
    const s = (v: any) => String(v ?? "").trim();
    const n = (v: any) => {
      const num = Number(v);
      return Number.isFinite(num) ? num : 0;
    };

    // ---- fields from client ----
    const slug = s(body.slug);
    const name = s(body.name);
    const phone = s(body.phone);

    const attendanceRaw = s(body.attendance);
    const attendance =
      attendanceRaw ||
      (body.attending === false
        ? "Δυστυχώς δεν θα μπορέσω"
        : "Ναι, στην τελετή και στην δεξίωση");

    const attendingBool =
      attendance !== "Δυστυχώς δεν θα μπορέσω" &&
      (typeof body.attending === "boolean" ? body.attending : true);

    const adults = attendingBool ? Math.max(0, Math.round(n(body.adults))) : 0;
    const kids = attendingBool ? Math.max(0, Math.round(n(body.kids))) : 0;

    // κρατάμε και συνολικό (βοηθάει σε reports)
    const peopleCount = attendingBool
      ? Math.max(0, Math.round(n(body.peopleCount ?? adults + kids)))
      : 0;

    const notes = attendingBool ? s(body.notes) : "";
    const allergies = attendingBool ? s(body.allergies) : ""; // αν κάπου το χρησιμοποιείς ακόμα

    // ---- validation ----
    if (!slug || !name) {
      return NextResponse.json(
        { ok: false, error: "Missing slug/name" },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { ok: false, error: "Missing phone" },
        { status: 400 }
      );
    }

    // ---- payload to DB ----
    // ⚠️ Βάλε εδώ ΜΟΝΟ columns που ΥΠΑΡΧΟΥΝ στον πίνακα "rsvps" στο Supabase.
    // Αν δεν έχεις κάποια από αυτά τα columns, θα σκάσει με error "column does not exist".
    const payload: any = {
      slug,
      name,
      phone,
      attending: attendingBool,
      attendance, // κείμενο επιλογής
      adults,
      kids,
      peopleCount,
      notes,
      allergies,
    };

    const { error } = await supabase.from("rsvps").insert([payload]);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}