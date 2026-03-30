import Image from "next/image";

export default function HomePage() {
  return (
    <main style={page}>
      <header style={topbar}>
        <div style={brandWrap}>
          <Image
            src="/brand/logo-dark.png"
            alt="Lab Lou"
            width={140}
            height={140}
            style={headerLogo}
            priority
          />

          <div style={brandTextWrap}>
            <div style={brandTitle}>Lab Lou Events</div>
            <div style={brandSub}>Online invitations with elegance</div>
          </div>
        </div>
      </header>

      <section style={heroSection}>
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
                <Image
                  src="/invite-preview/clean-preview.jpg"
                  alt="Invitation preview"
                  width={320}
                  height={640}
                  style={previewImage}
                />
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

      <section style={section}>
        <div style={sectionIntro}>Πώς λειτουργεί</div>
        <h2 style={sectionTitle}>Μια απλή διαδικασία για εσένα και τους καλεσμένους σου</h2>

        <div style={stepsGrid}>
          <div style={stepBox}>
            <div style={stepNumber}>1</div>
            <div style={stepTitle}>Στέλνεις το link</div>
            <div style={stepText}>
              Στέλνεις την ψηφιακή πρόσκληση εύκολα μέσω Viber, SMS ή social
              message στους καλεσμένους σου.
            </div>
          </div>

          <div style={stepBox}>
            <div style={stepNumber}>2</div>
            <div style={stepTitle}>Οι καλεσμένοι απαντούν</div>
            <div style={stepText}>
              Δηλώνουν συμμετοχή εύκολα από το κινητό τους, με RSVP, αριθμό
              ατόμων και χρήσιμες πληροφορίες.
            </div>
          </div>

          <div style={stepBox}>
            <div style={stepNumber}>3</div>
            <div style={stepTitle}>Βλέπεις τα αποτελέσματα</div>
            <div style={stepText}>
              Έχεις όλες τις απαντήσεις συγκεντρωμένες, παρακολουθείς live το
              event και οργανώνεις πιο εύκολα την ημέρα σου.
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
            <Image
              src="/invite-preview/clean-preview.jpg"
              alt="Demo preview"
              width={340}
              height={640}
              style={demoImage}
            />
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

          <form
  action="https://formsubmit.co/info@lablou.gr"
  method="POST"
  style={interestForm}
>
  <input type="hidden" name="_subject" value="Νέο ενδιαφέρον για online προσκλητήριο" />
  <input type="hidden" name="_captcha" value="false" />
  <input type="hidden" name="_template" value="table" />

  <div style={contactTitle}>Στείλε μας το ενδιαφέρον σου</div>

  <input
    type="text"
    name="name"
    placeholder="Ονοματεπώνυμο"
    required
    style={formInput}
  />

  <input
    type="tel"
    name="phone"
    placeholder="Τηλέφωνο"
    required
    style={formInput}
  />

  <input
    type="email"
    name="email"
    placeholder="Email"
    style={formInput}
  />

  <textarea
    name="message"
    placeholder="Γράψε μας λίγες πληροφορίες για το event σου"
    rows={4}
    style={formTextarea}
  />

  <button type="submit" style={primaryBtn}>
    Αποστολή ενδιαφέροντος
  </button>
</form>
        </div>
      </section>
    </main>
  );
}

const page: React.CSSProperties = {
  background:
    "linear-gradient(180deg, #f7f2ec 0%, #f3ece4 40%, #f8f5f1 100%)",
  color: "#2f241d",
  minHeight: "100vh",
};

const topbar: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "20px 20px 10px",
};

const brandWrap: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  flexWrap: "wrap",
};

const headerLogo: React.CSSProperties = {
  width: 110,
  height: "auto",
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

const heroSection: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "30px 20px 60px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 36,
  alignItems: "center",
};

const heroContent: React.CSSProperties = {
  minWidth: 0,
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
  fontSize: "clamp(34px, 6vw, 56px)",
  lineHeight: 1.04,
  margin: "0 0 16px 0",
  maxWidth: 680,
};

