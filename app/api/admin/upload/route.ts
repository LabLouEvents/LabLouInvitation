import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const slug = String(form.get("slug") || "").trim();
    const file = form.get("file") as File | null;

    if (!slug) return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });
    if (!file) return NextResponse.json({ ok: false, error: "Missing file" }, { status: 400 });

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const bucket = "invites"; // ✅ το bucket που φτιάξαμε
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${slug}/${Date.now()}-${safeName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (upErr) {
      return NextResponse.json({ ok: false, error: upErr.message }, { status: 500 });
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return NextResponse.json({ ok: true, publicUrl: data.publicUrl, path });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}