export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
  
          <a
  href="/api/admin/logout"
  className="e-btn"
  style={{ width: "auto", padding: "10px 16px", textDecoration: "none" }}
>
  Logout
</a>
        </div>
  
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    );
  }