const heroText: React.CSSProperties = {
  fontSize: "clamp(16px, 2vw, 18px)",
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
  background: "rgba(255,255,255,0.82)",
  color: "#2f241d",
  textDecoration: "none",
  fontWeight: 700,
  border: "1px solid rgba(47,36,29,0.10)",
};

const heroCard: React.CSSProperties = {
  minWidth: 0,
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
  maxWidth: 300,
  margin: "0 auto",
  padding: 10,
  borderRadius: 30,
  background: "#1d1917",
  boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
};

const phoneScreen: React.CSSProperties = {
  height: 520,
  borderRadius: 22,
  overflow: "hidden",
  background: "#f3ebe2",
};

const previewImage: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  objectPosition: "center top",
};

const section: React.CSSProperties = {
  maxWidth: 1200,
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
  fontSize: "clamp(28px, 4vw, 36px)",
  lineHeight: 1.1,
  margin: "0 0 24px 0",
  maxWidth: 760,
};

const featureGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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

const stepsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 20,
};

const stepBox: React.CSSProperties = {
  background: "rgba(255,255,255,0.82)",
  padding: 22,
  borderRadius: 22,
  border: "1px solid rgba(47,36,29,0.08)",
  boxShadow: "0 16px 38px rgba(47,36,29,0.06)",
};

const stepNumber: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 900,
  color: "#b89b5e",
  marginBottom: 10,
};

const stepTitle: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 18,
  marginBottom: 8,
  color: "#2f241d",
};

const stepText: React.CSSProperties = {
  fontSize: 15,
  lineHeight: 1.6,
  color: "rgba(47,36,29,0.72)",
};

const demoSection: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "20px 20px 70px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 28,
  alignItems: "center",
};

const demoLeft: React.CSSProperties = {
  minWidth: 0,
};

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
  maxWidth: 340,
  background: "rgba(255,255,255,0.82)",
  borderRadius: 28,
  border: "1px solid rgba(47,36,29,0.08)",
  boxShadow: "0 20px 48px rgba(47,36,29,0.08)",
  overflow: "hidden",
};

const demoImage: React.CSSProperties = {
  width: "100%",
  height: "auto",
  display: "block",
};

const whyGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
  maxWidth: 1200,
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
  fontSize: "clamp(28px, 4vw, 38px)",
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

<form
  action="https://formsubmit.co/info@lablou.gr"
  method="POST"
  style={interestForm}
>
  <input type="hidden" name="_subject" value="Νέο ενδιαφέρον για online προσκλητήριο" />
  <input type="hidden" name="_captcha" value="false" />
  <input type="hidden" name="_template" value="table" />

  <div style={contactTitle}>Στείλε μας το ενδιαφέρον σου</div>

  <input
    type="text"
    name="name"
    placeholder="Ονοματεπώνυμο"
    required
    style={formInput}
  />

  <input
    type="tel"
    name="phone"
    placeholder="Τηλέφωνο"
    required
    style={formInput}
  />

  <input
    type="email"
    name="email"
    placeholder="Email"
    style={formInput}
  />

  <textarea
    name="message"
    placeholder="Γράψε μας λίγες πληροφορίες για το event σου"
    rows={4}
    style={formTextarea}
  />

  <button type="submit" style={primaryBtn}>
    Αποστολή ενδιαφέροντος
  </button>
</form>

const interestForm: React.CSSProperties = {
  maxWidth: 520,
  margin: "20px auto 0",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const formInput: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid rgba(47,36,29,0.12)",
  background: "rgba(255,255,255,0.92)",
  color: "#2f241d",
  fontSize: 15,
  outline: "none",
};

const formTextarea: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  border: "1px solid rgba(47,36,29,0.12)",
  background: "rgba(255,255,255,0.92)",
  color: "#2f241d",
  fontSize: 15,
  outline: "none",
  resize: "vertical",
  minHeight: 120,
};