"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/admin/events";
  }

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={title}>Admin Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          style={input}
        />

        <button onClick={login} style={btn} disabled={loading}>
          {loading ? "Loading..." : "Login"}
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