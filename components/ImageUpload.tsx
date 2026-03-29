"use client";

import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

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
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFileName(file.name);

    const fileNameSafe = `${Date.now()}_${file.name}`;

    const { error } = await supabase.storage
      .from("invites")
      .upload(fileNameSafe, file);

    if (error) {
      alert("Upload error: " + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("invites")
      .getPublicUrl(fileNameSafe);

    onUpload(data.publicUrl);
    setUploading(false);
  }

  return (
    <div
      style={{
        marginTop: 14,
        padding: 12,
        border: "1px solid #e2d8cf",
        borderRadius: 12,
        background: "#faf7f3",
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 700,
          color: "#4b4038",
          marginBottom: 8,
        }}
      >
        {label}
      </div>

      <input type="file" accept="image/*" onChange={handleFile} />

      {uploading && (
        <div style={{ marginTop: 8, fontSize: 13, color: "#6b5b4f" }}>
          Ανεβαίνει...
        </div>
      )}

      {!uploading && fileName && (
        <div style={{ marginTop: 8, fontSize: 13, color: "#6b5b4f" }}>
          Επιλέχθηκε: {fileName}
        </div>
      )}
    </div>
  );
}