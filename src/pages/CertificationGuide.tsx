import { useState } from "react";

const goldColor = "#C8962A";
const goldBg = "#fff8ee";
const textDark = "#222";
const textMid = "#444";
const borderGold = "#e0c070";

const QUESTION_FONT = "'Times New Roman', Times, serif";
const ANSWER_FONT = "-apple-system,'SF Pro Display','SF Pro Text',BlinkMacSystemFont,sans-serif";

const chevronDown = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={goldColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const chevronUp = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={goldColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);
const checkIcon = (color = goldColor) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8, flexShrink: 0, marginTop: 2 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const bulletDot = (
  <span style={{ display: 'inline-block', width: 7, height: 7, borderRadius: '50%', background: goldColor, marginRight: 10, marginTop: 6, flexShrink: 0 }} />
);

function AccordionSection({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      borderRadius: 12,
      border: `1px solid ${borderGold}`,
      marginBottom: 16,
      background: '#fff',
      overflow: 'hidden',
      boxShadow: '0 1px 6px rgba(200,150,42,0.07)'
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 28px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 24, fontWeight: 700, color: goldColor, letterSpacing: 0.2, fontFamily: QUESTION_FONT }}>{title}</span>
        {open ? chevronUp : chevronDown}
      </button>
      {open && (
        <div style={{ padding: '0 28px 24px', borderTop: `1px solid #f0e0b0`, background: '#fffdf8' }}>
          {children}
        </div>
      )}
    </div>
  );
}

function CheckItem({ children, color = goldColor }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 7 }}>
      {checkIcon(color)}
      <span style={{ fontSize: 18, color: textMid, lineHeight: 1.6, fontFamily: ANSWER_FONT }}>{children}</span>
    </div>
  );
}

function BulletItem({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 6 }}>
      {bulletDot}
      <span style={{ fontSize: 18, color: textMid, lineHeight: 1.6, fontFamily: ANSWER_FONT }}>{children}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 20,
      fontWeight: 700,
      color: goldColor,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 10,
      marginTop: 18,
    }}>
      {children}
    </div>
  );
}

