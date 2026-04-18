import React from 'react';
import naturalDiamondsImg from '../assets/naturaldiamonds.png';
import keyFactsImg from '../assets/keyfacts.png';
import grownDiamondsImg from '../assets/growndiamonds.jpg';
import keyFeaturesImg from '../assets/keyfeatures.png';

const LabVsNaturalDiamonds = () => {
  const goldColor = "#C9910A";
  const textDark = "#111";
  const textMid = "#333";
  const textLight = "#444";

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#fff',
    fontFamily: 'Georgia, "Times New Roman", serif',
    color: textMid,
    fontSize: '16px',
    lineHeight: '1.7',
    padding: '0 0 60px',
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  };

  const sectionHeadingStyle: React.CSSProperties = {
    fontSize: '22px',
    fontWeight: '700',
    color: goldColor,
    textAlign: 'center',
    marginBottom: '20px',
    textDecoration: 'underline',
    textTransform: 'uppercase',
  };

  const subHeadingStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '700',
    color: goldColor,
    marginBottom: '10px',
    textDecoration: 'underline',
  };

  const listStyle: React.CSSProperties = {
    paddingLeft: '20px',
    margin: '0 0 15px',
    listStyleType: 'disc',
  };

  const Gold = ({ children, underline }: { children: React.ReactNode, underline?: boolean }) => (
    <span style={{ color: goldColor, fontWeight: '700', textDecoration: underline ? 'underline' : 'none' }}>{children}</span>
  );

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        
        {/* ── PAGE TITLE ── */}
        <h1 style={{ fontSize: '32px', fontWeight: '700', textAlign: 'center', marginBottom: '20px', color: textDark }}>
          Lab Diamonds vs Natural Diamonds
        </h1>

        <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto 40px' }}>
          <p style={{ marginBottom: '10px' }}>
            At <Gold>TAMIRI JEWELLERS PVT LTD</Gold>, we understand that choosing the perfect diamond is a meaningful decision. Today, customers often ask
          </p>
          <p style={{ color: goldColor, fontStyle: 'italic', marginBottom: '15px', fontWeight: '700', fontSize: '18px' }}>
            "Should I buy a Natural Diamond (or) a Lab-Grown Diamond?"
          </p>
          <p style={{ color: textLight }}>
            Both options are beautiful, durable, and chemically identical. However, they differ in origin, value, and pricing. This guide will help you understand the differences clearly so you can make an informed and confident choice.
          </p>
        </div>

        {/* ── SECTION 1: What Are Natural Diamonds? ── */}
        <h2 style={sectionHeadingStyle}>What Are Natural Diamonds?</h2>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '60px' }}>
          <div style={{ flex: 1 }}>
            <p style={{ marginBottom: '15px' }}>
              Natural diamonds are formed <Gold underline>deep beneath the Earth's surface</Gold> under extreme heat and pressure over <Gold underline>1 to 3 billion years</Gold>. They are mined from natural deposits and considered one of nature's rarest treasures.
            </p>
            <h3 style={subHeadingStyle}>How They Are Formed</h3>
            <ul style={listStyle}>
              <li>Created 100–200km beneath the Earth's surface.</li>
              <li>Formed at temperatures above 1,000°c.</li>
              <li>Brought closer to the surface through volcanic activity.</li>
            </ul>
            <h3 style={subHeadingStyle}>Why Natural Diamonds Are Special</h3>
            <ul style={listStyle}>
              <li>Each diamond is one of a kind.</li>
              <li>Known for their exceptional brilliance and durability.</li>
              <li>A timeless symbol of love, strength, and eternity.</li>
            </ul>
          </div>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <img src={naturalDiamondsImg} alt="Natural Diamond Formation" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
        </div>

        {/* ── Key Facts of Natural Diamonds ── */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '40px', marginBottom: '60px' }}>
          <h2 style={sectionHeadingStyle}>Key Facts of Natural Diamonds</h2>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <img src={keyFactsImg} alt="Natural Diamond Brilliance" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
            <div style={{ flex: 1.5 }}>
              <p style={{ marginBottom: '15px' }}>
                Diamond colour is graded based on how colourless a diamond is. The less colour, the higher the rarity and value.
              </p>
              <ul style={{ ...listStyle, listStyleType: 'none', paddingLeft: 0 }}>
                <li style={{ marginBottom: '8px' }}><Gold>Formed naturally</Gold> Made of pure carbon over billions of years.</li>
                <li style={{ marginBottom: '8px' }}><Gold>Hardest</Gold> natural substance on Earth (10 on Mohs scale).</li>
                <li style={{ marginBottom: '8px' }}><Gold>Rare</Gold>, making them highly valuable.</li>
                <li style={{ marginBottom: '8px' }}>Each stone has a <Gold underline>unique natural fingerprint</Gold>.</li>
                <li style={{ marginBottom: '8px' }}>Traditionally chosen for engagement rings and luxury jewellery.</li>
                <li style={{ marginBottom: '8px' }}>Hold stronger <Gold underline>long-term resale value</Gold>.</li>
              </ul>
            </div>
          </div>
          <p style={{ textAlign: 'center', marginTop: '30px', fontStyle: 'italic' }}>
            At <Gold>TAMIRI JEWELLERS</Gold>, we source natural diamonds ethically, ensuring transparency and authenticity.
          </p>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '60px 0' }} />

        {/* ── SECTION 2: What Are Lab-Grown Diamonds? ── */}
        <h2 style={sectionHeadingStyle}>What Are Lab - Grown Diamonds?</h2>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '60px' }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <img src={grownDiamondsImg} alt="Lab Diamond Creation" style={{ maxWidth: '100%', height: 'auto' }} />
          </div>
          <div style={{ flex: 1.5 }}>
            <p style={{ marginBottom: '15px' }}>
              Lab-grown diamonds – also called <Gold underline>Lab Diamonds or Man-Made Diamonds</Gold> – are created in a controlled laboratory using advanced technology. They have the <Gold underline>same chemical, physical, and optical properties</Gold> as natural diamonds.
            </p>
            <h3 style={subHeadingStyle}>How Lab Diamonds Are Made</h3>
            <p style={{ marginBottom: '10px', fontWeight: '700' }}>Two main methods:</p>
            <ul style={listStyle}>
              <li><Gold>HPHT</Gold> (High Pressure High Temperature)</li>
              <li><Gold>CVD</Gold> (Chemical Vapor Deposition)</li>
            </ul>
            <p style={{ fontStyle: 'italic', color: textLight }}>Both replicate the natural diamond-forming environment.</p>
          </div>
        </div>
        <p style={{ textAlign: 'center', marginBottom: '60px' }}>
          Whether you prefer a subtle, elegant stone or a bold statement diamond, <Gold>TAMIRI JEWELLERS</Gold>, offers a wide selection to match every desire.
        </p>

        {/* ── Key Features of Lab Diamonds ── */}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '40px', marginBottom: '60px' }}>
          <h2 style={sectionHeadingStyle}>Key Features of Lab Diamonds</h2>
          <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
            <div style={{ flex: 1.5 }}>
              <ul style={{ ...listStyle, listStyleType: 'none', paddingLeft: 0 }}>
                <li style={{ marginBottom: '12px' }}><Gold>100% Real</Gold> Diamonds, Not imitations.</li>
                <li style={{ marginBottom: '12px' }}><Gold>More affordable</Gold> (30-60% less expensive than natural diamonds)</li>
                <li style={{ marginBottom: '12px' }}><Gold>Environmentally</Gold> Responsible Option</li>
                <li style={{ marginBottom: '12px' }}>Available in <Gold underline>larger sizes</Gold> at the same budget</li>
                <li style={{ marginBottom: '12px' }}><Gold>Certified</Gold> just like natural diamonds (IGI, GIA, SGL etc.)</li>
              </ul>
            </div>
            <div style={{ flex: 1, textAlign: 'center' }}>
              <img src={keyFeaturesImg} alt="Lab Diamond Features" style={{ maxWidth: '100%', height: 'auto' }} />
            </div>
          </div>
        </div>

        {/* ── SECTION 3: Which One Should You Choose? ── */}
        <h2 style={sectionHeadingStyle}>Which One Should You Choose?</h2>
        <div style={{ display: 'flex', gap: '40px', marginBottom: '40px' }}>
          <div style={{ flex: 1, padding: '20px', background: '#fcfcfc', borderRadius: '10px', border: '1px solid #eee' }}>
            <h3 style={{ ...subHeadingStyle, textAlign: 'center' }}>Choose a Natural Diamond If You Want</h3>
            <ul style={listStyle}>
              <li>A gemstone formed by nature.</li>
              <li>Long-term investment value.</li>
              <li>Traditional elegance and rarity.</li>
              <li>High emotional & luxury appeal.</li>
            </ul>
          </div>
          <div style={{ flex: 1, padding: '20px', background: '#fcfcfc', borderRadius: '10px', border: '1px solid #eee' }}>
            <h3 style={{ ...subHeadingStyle, textAlign: 'center' }}>Choose a Lab-Grown Diamond If You Want</h3>
            <ul style={listStyle}>
              <li>A larger or higher-quality diamond within your budget.</li>
              <li>An eco-friendly, modern choice.</li>
              <li>The same beauty and sparkle at a more affordable price.</li>
            </ul>
          </div>
        </div>
        <p style={{ textAlign: 'center', marginBottom: '60px' }}>
          At <Gold>TAMIRI JEWELLERS</Gold>, we proudly offer both Natural and Lab-Grown Diamonds, ensuring that every customer finds the perfect stone that matches their preference and purpose.
        </p>

        {/* ── Tamiri Jewellers Pvt Ltd Promise ── */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ ...sectionHeadingStyle, textDecoration: 'none' }}>Tamiri Jewellers Pvt Ltd Promise</h2>
          <div style={{ display: 'inline-block', textAlign: 'left' }}>
            {[
              'Ethically sourced natural diamonds',
              'Premium-quality lab-grown diamonds',
              'Transparent pricing & certification',
              'Expert guidance from trained gemologists',
              'Custom designs for engagement rings, bridal sets, and luxury jewellery'
            ].map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', fontSize: '18px' }}>
                <span style={{ color: goldColor, fontWeight: '900' }}>✓</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Final Word ── */}
        <div style={{ textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '40px' }}>
          <h2 style={{ ...sectionHeadingStyle, textDecoration: 'none' }}>Final Word</h2>
          <p style={{ fontSize: '18px', maxWidth: '1600px', margin: '0 auto 20px' }}>
            Both <Gold>Lab Diamonds</Gold> and <Gold>Natural Diamonds</Gold> are brilliant choices. One offers <Gold>rare natural beauty</Gold>, while the other offers <Gold>modern affordability without compromising quality</Gold>.
          </p>
          <p style={{ fontSize: '18px' }}>
            At <Gold>TAMIRI JEWELLERS PVT LTD</Gold>, our goal is to help you choose a diamond that truly reflects your story, values, and celebration.
          </p>
        </div>

      </div>
    </div>
  );
};

export default LabVsNaturalDiamonds;
