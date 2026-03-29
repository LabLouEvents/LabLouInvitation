import Image from "next/image";

export default function HomePage() {
  return (
    <main style={page}>
      <header style={topbar}>
        <div style={brandWrap}>
          <Image
            src="/brand/logo-dark.png"
            alt="Lab Lou"
            width={110}
            height={110}
            style={{ width: 100, height: "auto" }}
            priority
          />
          <div style={brandTextWrap}>
            <div style={brandTitle}>Lab Lou Events</div>
            <div style={brandSub}>Online invitations with elegance</div>
          </div>
        </div>

        <div style={topbarActions}>
          <a href="/admin/login" style={ghostBtn}>
            Admin Login
          </a>
        </div>
      </header>

      <section style={heroSection}>
        <div style={heroGlow} />
        <div style={heroContent}>
          <div style={eyebrow}>Digital invitations for wedding & baptism</div>

          <h1 style={heroTitle}>
            Online προσκλητήρια
            <br />
            με κομψότητα, ταυτότητα και RSVP
          </h1>

          <p style={heroText}>
            Δημιούργησε ένα μοναδικό online προσκλητήριο με όμορφη εμπειρία για
            τους καλεσμένους σου, χάρτες, RSVP φόρμα και προσωποποιημένο link.
          </p>

          <div style={heroButtons}>
            <a href="#demo" style={primaryBtn}>
              Δες demo
            </a>

            <a href="#interest" style={secondaryBtn}>
              Εκδήλωση ενδιαφέροντος
            </a>
          </div>
        </div>

        <div style={heroCard}>
          <div style={heroCardInner}>
            <div style={heroCardLabel}>Preview Experience</div>

            <div style={phoneMock}>
              <div style={phoneScreen}>
                <div style={inviteContentWrap}>
                  <div style={inviteBrandWrap}>
                    <Image
                      src="/brand/logo-white.png"
                      alt="Lab Lou"
                      width={120}
                      height={120}
                      style={{
                        width: 120,
                        height: "auto",
                        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.15))",
                      }}
                    />
                    <div style={inviteTop}>Lab Lou Events</div>
                  </div>

                  <Image
                    src="/invite-preview/envelope.png"
                    alt="Envelope"
                    width={160}
                    height={160}
                    style={{ marginBottom: 8 }}
                  />

                  <div style={inviteTitle}>Έχεις πρόσκληση</div>

                  <div style={inviteBtn}>Άνοιγμα προσκλητηρίου</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={section}>
        <div style={sectionIntro}>Τι περιλαμβάνει</div>
        <h2 style={sectionTitle}>Όλα όσα χρειάζεται ένα σύγχρονο προσκλητήριο</h2>

        <div style={featureGrid}>
          <div style={featureCard}>
            <div style={featureIcon}>✨</div>
            <div style={featureTitle}>Elegant εμπειρία</div>
            <div style={featureText}>
              Αισθητικό αποτέλεσμα με premium παρουσίαση και mobile-friendly
              σχεδιασμό.
            </div>
          </div>

          <div style={featureCard}>
            <div style={featureIcon}>📍</div>
            <div style={featureTitle}>Χάρτες εκκλησίας & κέντρου</div>
            <div style={featureText}>
              Ο καλεσμένος πατάει και ανοίγει κατευθείαν τις σωστές οδηγίες.
            </div>
          </div>

          <div style={featureCard}>
            <div style={featureIcon}>💌</div>
            <div style={featureTitle}>RSVP φόρμα</div>
            <div style={featureText}>
              Άμεση απάντηση παρουσίας με σωστή οργάνωση των καλεσμένων.
            </div>
          </div>

          <div style={featureCard}>
            <div style={featureIcon}>🔗</div>
            <div style={featureTitle}>Μοναδικό private link</div>
            <div style={featureText}>
              Κάθε event έχει το δικό του link και το δικό του token πρόσβασης.
            </div>
          </div>
        </div>
      </section>

      <section id="demo" style={demoSection}>
        <div style={demoLeft}>
          <div style={sectionIntro}>Demo</div>
          <h2 style={sectionTitle}>Δες πώς παρουσιάζεται ένα online προσκλητήριο</h2>
          <p style={demoText}>
            Από το άνοιγμα του φακέλου μέχρι το RSVP, η εμπειρία είναι φτιαγμένη
            ώστε να είναι όμορφη, καθαρή και εύκολη για κάθε καλεσμένο.
          </p>

          <div style={heroButtons}>
            <a
              href="/e/12.09.2026?t=8138b5407b4866936ecc4803677ec6a6"
              style={primaryBtn}
            >
              Άνοιξε το demo
            </a>

            <a href="#interest" style={secondaryBtn}>
              Θέλω το δικό μου
            </a>
          </div>
        </div>

        <div style={demoRight}>
          <div style={demoPreviewCard}>
            <div style={demoPreviewTop}>Live Demo</div>
            <div style={demoPreviewBody}>
              <div style={demoPreviewEnvelope}>✉️</div>
              <div style={demoPreviewTitle}>Θανάσης & Μυρτώ</div>
              <div style={demoPreviewSub}>Elegant online invitation</div>
            </div>
          </div>
        </div>
      </section>

      <section style={section}>
        <div style={sectionIntro}>Γιατί να το επιλέξεις</div>
        <h2 style={sectionTitle}>Γιατί ξεχωρίζει</h2>

        <div style={whyGrid}>
          <div style={whyItem}>
            <div style={whyTitle}>Εικόνα που εντυπωσιάζει</div>
            <div style={whyText}>
              Δεν είναι ένα απλό link. Είναι μια ολόκληρη εμπειρία invitation.
            </div>
          </div>

          <div style={whyItem}>
            <div style={whyTitle}>Οργάνωση χωρίς χάος</div>
            <div style={whyText}>
              Οι απαντήσεις RSVP συγκεντρώνονται σε admin panel με καθαρή εικόνα.
            </div>
          </div>

          <div style={whyItem}>
            <div style={whyTitle}>Σχεδιασμένο για κινητό</div>
            <div style={whyText}>
              Οι περισσότεροι καλεσμένοι θα το ανοίξουν από κινητό, κι εκεί λάμπει.
            </div>
          </div>
        </div>
      </section>

      <section id="interest" style={interestSection}>
        <div style={interestCard}>
          <div style={sectionIntro}>Εκδήλωση ενδιαφέροντος</div>
          <h2 style={interestTitle}>Θέλεις το δικό σου online προσκλητήριο;</h2>
          <p style={interestText}>
            Ιδανικό για γάμο, βάφτιση και events με αισθητική, λειτουργικότητα και
            premium παρουσίαση.
          </p>

          <div style={contactWrap}>
            <div style={contactTitle}>Επίλεξε τρόπο επικοινωνίας</div>

            <div style={contactButtons}>
              <a
                href="mailto:info@lablou.gr?subject=Ενδιαφέρομαι για online προσκλητήριο"
                style={primaryBtn}
              >
                📧 Email
              </a>

              <a
                href="viber://chat?number=%2B306943910973"
                style={secondaryBtn}
              >
                💜 Viber
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const page: React.CSSProperties = {
  background:
    "linear-gradient(180deg, #f7f2ec 0%, #f3ece4 38%, #f8f5f1 100%)",
  color: "#2f241d",
  minHeight: "100vh",
};

