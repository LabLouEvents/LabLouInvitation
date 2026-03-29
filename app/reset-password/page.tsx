"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");

  async function updatePassword() {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Ο κωδικός άλλαξε επιτυχώς ✅");
      window.location.href = "/admin/login";
    }
  }

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={title}>Νέος Κωδικός</h2>

        <input
          type="password"
          placeholder="Νέος κωδικός"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button onClick={updatePassword} style={btn}>
          Αποθήκευση
        </button>
      </div>
    </div>
  );
}

const page: React.CSSProperties = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#f6f4f2",
};

const card: React.CSSProperties = {
  padding: 30,
  background: "white",
  borderRadius: 16,
  width: 320,
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
};

const title: React.CSSProperties = {
  marginTop: 0,
  color: "#2f241d",
};

const input: React.CSSProperties = {
  width: "100%",
  marginBottom: 10,
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #d8cfc6",
  fontSize: 14,
  color: "#111",
};

const btn: React.CSSProperties = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  background: "#2f241d",
  color: "white",
  cursor: "pointer",
  border: "none",
  fontWeight: 600,
};