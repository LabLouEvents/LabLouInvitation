import Image from "next/image";

export default function HomePage() {
  return (
    <>
      <style>{`
        .ll-page {
          background: linear-gradient(180deg, #f7f2ec 0%, #f3ece4 38%, #f8f5f1 100%);
          color: #2f241d;
          min-height: 100vh;
        }

        .ll-topbar,
        .ll-section,
        .ll-hero,
        .ll-demo,
        .ll-interest {
          max-width: 1240px;
          margin: 0 auto;
          padding-left: 20px;
          padding-right: 20px;
        }

        .ll-topbar {
          padding-top: 18px;
          padding-bottom: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .ll-brand-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ll-brand-text {
          display: flex;
          flex-direction: column;
        }

        .ll-brand-title {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .ll-brand-sub {
          font-size: 13px;
          color: rgba(47,36,29,0.65);
        }

        .ll-hero {
          padding-top: 40px;
          padding-bottom: 60px;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 28px;
          align-items: center;
          position: relative;
        }

        .ll-hero-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 20%, rgba(222,199,177,0.45), transparent 35%);
          pointer-events: none;
        }

        .ll-hero-content,
        .ll-hero-card {
          position: relative;
          z-index: 1;
        }

        .ll-eyebrow,
        .ll-section-intro {
          font-size: 13px;
          font-weight: 800;
          color: #8d7363;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .ll-eyebrow {
          display: inline-block;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.68);
          border: 1px solid rgba(47,36,29,0.08);
          margin-bottom: 16px;
        }

        .ll-hero-title {
          font-size: 56px;
          line-height: 1.02;
          margin: 0 0 16px 0;
          max-width: 640px;
        }

        .ll-hero-text {
          font-size: 18px;
          line-height: 1.65;
          color: rgba(47,36,29,0.72);
          max-width: 620px;
          margin-bottom: 22px;
        }

        .ll-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .ll-btn-primary,
        .ll-btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 14px 22px;
          border-radius: 14px;
          text-decoration: none;
          font-weight: 700;
        }

        .ll-btn-primary {
          background: #2f241d;
          color: #fff;
          box-shadow: 0 10px 30px rgba(47,36,29,0.14);
        }

        .ll-btn-secondary {
          background: rgba(255,255,255,0.72);
          color: #2f241d;
          border: 1px solid rgba(47,36,29,0.10);
        }

        .ll-hero-card-inner {
          background: rgba(255,255,255,0.72);
          border-radius: 28px;
          padding: 24px;
          border: 1px solid rgba(47,36,29,0.08);
          box-shadow: 0 24px 60px rgba(47,36,29,0.10);
        }

        .ll-hero-card-label {
          font-size: 13px;
          font-weight: 800;
          color: #7a6557;
          margin-bottom: 14px;
        }

        .ll-phone-mock {
          max-width: 330px;
          margin: 0 auto;
          padding: 12px;
          border-radius: 30px;
          background: #201915;
          box-shadow: 0 18px 40px rgba(0,0,0,0.18);
        }

        .ll-phone-screen {
          background-image: url('/invite-preview/bg.jpg');
          background-size: cover;
          background-position: center;
          border-radius: 22px;
          min-height: 520px;
          padding: 26px 20px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
        }

        .ll-invite-content {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          min-height: 100%;
          transform: translateY(-18px);
        }

        .ll-invite-brand {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          margin-bottom: 10px;
        }

        .ll-invite-top {
          font-size: 18px;
          font-weight: 800;
          color: rgba(255,255,255,0.96);
          letter-spacing: 0.04em;
          text-shadow: 0 2px 8px rgba(0,0,0,0.18);
        }

        .ll-invite-title {
          font-size: 22px;
          font-weight: 800;
          margin-top: 0;
          color: #2f241d;
          text-shadow: 0 1px 2px rgba(255,255,255,0.35);
        }

        .ll-invite-btn {
          margin-top: 12px;
          display: inline-block;
          padding: 12px 20px;
          border-radius: 999px;
          background: rgba(255,255,255,0.78);
          border: 1px solid rgba(47,36,29,0.12);
          font-weight: 700;
          color: #2f241d;
        }

        .ll-section {
          padding-top: 70px;
          padding-bottom: 70px;
        }

        .ll-section-intro {
          margin-bottom: 10px;
        }

        .ll-section-title {
          font-size: 36px;
          line-height: 1.1;
          margin: 0 0 24px 0;
          max-width: 760px;
        }

        .ll-feature-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        .ll-feature-card,
        .ll-why-item {
          background: rgba(255,255,255,0.78);
          border-radius: 22px;
          padding: 22px;
          border: 1px solid rgba(47,36,29,0.08);
          box-shadow: 0 16px 38px rgba(47,36,29,0.06);
        }

        .ll-feature-icon {
          font-size: 28px;
          margin-bottom: 12px;
        }

        .ll-feature-title,
        .ll-why-title {
          font-weight: 800;
          font-size: 18px;
          margin-bottom: 8px;
        }

        .ll-feature-text,
        .ll-why-text,
        .ll-demo-text,
        .ll-interest-text {
          color: rgba(47,36,29,0.72);
          line-height: 1.65;
          font-size: 16px;
        }

        .ll-demo {
          padding-top: 20px;
          padding-bottom: 70px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
          align-items: center;
        }

        .ll-demo-right {
          display: flex;
          justify-content: center;
        }

        .ll-demo-card {
          width: 100%;
          max-width: 480px;
          background: rgba(255,255,255,0.82);
          border-radius: 28px;
          border: 1px solid rgba(47,36,29,0.08);
          box-shadow: 0 20px 48px rgba(47,36,29,0.08);
          overflow: hidden;
        }

        .ll-demo-top {
          padding: 14px 18px;
          border-bottom: 1px solid rgba(47,36,29,0.08);
          font-weight: 800;
          color: #6b5b4f;
        }

        .ll-demo-body {
          padding: 34px;
          text-align: center;
        }

        .ll-demo-envelope {
          font-size: 72px;
        }

        .ll-demo-title {
          margin-top: 14px;
          font-size: 28px;
          font-weight: 800;
        }

        .ll-demo-sub {
          margin-top: 8px;
          color: rgba(47,36,29,0.64);
        }

        .ll-why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .ll-interest {
          padding-top: 20px;
          padding-bottom: 90px;
        }

        .ll-interest-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(243,232,220,0.92) 100%);
          border-radius: 30px;
          padding: 34px 28px;
          border: 1px solid rgba(47,36,29,0.08);
          box-shadow: 0 20px 48px rgba(47,36,29,0.08);
          text-align: center;
        }

        .ll-interest-title {
          font-size: 38px;
          margin: 0 0 12px 0;
        }

        .ll-interest-text {
          max-width: 760px;
          margin: 0 auto 22px;
        }

        .ll-contact-wrap {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .ll-contact-title {
          font-size: 14px;
          font-weight: 700;
          color: #8d7363;
          letter-spacing: 0.05em;
        }

        .ll-contact-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 980px) {
          .ll-hero,
          .ll-demo {
            grid-template-columns: 1fr;
          }

          .ll-feature-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .ll-why-grid {
            grid-template-columns: 1fr;
          }

          .ll-hero-title {
            font-size: 42px;
          }

          .ll-section-title {
            font-size: 30px;
          }

          .ll-interest-title {
            font-size: 32px;
          }

          .ll-hero-card {
            order: 2;
          }

          .ll-hero-content {
            order: 1;
          }
        }

        @media (max-width: 640px) {
          .ll-topbar,
          .ll-section,
          .ll-hero,
          .ll-demo,
          .ll-interest {
            padding-left: 16px;
            padding-right: 16px;
          }

          .ll-topbar {
            padding-top: 14px;
            padding-bottom: 10px;
            justify-content: center;
          }

          .ll-brand-wrap {
            width: 100%;
            justify-content: center;
            text-align: center;
            flex-direction: column;
            gap: 8px;
          }

          .ll-brand-text {
            align-items: center;
          }

          .ll-hero {
            padding-top: 18px;
            padding-bottom: 44px;
            gap: 20px;
          }

          .ll-eyebrow {
            font-size: 11px;
            line-height: 1.4;
          }

          .ll-hero-title {
            font-size: 32px;
            line-height: 1.08;
          }

          .ll-hero-text,
          .ll-demo-text,
          .ll-interest-text,
          .ll-feature-text,
          .ll-why-text {
            font-size: 15px;
            line-height: 1.6;
          }

          .ll-buttons,
          .ll-contact-buttons {
            flex-direction: column;
            align-items: stretch;
          }

          .ll-btn-primary,
          .ll-btn-secondary {
            width: 100%;
          }

          .ll-hero-card-inner,
          .ll-interest-card,
          .ll-demo-card,
          .ll-feature-card,
          .ll-why-item {
            border-radius: 22px;
          }

          .ll-phone-mock {
            max-width: 290px;
            padding: 10px;
            border-radius: 26px;
          }

          .ll-phone-screen {
            min-height: 470px;
            padding: 22px 16px 18px;
          }

          .ll-invite-content {
            transform: translateY(-8px);
          }

          .ll-section {
            padding-top: 46px;
            padding-bottom: 46px;
          }

          .ll-demo {
            padding-top: 10px;
            padding-bottom: 46px;
          }

          .ll-feature-grid {
            grid-template-columns: 1fr;
          }

          .ll-section-title {
            font-size: 26px;
          }

          .ll-interest-title {
            font-size: 28px;
          }

          .ll-demo-envelope {
            font-size: 58px;
          }

          .ll-demo-title {
            font-size: 24px;
          }

          .ll-demo-body {
            padding: 24px 18px;
          }

          .ll-interest {
            padding-top: 10px;
            padding-bottom: 56px;
          }
        }
      `}</style>

      <main className="ll-page">
        <header className="ll-topbar">
          <div className="ll-brand-wrap">
            <Image
              src="/brand/logo-dark.png"
              alt="Lab Lou"
              width={110}
              height={110}
              style={{ width: 100, height: "auto" }}
              priority
            />
            <div className="ll-brand-text">
              <div className="ll-brand-title">Lab Lou Events</div>
              <div className="ll-brand-sub">Online invitations with elegance</div>
            </div>
          </div>
        </header>

        <section className="ll-hero">
          <div className="ll-hero-glow" />
          <div className="ll-hero-content">
            <div className="ll-eyebrow">
              Digital invitations for wedding & baptism
            </div>

            <h1 className="ll-hero-title">
              Online προσκλητήρια
              <br />
              με κομψότητα, ταυτότητα και RSVP
            </h1>

            <p className="ll-hero-text">
              Δημιούργησε ένα μοναδικό online προσκλητήριο με όμορφη εμπειρία για
              τους καλεσμένους σου, χάρτες, RSVP φόρμα και προσωποποιημένο link.
            </p>

            <div className="ll-buttons">
              <a href="#demo" className="ll-btn-primary">
                Δες demo
              </a>

              <a href="#interest" className="ll-btn-secondary">
                Εκδήλωση ενδιαφέροντος
              </a>
            </div>
          </div>

          <div className="ll-hero-card">
            <div className="ll-hero-card-inner">
              <div className="ll-hero-card-label">Preview Experience</div>

              <div className="ll-phone-mock">
                <div className="ll-phone-screen">
                  <div className="ll-invite-content">
                    <div className="ll-invite-brand">
                      <Image
                        src="/brand/logo-white.png"
                        alt="Lab Lou"
                        width={70}
                        height={70}
                        style={{
                          width: 70,
                          height: "auto",
                          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.18))",
                        }}
                      />
                      <div className="ll-invite-top">Lab Lou Events</div>
                    </div>

                    <Image
                      src="/invite-preview/envelope.png"
                      alt="Envelope"
                      width={158}
                      height={158}
                      style={{ marginBottom: 14 }}
                    />

                    <div className="ll-invite-title">Έχεις πρόσκληση</div>

                    <div className="ll-invite-btn">Άνοιγμα προσκλητηρίου</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ll-section">
          <div className="ll-section-intro">Τι περιλαμβάνει</div>
          <h2 className="ll-section-title">
            Όλα όσα χρειάζεται ένα σύγχρονο προσκλητήριο
          </h2>

          <div className="ll-feature-grid">
            <div className="ll-feature-card">
              <div className="ll-feature-icon">✨</div>
              <div className="ll-feature-title">Elegant εμπειρία</div>
              <div className="ll-feature-text">
                Αισθητικό αποτέλεσμα με premium παρουσίαση και mobile-friendly
                σχεδιασμό.
              </div>
            </div>

            <div className="ll-feature-card">
              <div className="ll-feature-icon">📍</div>
              <div className="ll-feature-title">Χάρτες εκκλησίας & κέντρου</div>
              <div className="ll-feature-text">
                Ο καλεσμένος πατάει και ανοίγει κατευθείαν τις σωστές οδηγίες.
              </div>
            </div>

            <div className="ll-feature-card">
              <div className="ll-feature-icon">💌</div>
              <div className="ll-feature-title">RSVP φόρμα</div>
              <div className="ll-feature-text">
                Άμεση απάντηση παρουσίας με σωστή οργάνωση των καλεσμένων.
              </div>
            </div>

            <div className="ll-feature-card">
              <div className="ll-feature-icon">🔗</div>
              <div className="ll-feature-title">Μοναδικό private link</div>
              <div className="ll-feature-text">
                Κάθε event έχει το δικό του link και το δικό του token πρόσβασης.
              </div>
            </div>
          </div>
        </section>

        <section id="demo" className="ll-demo">
          <div>
            <div className="ll-section-intro">Demo</div>
            <h2 className="ll-section-title">
              Δες πώς παρουσιάζεται ένα online προσκλητήριο
            </h2>
            <p className="ll-demo-text">
              Από το άνοιγμα του φακέλου μέχρι το RSVP, η εμπειρία είναι φτιαγμένη
              ώστε να είναι όμορφη, καθαρή και εύκολη για κάθε καλεσμένο.
            </p>

            <div className="ll-buttons">
              <a
                href="/e/thanasis-myrto-2026?t=rose8829"
                className="ll-btn-primary"
              >
                Άνοιξε το demo
              </a>

              <a href="#interest" className="ll-btn-secondary">
                Θέλω το δικό μου
              </a>
            </div>
          </div>

          <div className="ll-demo-right">
            <div className="ll-demo-card">
              <div className="ll-demo-top">Live Demo</div>
              <div className="ll-demo-body">
                <div className="ll-demo-envelope">✉️</div>
                <div className="ll-demo-title">Θανάσης & Μυρτώ</div>
                <div className="ll-demo-sub">Elegant online invitation</div>
              </div>
            </div>
          </div>
        </section>

        <section className="ll-section">
          <div className="ll-section-intro">Γιατί να το επιλέξεις</div>
          <h2 className="ll-section-title">Γιατί ξεχωρίζει</h2>

          <div className="ll-why-grid">
            <div className="ll-why-item">
              <div className="ll-why-title">Εικόνα που εντυπωσιάζει</div>
              <div className="ll-why-text">
                Δεν είναι ένα απλό link. Είναι μια ολόκληρη εμπειρία invitation.
              </div>
            </div>

            <div className="ll-why-item">
              <div className="ll-why-title">Οργάνωση χωρίς χάος</div>
              <div className="ll-why-text">
                Οι απαντήσεις RSVP συγκεντρώνονται σε admin panel με καθαρή εικόνα.
              </div>
            </div>

            <div className="ll-why-item">
              <div className="ll-why-title">Σχεδιασμένο για κινητό</div>
              <div className="ll-why-text">
                Οι περισσότεροι καλεσμένοι θα το ανοίξουν από κινητό, κι εκεί λάμπει.
              </div>
            </div>
          </div>
        </section>

        <section id="interest" className="ll-interest">
          <div className="ll-interest-card">
            <div className="ll-section-intro">Εκδήλωση ενδιαφέροντος</div>
            <h2 className="ll-interest-title">
              Θέλεις το δικό σου online προσκλητήριο;
            </h2>
            <p className="ll-interest-text">
              Ιδανικό για γάμο, βάφτιση και events με αισθητική, λειτουργικότητα και
              premium παρουσίαση.
            </p>

            <div className="ll-contact-wrap">
              <div className="ll-contact-title">Επίλεξε τρόπο επικοινωνίας</div>

              <div className="ll-contact-buttons">
                <a
                  href="mailto:info@lablou.gr?subject=Ενδιαφέρομαι για online προσκλητήριο"
                  className="ll-btn-primary"
                >
                  📧 Email
                </a>

                <a
                  href="viber://chat?number=%2B306943910973"
                  className="ll-btn-secondary"
                >
                  💜 Viber
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}