import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();
  const { error } = await supabase.from("events").insert([body]);
  if (error) return NextResponse.json({ ok: false, error: error.message });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const slug = body.slug;

  const update = { ...body };
  delete update.slug;

  const { error } = await supabase
    .from("events")
    .update(update)
    .eq("slug", slug);

  if (error) return NextResponse.json({ ok: false, error: error.message });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { slug } = await req.json();

  const { error } = await supabase.from("events").delete().eq("slug", slug);

  if (error) return NextResponse.json({ ok: false, error: error.message });

  return NextResponse.json({ ok: true });
}