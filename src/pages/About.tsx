const About = () => {
  const stats = [
    { value: "25+", label: "Years of Excellence" },
    { value: "50K+", label: "Happy Customers" },
    { value: "10K+", label: "Unique Designs" },
  ];

  const features = [
    {
      icon: "◈",
      title: "BIS Hallmarked Jewellery",
      desc: "Every piece is certified for purity and quality by Bureau of Indian Standards.",
    },
    {
      icon: "✦",
      title: "Expert Craftsmanship",
      desc: "Skilled artisans with generations of knowledge create stunning designs.",
    },
    {
      icon: "⟳",
      title: "Easy Exchange Policy",
      desc: "Hassle-free exchange with transparent pricing and fair valuation.",
    },
    {
      icon: "◉",
      title: "Lifetime Warranty",
      desc: "Free polishing and lifetime warranty against manufacturing defects.",
    },
    {
      icon: "▣",
      title: "Flexible Payment",
      desc: "Multiple payment options including EMI facilities available.",
    },
    {
      icon: "◎",
      title: "Secure Delivery",
      desc: "Fully insured shipping with safe and secure packaging.",
    },
  ];

  return (
    <div
      style={{
        background: "#faf8f4",
        minHeight: "100vh",
        fontFamily: "-apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif",
        color: "#1a1a1a",
      }}
    >
      <style>{`
        :root {
          --gold: #c9960c;
          --gold-light: #e8b84b;
          --gold-pale: #fdf3d6;
          --gold-border: rgba(201,150,12,0.28);
          --cream: #faf8f4;
          --cream2: #f5f0e6;
          --border: #e8dcc8;
          --white: #ffffff;
          --text-main: #1a1a1a;
          --text-muted: #7a7065;
          --text-light: #b0a090;
        }

        /* Hero */
        .about-hero {
          background: var(--white);
          text-align: center;
          padding: 72px 24px 60px;
          border-bottom: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }
        .about-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 65% 55% at 50% 0%, rgba(201,150,12,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .ornament-row {
          display: flex; align-items: center; justify-content: center;
          gap: 14px; margin-bottom: 18px;
        }
        .orn-line {
          width: 56px; height: 1px;
          background: linear-gradient(to right, transparent, var(--gold));
        }
        .orn-line.r { background: linear-gradient(to left, transparent, var(--gold)); }
        .orn-dot {
          width: 7px; height: 7px;
          background: var(--gold); transform: rotate(45deg);
        }
        .hero-eyebrow {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.32em; text-transform: uppercase;
          color: var(--gold); margin-bottom: 14px;
        }
        .hero-title {
          font-size: clamp(30px, 5vw, 50px);
          font-weight: 700; color: var(--text-main);
          line-height: 1.15; letter-spacing: -0.6px;
          margin-bottom: 16px;
        }
        .hero-title span { color: var(--gold); }
        .hero-sub {
          font-size: 15px; font-weight: 400;
          color: var(--text-muted); line-height: 1.8;
          max-width: 480px; margin: 0 auto;
        }

        /* Stats bar */
        .stats-bar {
          background: var(--white);
          border-bottom: 1px solid var(--border);
          display: grid; grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 480px) { .stats-bar { grid-template-columns: 1fr; } }
        .stat-cell {
          padding: 40px 20px; text-align: center;
          border-right: 1px solid var(--border);
          transition: background 0.2s;
        }
        .stat-cell:last-child { border-right: none; }
        .stat-cell:hover { background: var(--gold-pale); }
        .stat-num {
          font-size: 38px; font-weight: 700;
          color: var(--gold); line-height: 1;
          letter-spacing: -1px; margin-bottom: 8px;
        }
        .stat-lbl {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: var(--text-muted);
        }

        /* Section heading (matches homepage style) */
        .sec-head { text-align: center; margin-bottom: 40px; }
        .sec-head h2 {
          font-size: 22px; font-weight: 700;
          color: var(--text-main); margin-bottom: 10px;
          letter-spacing: -0.2px;
        }
        .gold-rule {
          display: flex; align-items: center;
          justify-content: center; gap: 10px;
        }
        .gold-rule span {
          width: 38px; height: 1px;
          background: var(--gold); opacity: 0.55;
        }
        .gold-rule i { color: var(--gold); font-size: 9px; font-style: normal; }

        /* Story */
        .story-wrap {
          padding: 72px 24px;
          max-width: 1000px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 56px; align-items: center;
        }
        @media (max-width: 700px) { .story-wrap { grid-template-columns: 1fr; gap: 32px; } }
        .story-badge {
          display: inline-block;
          background: var(--gold-pale);
          color: var(--gold);
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          padding: 5px 14px; border-radius: 20px;
          margin-bottom: 18px;
          border: 1px solid var(--gold-border);
        }
        .story-left h2 {
          font-size: 26px; font-weight: 700;
          color: var(--text-main); margin-bottom: 18px;
          line-height: 1.3; letter-spacing: -0.3px;
        }
        .story-left p {
          font-size: 14px; font-weight: 400;
          color: var(--text-muted); line-height: 1.9; margin-bottom: 12px;
        }
        .quote-card {
          background: var(--cream2);
          border: 1px solid var(--border);
          border-radius: 18px; padding: 40px 36px;
          position: relative; overflow: hidden;
        }
        .quote-card::before {
          content: '"';
          position: absolute; top: -18px; left: 18px;
          font-size: 130px; font-weight: 700;
          color: rgba(201,150,12,0.09); line-height: 1;
          font-family: Georgia, serif;
        }
        .quote-text {
          font-size: 17px; font-weight: 500;
          color: var(--text-main); line-height: 1.75;
          font-style: italic; margin-bottom: 20px;
          position: relative; z-index: 1;
        }
        .quote-author {
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--gold);
        }

        /* Why Choose Us */
        .why-wrap {
          background: var(--white);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 72px 24px;
        }
        .features-grid {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 18px; max-width: 1000px; margin: 0 auto;
        }
        @media (max-width: 768px) { .features-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 480px) { .features-grid { grid-template-columns: 1fr; } }
        .feat-card {
          background: var(--cream);
          border: 1px solid var(--border);
          border-radius: 14px; padding: 26px 22px;
          transition: box-shadow 0.25s, transform 0.25s, border-color 0.25s;
        }
        .feat-card:hover {
          box-shadow: 0 6px 28px rgba(201,150,12,0.11);
          transform: translateY(-3px);
          border-color: rgba(201,150,12,0.45);
        }
        .feat-icon {
          width: 42px; height: 42px;
          background: var(--gold-pale);
          border: 1px solid var(--gold-border);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 17px; color: var(--gold);
          margin-bottom: 14px;
        }
        .feat-title {
          font-size: 14px; font-weight: 700;
          color: var(--text-main); margin-bottom: 8px;
        }
        .feat-desc {
          font-size: 13px; font-weight: 400;
          color: var(--text-muted); line-height: 1.75;
        }

        /* Visit */
        .visit-wrap {
          padding: 72px 24px;
          max-width: 1000px; margin: 0 auto;
        }
        .visit-card {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: 20px; overflow: hidden;
          display: grid; grid-template-columns: 1fr 1fr;
          box-shadow: 0 4px 24px rgba(0,0,0,0.05);
        }
        @media (max-width: 640px) { .visit-card { grid-template-columns: 1fr; } }
        .visit-left {
          background: linear-gradient(135deg, #fdf6e3 0%, #f8eccc 100%);
          padding: 52px 44px;
          border-right: 1px solid var(--border);
          display: flex; flex-direction: column; justify-content: center;
        }
        .visit-left h2 {
          font-size: 24px; font-weight: 700;
          color: var(--text-main); margin-bottom: 14px;
          letter-spacing: -0.3px;
        }
        .visit-left p {
          font-size: 14px; color: var(--text-muted);
          line-height: 1.8; margin-bottom: 28px;
        }
        .visit-btn {
          display: inline-flex; align-items: center;
          gap: 8px;
          background: var(--gold); color: #fff;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.18em; text-transform: uppercase;
          padding: 13px 28px; border-radius: 8px;
          border: none; cursor: pointer;
          text-decoration: none; width: fit-content;
          transition: background 0.2s, transform 0.15s;
        }
        .visit-btn:hover { background: #b8850a; transform: translateY(-1px); }
        .visit-right {
          padding: 52px 44px;
          display: flex; flex-direction: column;
          justify-content: center; gap: 24px;
        }
        .contact-row {
          display: flex; align-items: flex-start; gap: 14px;
        }
        .contact-icon {
          width: 40px; height: 40px;
          background: var(--gold-pale);
          border: 1px solid var(--gold-border);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; flex-shrink: 0;
        }
        .contact-lbl {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--text-light); margin-bottom: 4px;
        }
        .contact-val {
          font-size: 14px; font-weight: 500;
          color: var(--text-main); line-height: 1.5;
        }
      `}</style>

      {/* Hero */}
      <div className="about-hero">
        <div className="ornament-row">
          <div className="orn-line" />
          <div className="orn-dot" />
          <div className="orn-line r" />
        </div>
        <p className="hero-eyebrow">Est. 1998 · Vijayawada, India</p>
        <h1 className="hero-title">
          About <span>Tamiri</span> Jewellers
        </h1>
        <p className="hero-sub">
          Crafting heirlooms since 1998 — where tradition meets artistry,
          and every piece becomes a story worth passing down.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        {stats.map((s) => (
          <div className="stat-cell" key={s.label}>
            <div className="stat-num">{s.value}</div>
            <div className="stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Story */}
      <div className="story-wrap">
        <div className="story-left">
          <span className="story-badge">Our Story</span>
          <h2>A Legacy Built on Trust &amp; Craftsmanship</h2>
          <p>
            Founded in 1998, Tamiri Jewellers has been serving customers for over 25 years
            with exquisite jewellery crafted from the finest materials. What started as a
            small family business in Vijayawada has grown into one of the most trusted names
            in jewellery across Andhra Pradesh.
          </p>
          <p>
            Our commitment to quality, purity, and craftsmanship has made us the preferred
            choice for weddings, festivals, and special occasions — helping our customers
            create memories that last generations.
          </p>
        </div>
        <div className="quote-card">
          <p className="quote-text">
            "Every piece of jewellery tells a story. We exist to help you create memories
            that will be treasured for generations to come."
          </p>
          <p className="quote-author">— Tamiri Jewellers, Since 1998</p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="why-wrap">
        <div className="sec-head">
          <h2>Why Choose Us</h2>
          <div className="gold-rule">
            <span /><i>◆</i><span />
          </div>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feat-card" key={f.title}>
              <div className="feat-icon">{f.icon}</div>
              <p className="feat-title">{f.title}</p>
              <p className="feat-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Visit */}
      <div className="visit-wrap">
        <div className="sec-head">
          <h2>Visit Our Store</h2>
          <div className="gold-rule">
            <span /><i>◆</i><span />
          </div>
        </div>
        <div className="visit-card">
          <div className="visit-left">
            <h2>Come See Us in Person</h2>
            <p>
              Experience our exquisite collection in person. Our jewellery experts are
              ready to help you find the perfect piece for your most cherished moments.
            </p>
            <a href="/contact" className="visit-btn">Get Directions →</a>
          </div>
          <div className="visit-right">
            <div className="contact-row">
              <div className="contact-icon">📍</div>
              <div>
                <p className="contact-lbl">Address</p>
                <p className="contact-val">Rajagopalachari Street, Governorpet<br />Vijayawada — 520002</p>
              </div>
            </div>
            <div className="contact-row">
              <div className="contact-icon">📞</div>
              <div>
                <p className="contact-lbl">Phone</p>
                <p className="contact-val">+91 99591 45959</p>
              </div>
            </div>
            <div className="contact-row">
              <div className="contact-icon">⏰</div>
              <div>
                <p className="contact-lbl">Store Hours</p>
                <p className="contact-val">Mon – Sun: 10:00 AM – 9:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;