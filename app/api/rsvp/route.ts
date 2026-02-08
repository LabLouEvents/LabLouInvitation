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

    // ✅ κάνει convert "Ναι"/"Όχι" ή true/false -> boolean
    const attendingBool =
      typeof body.attending === "boolean"
        ? body.attending
        : String(body.attending).toLowerCase() === "ναι";

    // ✅ δέχεται είτε guests είτε peopleCount
    const guestsNum = Number(body.guests ?? body.peopleCount ?? 0);

    const payload = {
      slug: String(body.slug || ""),
      name: String(body.name || "").trim(),
      attending: attendingBool,
      guests: attendingBool ? guestsNum : 0,
      allergies: attendingBool ? String(body.allergies || "").trim() : "",
    };

    if (!payload.slug || !payload.name) {
      return NextResponse.json(
        { ok: false, error: "Missing slug/name" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("rsvps").insert([payload]);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}