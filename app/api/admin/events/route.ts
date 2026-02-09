import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
);

// CREATE (insert)
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Αν δεν υπάρχει share_token, το φτιάχνουμε εδώ (ασφαλές)
    if (!body.share_token) {
      body.share_token = crypto.randomBytes(16).toString("hex");
    }

    const { error } = await supabase.from("events").insert([body]);

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}

// UPDATE (edit existing event by slug)
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const slug = String(body.slug || "").trim();
    if (!slug) return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });

    const update: any = { ...body };
    delete update.slug;

    // Δεν θέλουμε να αλλάζει τυχαία το share_token από λάθος
    // (αν θες “Regenerate token” θα το κάνουμε ξεχωριστό κουμπί)
    if ("share_token" in update) delete update.share_token;

    const { error } = await supabase.from("events").update(update).eq("slug", slug);

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}

// DELETE (delete event by slug)
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const slug = String(body.slug || "").trim();
    if (!slug) return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });

    const { error } = await supabase.from("events").delete().eq("slug", slug);

    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}