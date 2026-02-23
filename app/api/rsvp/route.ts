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

    const slug = String(body.slug || "").trim();
    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();

    const attendance = String(body.attendance || "");
    const attending = attendance !== "decline";

    const adults = attending ? Math.max(0, Number(body.adults) || 0) : 0;
    const kids = attending ? Math.max(0, Number(body.kids) || 0) : 0;

    const guests = attending ? adults + kids : 0;
    const notes = attending ? String(body.notes || "").trim() : "";

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

    const payload = {
      slug,
      name,
      phone,
      attendance,
      attending,
      adults,
      kids,
      guests,
      notes,
      allergies: notes, // αν θέλεις να κρατάει και το παλιό column
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