export default function CertificationGuide() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9f5ef',
      fontFamily: "'Georgia', 'Times New Roman', serif",
      padding: '0 0 60px',
    }}>
      {/* Hero Banner */}
      <div style={{
        background: `linear-gradient(135deg, #fffaf0 0%, #fff8ee 60%, #fdf0d0 100%)`,
        borderBottom: `2px solid ${borderGold}`,
        padding: '40px 24px 30px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 1200, margin: '32px auto 0', padding: '0 20px' }}>
          <h1 style={{
            fontSize: 36,
            fontWeight: 700,
            color: textDark,
            margin: '0 0 16px',
            letterSpacing: 1,
          }}>Certification Guide</h1>
          <p style={{
            fontSize: 18,
            color: textMid,
            lineHeight: 1.75,
            margin: '0 auto',
            maxWidth: 2400,
            fontFamily: QUESTION_FONT,
          }}>
            When buying jewellery, honesty alone is not enough — <em style={{ color: goldColor }}>authenticity, purity</em>, and <em style={{ color: goldColor }}>trust</em> matter just as much.
            Jewellery certification is your guarantee that what you are buying is genuine, accurately graded, and fairly priced.
          </p>
          <div style={{
            marginTop: 18,
            fontSize: 18,
            color: textMid,
            fontFamily: QUESTION_FONT,
            lineHeight: 1.65,
          }}>
            At <strong style={{ color: goldColor }}>TAMIRI JEWELLERS PVT LTD</strong>, we believe an informed customer is a confident customer. This <span style={{ color: goldColor, textDecoration: 'underline', cursor: 'pointer' }}>Certification Guide</span> explains everything you need to know about gold, diamond, and gemstone certifications so you can shop with complete peace of mind.
          </div>
        </div>
      </div>

      {/* Accordion Content */}
      <div style={{ maxWidth: 1200, margin: '32px auto 0', padding: '0 20px' }}>

        {/* 1. What is Jewellery Certification */}
        <AccordionSection title="What Is Jewellery Certification?" defaultOpen={true}>
          <p style={{ fontSize: 18, color: textMid, lineHeight: 1.75, marginTop: 16, fontFamily: ANSWER_FONT }}>
            Jewellery certification is an official verification issued by authorised institutions that confirms:
          </p>
          <div style={{ marginTop: 8 }}>
            <BulletItem>Metal purity</BulletItem>
            <BulletItem>Diamond or gemstone authenticity</BulletItem>
            <BulletItem>Quality grading</BulletItem>
            <BulletItem>Weight and specifications</BulletItem>
          </div>
          <p style={{ fontSize: 18, color: textMid, lineHeight: 1.75, marginTop: 14, fontFamily: ANSWER_FONT }}>
            A certificate protects you from adulteration, overpricing, and misinformation.
          </p>
          <div style={{ marginTop: 18, padding: '14px 18px', background: goldBg, borderRadius: 10, border: `1px solid ${borderGold}` }}>
            <span style={{ fontFamily: ANSWER_FONT, fontSize: 18, color: textMid }}>
              At <strong style={{ color: goldColor }}>TAMIRI JEWELLERS</strong> every certified piece reflects our commitment to honesty and excellence.
            </span>
          </div>
        </AccordionSection>

        {/* 2. Why Certification Is Important */}
        <AccordionSection title="Why Certification Is Important." defaultOpen={false}>
          <div style={{ marginTop: 16 }}>
            <CheckItem>Confirms purity and authenticity.</CheckItem>
            <CheckItem>Ensures accurate pricing.</CheckItem>
            <CheckItem>Helps during resale or exchange.</CheckItem>
            <CheckItem>Gives trust and transparency.</CheckItem>
            <CheckItem>Acts as legal proof of quality.</CheckItem>
          </div>
          <div style={{ marginTop: 16, padding: '14px 18px', background: goldBg, borderRadius: 10, border: `1px solid ${borderGold}` }}>
            <span style={{ fontFamily: ANSWER_FONT, fontSize: 18, color: textMid }}>
              At <strong style={{ color: goldColor }}>TAMIRI JEWELLERS</strong> every certified piece reflects our commitment to honesty and excellence.
            </span>
          </div>
        </AccordionSection>

        {/* 3. Gold Certification & Hallmarking */}
        <AccordionSection title="Gold Certification & Hallmarking." defaultOpen={false}>
          <SectionTitle>What Is Gold Hallmarking?</SectionTitle>
          <p style={{ fontSize: 18, color: textMid, lineHeight: 1.75, fontFamily: ANSWER_FONT, margin: '0 0 10px' }}>
            Gold hallmarking confirms the purity of gold jewellery and is regulated in India by the <span style={{ color: goldColor }}>Bureau of Indian Standards (BIS)</span>.
          </p>

          <SectionTitle>BIS Hallmark Components.</SectionTitle>
          <p style={{ fontSize: 18, color: textMid, lineHeight: 1.75, fontFamily: ANSWER_FONT, margin: '0 0 12px' }}>
            Hallmark Unique Identification (HUID) is a mandatory, unique 6-digit alphanumeric code laser-inscribed on each piece of hallmarked gold jewellery in India, serving as a digital fingerprint for traceability and authenticity, part of the Bureau of Indian Standards (BIS) system that also includes the BIS logo and purity symbol. Customers can verify a piece's origin and purity by entering the HUID in the <span style={{ color: goldColor }}>BIS CARE App</span>.
          </p>
          <div style={{ fontFamily: ANSWER_FONT }}>
            {[
              ['BIS Logo', 'Indicates government authorised certification with HUD CODE on the article.'],
              ['Purity Mark', 'Example: 22K (916), 18K (750), 14K (585)'],
              ['Assaying & Hallmarking Centre Mark', '— Testing centre identification'],
              ['Jeweller\'s Identification Mark', '— Sets accountability'],
              ['Year of Hallmarking', '— Denoted by a code'],
            ].map(([k, v], i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 18 }}>
                <span style={{ color: goldColor, fontWeight: 700, minWidth: 20 }}>{i + 1}.</span>
                <span style={{ color: textMid }}><strong style={{ color: textDark }}>{k}</strong> — {v}</span>
              </div>
            ))}
          </div>

          <SectionTitle>Common Gold Purity Standards.</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 10, marginTop: 4 }}>
            {[
              ['24K (999)', 'Pure gold (not used for jewellery)'],
              ['22K (916)', 'Ideal for traditional jewellery'],
              ['18K (750)', 'Used for diamond jewellery'],
              ['14K (585)', 'Durable, daily-wear jewellery'],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: '12px 14px', background: goldBg, borderRadius: 10, border: `1px solid ${borderGold}` }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: goldColor, marginBottom: 4 }}>{k}</div>
                <div style={{ fontSize: 17, color: textMid, fontFamily: ANSWER_FONT }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: '14px 18px', background: goldBg, borderRadius: 10, border: `1px solid ${borderGold}` }}>
            <span style={{ fontFamily: ANSWER_FONT, fontSize: 17.5, color: textMid }}>
              <strong style={{ color: goldColor }}>TAMIRI JEWELLERS PROMISE:</strong> All our gold jewellery is BIS Hallmarked for guaranteed purity.
            </span>
          </div>
        </AccordionSection>

        {/* 4. Diamond Certification */}
        <AccordionSection title="Diamond Certification – What You Should Know." defaultOpen={false}>
          <p style={{ fontSize: 18, color: textMid, lineHeight: 1.75, fontFamily: ANSWER_FONT, marginTop: 16 }}>
            Diamond certification confirms that a diamond is genuine and professionally graded.
          </p>
          <SectionTitle>What a Diamond Certificate Includes</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 20px' }}>
            {['Diamond type (Natural or Lab-Grown)', 'Carat weight', 'Cut grade', 'Colour grade', 'Clarity grade', 'Measurements and proportions', 'Fluorescence details'].map(t => (
              <BulletItem key={t}>{t}</BulletItem>
            ))}
          </div>
          <p style={{ fontSize: 18, color: textMid, lineHeight: 1.75, fontFamily: ANSWER_FONT, marginTop: 10 }}>
            This information is based on the globally accepted <strong>4 C's of Diamonds</strong>.
          </p>
          <SectionTitle>Trusted Diamond Certification Laboratories</SectionTitle>
          <p style={{ fontSize: 18, color: textMid, lineHeight: 1.75, fontFamily: ANSWER_FONT, marginBottom: 8 }}>
            At <strong style={{ color: goldColor }}>TAMIRI JEWELLERS PVT LTD</strong>, we provide diamonds certified by reputed international and national laboratories such as:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 15, marginTop: 10 }}>
            {[
              ['GIA (Gemological Institute of America)', 'The world\'s most trusted name in diamond grading.'],
              ['IGI (International Gemological Institute)', 'The largest independent gem lab globally.'],
              ['SGL (Solitaire Gemological Laboratories)', 'A reputed national and international laboratory.'],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: '16px 20px', background: goldBg, borderRadius: 10, border: `1px solid ${borderGold}` }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: goldColor, marginBottom: 5 }}>{k}</div>
                <div style={{ fontSize: 17, color: textMid, fontFamily: ANSWER_FONT, lineHeight: 1.5 }}>{v}</div>
              </div>
            ))}
          </div>
        </AccordionSection>

        {/* 5. Solitaire Certification */}
        <AccordionSection title="Solitaire Certification." defaultOpen={false}>
          <p style={{ fontSize: 18, color: textMid, lineHeight: 1.75, fontFamily: ANSWER_FONT, marginTop: 16 }}>
            A solitaire is a single, significant diamond or gemstone set in jewellery. Due to its value, certification is even more critical.
          </p>
          <SectionTitle>Key Features of Solitaire Certification</SectionTitle>
          <div style={{ marginTop: 10 }}>
            <BulletItem>Laser Inscription — The certificate number is laser-etched on the diamond\'s girdle for verification.</BulletItem>
            <BulletItem>Full 4 C\'s Grading — Detailed breakdown of Cut, Colour, Clarity, and Carat.</BulletItem>
            <BulletItem>Plotting Diagram — A map showing the internal and external characteristics of the stone.</BulletItem>
          </div>
          <div style={{ marginTop: 18, padding: '14px 18px', background: goldBg, borderRadius: 10, border: `1px solid ${borderGold}` }}>
            <span style={{ fontFamily: ANSWER_FONT, fontSize: 18, color: textMid }}>
              Every solitaire from <strong style={{ color: goldColor }}>TAMIRI JEWELLERS</strong> comes with a full grading report from a leading laboratory.
            </span>
          </div>
        </AccordionSection>

        {/* 6. Certification for Resale & Exchange */}
        <AccordionSection title="Certification for Resale & Exchange." defaultOpen={false}>
          <p style={{ fontSize: 18, color: textMid, lineHeight: 1.75, fontFamily: ANSWER_FONT, marginTop: 16 }}>
            Having a valid certificate makes the process of reselling or exchanging jewellery transparent and hassle-free.
          </p>
          <SectionTitle>How Certification Helps</SectionTitle>
          <div style={{ marginTop: 10 }}>
            <BulletItem>Fair Valuation — The certificate ensures you get the right value based on quality grading.</BulletItem>
            <BulletItem>Easier Upgrade — Reputed jewellers accept certified diamonds and gold for upgrades more easily.</BulletItem>
            <BulletItem>Global Recognition — Internationally certified stones can be valued and traded worldwide.</BulletItem>
          </div>
          <div style={{ marginTop: 18, padding: '14px 18px', background: goldBg, borderRadius: 10, border: `1px solid ${borderGold}` }}>
            <span style={{ fontFamily: ANSWER_FONT, fontSize: 18, color: textMid }}>
              Always keep your certificates and original invoices safely for future transactions.
            </span>
          </div>
        </AccordionSection>

        {/* 7. Summary & Trust Promise */}
        <AccordionSection title="The TAMIRI Trust Promise." defaultOpen={false}>
          <p style={{ fontSize: 18, color: textMid, lineHeight: 1.75, fontFamily: ANSWER_FONT, marginTop: 16 }}>
            At <strong style={{ color: goldColor }}>TAMIRI JEWELLERS PVT LTD</strong>, certification is not just a document; it is our promise of purity, truth, and transparency.
          </p>
          <SectionTitle>Our Commitment to You</SectionTitle>
          <div style={{ marginTop: 10 }}>
            <CheckItem>100% BIS Hallmarked gold.</CheckItem>
            <CheckItem>Reputed laboratory certification for all diamonds and solitaires.</CheckItem>
            <CheckItem>Full disclosure of gemstone treatments (if any).</CheckItem>
            <CheckItem>Transparent pricing with detailed invoices.</CheckItem>
          </div>
          <div style={{ marginTop: 24, textAlign: 'center', padding: '20px', borderTop: `1px solid ${borderGold}` }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: goldColor, marginBottom: 8 }}>PURE PROMISE. TIMELESS TRUTH.</div>
            <div style={{ fontSize: 17, color: textMid, fontStyle: 'italic' }}>Because you deserve to know exactly what you wear.</div>
          </div>
        </AccordionSection>

      </div>

      {/* Final Summary Section from Image */}
      <div style={{
        maxWidth: 1200,
        margin: '60px auto 0',
        padding: '0 20px 80px',
        textAlign: 'center',
        fontFamily: QUESTION_FONT
      }}>
        <h2 style={{ 
          fontSize: 24, 
          fontWeight: 700, 
          color: goldColor, 
          textDecoration: 'underline', 
          marginBottom: 24,
          fontFamily: "'Georgia', serif"
        }}>
          Tamiri Jewellers Certification Promise
        </h2>
        
        <div style={{ 
          display: 'inline-block', 
          textAlign: 'left', 
          marginBottom: 24 
        }}>
          {[
            'BIS-hallmarked gold jewellery',
            'Certified natural and lab-grown diamonds',
            'Transparent disclosure of quality & pricing',
            'Trusted grading laboratories',
            'Complete documentation provided'
          ].map((text, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={textDark} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ fontSize: 18, color: textDark, fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 18, color: textDark, marginBottom: 48, fontWeight: 500 }}>
          We never compromise on authenticity because your trust is our most valuable asset.
        </p>

        <h2 style={{ 
          fontSize: 24, 
          fontWeight: 700, 
          color: goldColor, 
          textDecoration: 'underline', 
          marginBottom: 24,
          fontFamily: "'Georgia', serif"
        }}>
          Final Word from TAMIRI JEWELLERS PVT LTD
        </h2>

        <p style={{ 
          fontSize: 18, 
          color: textDark, 
          lineHeight: 1.7, 
          maxWidth: 1100, 
          margin: '0 auto 24px' 
        }}>
          Jewellery certification is not just paperwork - it is <span style={{ color: goldColor, fontWeight: 600 }}>your assurance of purity, value, and peace of mind</span>. 
          Whether you are buying gold, diamonds, or gemstones, certification protects your investment and ensures lifelong confidence in your purchase.
        </p>

        <p style={{ fontSize: 18, color: textDark }}>
          At <strong style={{ color: goldColor }}>TAMIRI JEWELLERS PVT LTD</strong>, we proudly stand by certified quality, transparent practices, and timeless trust.
        </p>
      </div>
    </div>
  );
}
