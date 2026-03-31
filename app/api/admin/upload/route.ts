import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function cleanPart(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function cleanFileName(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export async function GET() {
  return NextResponse.json({ ok: true, route: "upload route alive" });
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const slugRaw = String(form.get("slug") || "").trim();
    const file = form.get("file") as File | null;

    if (!slugRaw) {
      return NextResponse.json(
        { ok: false, error: "Missing slug" },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "Missing file" },
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

    const bucket = "invites";
    const slug = cleanPart(slugRaw);

    if (!slug) {
      return NextResponse.json(
        { ok: false, error: "Invalid slug" },
        { status: 400 }
      );
    }

    const originalName = file.name || "image.jpg";
    const ext = (originalName.split(".").pop() || "jpg").toLowerCase();

    if (!["jpg", "jpeg", "png", "webp"].includes(ext)) {
      return NextResponse.json(
        { ok: false, error: "Invalid file type. Use jpg, jpeg, png or webp." },
        { status: 400 }
      );
    }

    const cleanedBaseName = cleanFileName(
      originalName.replace(/\.[^.]+$/, "")
    );
    const safeBaseName = cleanedBaseName || "image";
    const safeName = `${safeBaseName}.${ext}`;
    const path = `${slug}/${Date.now()}-${safeName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const contentType =
      file.type && file.type.startsWith("image/")
        ? file.type
        : ext === "png"
        ? "image/png"
        : ext === "webp"
        ? "image/webp"
        : "image/jpeg";

    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType,
        upsert: false,
      });

    if (upErr) {
      return NextResponse.json(
        { ok: false, error: upErr.message },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);

    return NextResponse.json({
      ok: true,
      publicUrl: data.publicUrl,
      path,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}