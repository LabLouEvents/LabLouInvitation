// app/api/public/all-events/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from("events")
    .select("slug");

  if (error) {
    return NextResponse.json({ ok: false });
  }

  return NextResponse.json({
    ok: true,
    events: data,
  });
}