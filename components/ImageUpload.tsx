"use client";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ImageUpload({
  label,
  onUpload,
}: {
  label: string;
  onUpload: (url: string) => void;
}) {
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = `${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from("invites")
      .upload(fileName, file);

    if (error) {
      alert("Upload error: " + error.message);
      return;
    }

    const { data } = supabase.storage
      .from("invites")
      .getPublicUrl(fileName);

    onUpload(data.publicUrl);
  }

  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ fontSize: 12, marginBottom: 4 }}>{label}</div>
      <input type="file" accept="image/*" onChange={handleFile} />
    </div>
  );
}