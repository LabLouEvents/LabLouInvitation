"use client";

import { useState } from "react";

export default function LoginPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  async function login() {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
          width: 300,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Admin Login</h2>

        <input
          placeholder="Username"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 10 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          style={{ width: "100%", marginBottom: 14, padding: 10 }}
        />

        <button
          onClick={login}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 10,
            background: "black",
            color: "white",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}