const topbar: React.CSSProperties = {
  maxWidth: 1240,
  margin: "0 auto",
  padding: "18px 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 16,
  flexWrap: "wrap",
};

const brandWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
};

const brandTextWrap: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const brandTitle: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 800,
  letterSpacing: "0.02em",
};

const brandSub: React.CSSProperties = {
  fontSize: 13,
  color: "rgba(47,36,29,0.65)",
};

const topbarActions: React.CSSProperties = {
  display: "flex",
  gap: 10,
};

const heroSection: React.CSSProperties = {
  maxWidth: 1240,
  margin: "0 auto",
  padding: "40px 20px 60px",
  display: "grid",
  gridTemplateColumns: "1.1fr 0.9fr",
  gap: 28,
  alignItems: "center",
  position: "relative",
};

const heroGlow: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background:
    "radial-gradient(circle at 30% 20%, rgba(222,199,177,0.45), transparent 35%)",
  pointerEvents: "none",
};

const heroContent: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
};

const eyebrow: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 12px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.68)",
  border: "1px solid rgba(47,36,29,0.08)",
  fontSize: 13,
  fontWeight: 700,
  color: "#6d5a4d",
  marginBottom: 16,
};

const heroTitle: React.CSSProperties = {
  fontSize: 56,
  lineHeight: 1.02,
  margin: "0 0 16px 0",
  maxWidth: 640,
};

const heroText: React.CSSProperties = {
  fontSize: 18,
  lineHeight: 1.65,
  color: "rgba(47,36,29,0.72)",
  maxWidth: 620,
  marginBottom: 22,
};

const heroButtons: React.CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap",
};

const primaryBtn: React.CSSProperties = {
  padding: "14px 22px",
  borderRadius: 14,
  background: "#2f241d",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 700,
  boxShadow: "0 10px 30px rgba(47,36,29,0.14)",
};

const secondaryBtn: React.CSSProperties = {
  padding: "14px 22px",
  borderRadius: 14,
  background: "rgba(255,255,255,0.72)",
  color: "#2f241d",
  textDecoration: "none",
  fontWeight: 700,
  border: "1px solid rgba(47,36,29,0.10)",
};

const ghostBtn: React.CSSProperties = {
  padding: "12px 16px",
  borderRadius: 12,
  background: "rgba(255,255,255,0.6)",
  color: "#2f241d",
  textDecoration: "none",
  fontWeight: 700,
  border: "1px solid rgba(47,36,29,0.08)",
};

const heroCard: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
};

const heroCardInner: React.CSSProperties = {
  background: "rgba(255,255,255,0.72)",
  borderRadius: 28,
  padding: 24,
  border: "1px solid rgba(47,36,29,0.08)",
  boxShadow: "0 24px 60px rgba(47,36,29,0.10)",
};

