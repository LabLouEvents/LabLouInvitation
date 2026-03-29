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

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      alert(error.message);
    } else {
      window.location.href = "/admin";
    }
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

        <button onClick={login} style={btn}>
          Login
        </button>

        <div style={forgotBox}>
          Ξέχασες τον κωδικό σου;
          <div
            onClick={() => (window.location.href = "/forgot-password")}
            style={forgotLink}
          >
            Reset password
          </div>
        </div>
      </div>
    </div>
  );
}

/* styles */
const page = {
  minHeight: "100vh",
  display: "grid",
  placeItems: "center",
  background: "#f6f4f2",
};

const card = {
  padding: 30,
  background: "white",
  borderRadius: 16,
  width: 320,
};

const title = { marginTop: 0 };

const input = {
  width: "100%",
  marginBottom: 10,
  padding: 12,
  borderRadius: 10,
  border: "1px solid #ccc",
};

const btn = {
  width: "100%",
  padding: 12,
  borderRadius: 10,
  background: "black",
  color: "white",
  cursor: "pointer",
};

const forgotBox = {
  marginTop: 14,
  textAlign: "center",
  fontSize: 13,
};

const forgotLink = {
  cursor: "pointer",
  textDecoration: "underline",
};