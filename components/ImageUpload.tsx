"use client";

import { useState } from "react";

export default function ImageUpload({
  label,
  slug,
  onUpload,
}: {
  label: string;
  slug: string;
  onUpload: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!slug.trim()) {
      alert("Βάλε πρώτα slug.");
      return;
    }

    setUploading(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("slug", slug);
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        alert("Upload error: " + (data?.error || "Unknown error"));
        return;
      }

      onUpload(data.publicUrl);
    } catch (err: any) {
      alert("Upload error: " + (err?.message || String(err)));
    } finally {
      setUploading(false);
    }
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