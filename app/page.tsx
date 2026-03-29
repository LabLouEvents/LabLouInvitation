export default function HomePage() {
  return (
    <main style={page}>
      
      {/* HERO */}
      <section style={hero}>
        <h1 style={title}>
          Online Προσκλητήρια που ξεχωρίζουν ✨
        </h1>

        <p style={subtitle}>
          Δημιούργησε το δικό σου προσκλητήριο για γάμο ή βάπτιση σε λίγα λεπτά.
        </p>

        <a href="/admin/login" style={cta}>
          Ξεκίνα τώρα
        </a>
      </section>

      {/* HOW IT WORKS */}
      <section style={section}>
        <h2>Πώς λειτουργεί</h2>

        <div style={grid}>
          <div style={card}>
            1️⃣ Δημιουργείς το event σου
          </div>

          <div style={card}>
            2️⃣ Προσθέτεις φωτογραφίες & στοιχεία
          </div>

          <div style={card}>
            3️⃣ Στέλνεις το link στους καλεσμένους
          </div>
        </div>
      </section>

      {/* PREVIEW */}
      <section style={section}>
        <h2>Δες πώς φαίνεται</h2>

        <div style={previewBox}>
          ✨ Elegant προσκλητήριο με RSVP
        </div>
      </section>

      {/* WHY */}
      <section style={section}>
        <h2>Γιατί Lab Lou</h2>

        <div style={grid}>
          <div style={card}>💌 Μοναδικό design</div>
          <div style={card}>⚡ Άμεση δημιουργία</div>
          <div style={card}>📱 Mobile friendly</div>
        </div>
      </section>

      {/* CTA */}
      <section style={ctaSection}>
        <h2>Έτοιμη να ξεκινήσεις;</h2>

        <a href="/admin/login" style={cta}>
          Δημιούργησε προσκλητήριο
        </a>
      </section>
    </main>
  );
}
const page: React.CSSProperties = {
  fontFamily: "sans-serif",
  background: "#f6f4f2",
};

const hero: React.CSSProperties = {
  padding: "80px 20px",
  textAlign: "center",
};

const title: React.CSSProperties = {
  fontSize: 36,
  marginBottom: 10,
  color: "#2f241d",
};

const subtitle: React.CSSProperties = {
  fontSize: 18,
  marginBottom: 20,
  color: "#6b5b4f",
};

const cta: React.CSSProperties = {
  padding: "12px 20px",
  background: "#2f241d",
  color: "white",
  borderRadius: 10,
  textDecoration: "none",
};

const section: React.CSSProperties = {
  padding: "60px 20px",
  textAlign: "center",
};

const grid: React.CSSProperties = {
  display: "grid",
  gap: 20,
  marginTop: 20,
};

const card: React.CSSProperties = {
  background: "white",
  padding: 20,
  borderRadius: 12,
};

const previewBox: React.CSSProperties = {
  marginTop: 20,
  padding: 40,
  background: "#fff",
  borderRadius: 16,
};

const ctaSection: React.CSSProperties = {
  padding: "80px 20px",
  textAlign: "center",
};