const heroCardLabel: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  color: "#7a6557",
  marginBottom: 14,
};

const phoneMock: React.CSSProperties = {
  maxWidth: 330,
  margin: "0 auto",
  padding: 12,
  borderRadius: 30,
  background: "#201915",
  boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
};

const phoneScreen: React.CSSProperties = {
  backgroundImage: "url('/invite-preview/bg.jpg')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderRadius: 22,
  minHeight: 520,
  padding: "26px 20px 20px",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
};

const inviteContentWrap: React.CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  transform: "translateY(-55px)",
};

const section: React.CSSProperties = {
  maxWidth: 1240,
  margin: "0 auto",
  padding: "70px 20px",
};

const sectionIntro: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 800,
  color: "#8d7363",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: 10,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 36,
  lineHeight: 1.1,
  margin: "0 0 24px 0",
  maxWidth: 760,
};

const featureGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 16,
};

const featureCard: React.CSSProperties = {
  background: "rgba(255,255,255,0.78)",
  borderRadius: 22,
  padding: 22,
  border: "1px solid rgba(47,36,29,0.08)",
  boxShadow: "0 16px 38px rgba(47,36,29,0.06)",
};

const featureIcon: React.CSSProperties = {
  fontSize: 28,
  marginBottom: 12,
};

const featureTitle: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 18,
  marginBottom: 8,
};

const featureText: React.CSSProperties = {
  color: "rgba(47,36,29,0.70)",
  lineHeight: 1.55,
  fontSize: 15,
};

const demoSection: React.CSSProperties = {
  maxWidth: 1240,
  margin: "0 auto",
  padding: "20px 20px 70px",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 22,
  alignItems: "center",
};

const demoLeft: React.CSSProperties = {};

const demoText: React.CSSProperties = {
  fontSize: 17,
  lineHeight: 1.7,
  color: "rgba(47,36,29,0.72)",
  maxWidth: 580,
};

const demoRight: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
};

const demoPreviewCard: React.CSSProperties = {
  width: "100%",
  maxWidth: 480,
  background: "rgba(255,255,255,0.82)",
  borderRadius: 28,
  border: "1px solid rgba(47,36,29,0.08)",
  boxShadow: "0 20px 48px rgba(47,36,29,0.08)",
  overflow: "hidden",
};

const demoPreviewTop: React.CSSProperties = {
  padding: "14px 18px",
  borderBottom: "1px solid rgba(47,36,29,0.08)",
  fontWeight: 800,
  color: "#6b5b4f",
};

const demoPreviewBody: React.CSSProperties = {
  padding: 34,
  textAlign: "center",
};

const demoPreviewEnvelope: React.CSSProperties = {
  fontSize: 72,
};

const demoPreviewTitle: React.CSSProperties = {
  marginTop: 14,
  fontSize: 28,
  fontWeight: 800,
};

const demoPreviewSub: React.CSSProperties = {
  marginTop: 8,
  color: "rgba(47,36,29,0.64)",
};

const whyGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: 16,
};

const whyItem: React.CSSProperties = {
  background: "rgba(255,255,255,0.78)",
  borderRadius: 22,
  padding: 22,
  border: "1px solid rgba(47,36,29,0.08)",
};

const whyTitle: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 18,
  marginBottom: 8,
};

const whyText: React.CSSProperties = {
  color: "rgba(47,36,29,0.70)",
  lineHeight: 1.55,
};

const interestSection: React.CSSProperties = {
  maxWidth: 1240,
  margin: "0 auto",
  padding: "20px 20px 90px",
};

const interestCard: React.CSSProperties = {
  background:
    "linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(243,232,220,0.92) 100%)",
  borderRadius: 30,
  padding: "34px 28px",
  border: "1px solid rgba(47,36,29,0.08)",
  boxShadow: "0 20px 48px rgba(47,36,29,0.08)",
  textAlign: "center",
};

const interestTitle: React.CSSProperties = {
  fontSize: 38,
  margin: "0 0 12px 0",
};

const interestText: React.CSSProperties = {
  maxWidth: 760,
  margin: "0 auto 22px",
  color: "rgba(47,36,29,0.72)",
  fontSize: 17,
  lineHeight: 1.65,
};

const contactWrap: React.CSSProperties = {
  marginTop: 20,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 10,
};

const contactTitle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: "#8d7363",
  letterSpacing: "0.05em",
};

const contactButtons: React.CSSProperties = {
  display: "flex",
  gap: 12,
  justifyContent: "center",
  flexWrap: "wrap",
};

const inviteBrandWrap: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 4,
  marginBottom: 8,
};

const inviteTop: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: "#6d5a4d",
  marginTop: 0,
};

const inviteTitle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 800,
  marginTop: 0,
};

const inviteBtn: React.CSSProperties = {
  marginTop: 12,
  display: "inline-block",
  padding: "12px 20px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.7)",
  border: "1px solid rgba(47,36,29,0.1)",
  fontWeight: 700,
};