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
  const [resetLoading, setResetLoading] = useState(false);

  async function login() {
    if (!email.trim() || !pass.trim()) {
      alert("Συμπλήρωσε email και password.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/admin/events";
  }

  async function resetPassword() {
    if (!email.trim()) {
      alert("Γράψε πρώτα το email σου.");
      return;
    }

    setResetLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: "https://lablouinvitations.gr/admin/login",
    });

    setResetLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Στάλθηκε email επαναφοράς κωδικού.");
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

        <button
          type="button"
          onClick={resetPassword}
          style={forgotBtn}
          disabled={resetLoading}
        >
          {resetLoading ? "Στέλνεται..." : "Ξέχασα το password"}
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

const forgotBtn: React.CSSProperties = {
  width: "100%",
  marginTop: 10,
  padding: 10,
  borderRadius: 10,
  background: "transparent",
  border: "none",
  color: "#7a6557",
  cursor: "pointer",
  fontWeight: 600,
};