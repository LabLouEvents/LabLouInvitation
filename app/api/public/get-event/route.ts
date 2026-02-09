import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const slug = searchParams.get("slug");
    const token = searchParams.get("t");

    if (!slug || !token) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .eq("share_token", token)
      .single();

    if (error || !data) {
      return NextResponse.json({ ok: false }, { status: 404 });
    }

    return NextResponse.json({ ok: true, event: data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}