import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { slug } = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase.from("events").delete().eq("slug", slug);

  if (error) return NextResponse.json({ ok: false, error: error.message });

  return NextResponse.json({ ok: true });
}