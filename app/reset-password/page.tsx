"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPassword() {
  const [password, setPassword] = useState("");

  async function updatePassword() {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Ο κωδικός άλλαξε ✅");
      window.location.href = "/";
    }
  }

  return (
    <div style={page}>
      <div style={card}>
        <h2>Νέος Κωδικός</h2>

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

const page = { minHeight: "100vh", display: "grid", placeItems: "center" };
const card = { padding: 30, background: "white", borderRadius: 16 };
const input = { width: "100%", marginBottom: 10, padding: 10 };
const btn = { padding: 10 };