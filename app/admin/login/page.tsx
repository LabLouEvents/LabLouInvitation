"use client";

import { useState } from "react";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  async function login() {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user, pass }),
    });

    if (res.ok) {
      window.location.href = "/admin";
    } else {
      alert("Λάθος στοιχεία");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#f6f4f2",
      }}
    >
      <div
        style={{
          padding: 30,
          background: "white",
          borderRadius: 16,
          width: 320,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginTop: 0, color: "#2f241d" }}>
          Admin Login
        </h2>

        <input
          placeholder="Username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
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

        {/* 🔐 Forgot password */}
        <div style={forgotBox}>
          Ξέχασες τον κωδικό σου;
          <div
            onClick={() =>
              alert("Στείλε μας μήνυμα για επαναφορά κωδικού 📩")
            }
            style={forgotLink}
          >
            Επικοινώνησε μαζί μας
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

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

const forgotBox: React.CSSProperties = {
  marginTop: 14,
  textAlign: "center",
  fontSize: 13,
  color: "#6b5b4f",
};

const forgotLink: React.CSSProperties = {
  marginTop: 4,
  cursor: "pointer",
  textDecoration: "underline",
  fontWeight: 600,
};