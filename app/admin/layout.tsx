"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  const [checking, setChecking] = useState(!isLoginPage);

  useEffect(() => {
    if (isLoginPage) return;

    let mounted = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!session) {
        window.location.href = "/admin/login";
        return;
      }

      setChecking(false);
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, [isLoginPage]);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f6f4f2",
        }}
      >
        Έλεγχος σύνδεσης...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <div
        style={{
          padding: 16,
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ fontWeight: 700 }}>Admin</div>

        <button
          onClick={logout}
          style={{
            width: "auto",
            padding: "10px 16px",
            textDecoration: "none",
            borderRadius: 10,
            border: "1px solid #d8cfc6",
            background: "#fff",
            cursor: "pointer",
            color: "#2f241d",
            fontWeight: 600,
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ padding: 24 }}>{children}</div>
    </div>
  );
}