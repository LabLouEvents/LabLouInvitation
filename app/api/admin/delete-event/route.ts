import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = String(body?.slug || "").trim();

    if (!slug) {
      return NextResponse.json(
        { ok: false, error: "Missing slug" },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { ok: false, error: "Missing Supabase server env vars" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 1. Σβήνουμε πρώτα τα RSVP του event
    const { error: rsvpError } = await supabase
      .from("rsvps")
      .delete()
      .eq("slug", slug);

    if (rsvpError) {
      return NextResponse.json(
        { ok: false, error: rsvpError.message },
        { status: 500 }
      );
    }

    // 2. Σβήνουμε το event
    const { error: eventError } = await supabase
      .from("events")
      .delete()
      .eq("slug", slug);

    if (eventError) {
      return NextResponse.json(
        { ok: false, error: eventError.message },
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

export async function GET() {
  return NextResponse.json({ ok: true, route: "delete-event route alive" });
}