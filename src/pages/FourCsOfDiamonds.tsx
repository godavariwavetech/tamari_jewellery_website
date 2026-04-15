/* ─── tiny helpers ─────────────────────────────────────── */
const Gold = ({ children, underline }: { children: React.ReactNode; underline?: boolean }) => (
  <span style={{ color: '#c8930a', fontWeight: '600', textDecoration: underline ? 'underline' : 'none' }}>{children}</span>
);

const HR = () => <hr style={{ border: 'none', borderTop: '1px solid #e0d5c5', margin: '36px 0' }} />;

/* diamond SVG placeholder — renders a faceted diamond silhouette tinted by `tint` */
const DiamondIcon = ({ size = 54, tint = '#f0ece4', label, sub, shine = true }: { 
  size?: number; 
  tint?: string; 
  label?: string; 
  sub?: string; 
  shine?: boolean; 
}) => (
  <div style={{ textAlign: 'center', minWidth: size + 8 }}>
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="30,4 56,20 56,40 30,56 4,40 4,20" fill={tint} stroke="#c8a04a" strokeWidth="1.2" />
      <polygon points="30,4 56,20 30,28" fill={shine ? 'rgba(255,255,255,0.25)' : 'none'} />
      <polygon points="30,28 56,20 56,40 30,56 4,40 4,20" fill="rgba(0,0,0,0.04)" />
      <line x1="30" y1="4" x2="30" y2="56" stroke="#c8a04a" strokeWidth="0.5" opacity="0.4" />
      <line x1="4" y1="20" x2="56" y2="40" stroke="#c8a04a" strokeWidth="0.5" opacity="0.3" />
      <line x1="56" y1="20" x2="4" y2="40" stroke="#c8a04a" strokeWidth="0.5" opacity="0.3" />
    </svg>
    {label && <p style={{ fontSize: '12px', fontWeight: '700', color: '#333', margin: '4px 0 1px' }}>{label}</p>}
    {sub && <p style={{ fontSize: '10px', color: '#777', margin: 0, lineHeight: '1.3' }}>{sub}</p>}
  </div>
);

/* round diamond circle for quality scale */
const QCircle = ({ size = 38, fill = '#e8e0d4', label }: { size?: number; fill?: string; label?: string }) => (
  <div style={{ textAlign: 'center' }}>
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" fill={fill} stroke="#c8a04a" strokeWidth="1" />
      <circle cx="14" cy="14" r="4" fill="rgba(255,255,255,0.5)" />
    </svg>
    <p style={{ fontSize: '9px', fontWeight: '700', color: '#555', margin: '3px 0 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
  </div>
);

const FourCsOfDiamonds = () => {
  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#fffdf8',
    fontFamily: 'Georgia, "Times New Roman", serif',
    color: '#333',
    padding: '0 0 60px',
    width: '100%',
  };

  const bodyStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 40px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '700',
    color: '#c8930a',
    textDecoration: 'underline',
    textAlign: 'center',
    margin: '0 0 18px',
    letterSpacing: '0.5px',
  };

  const bodyText = {
    fontSize: '13.5px',
    color: '#444',
    lineHeight: '1.75',
    margin: '0 0 10px',
  };

  const subHead = {
    fontSize: '13.5px',
    fontWeight: '700',
    color: '#c8930a',
    margin: '14px 0 6px',
    textDecoration: 'underline',
  };

  const bullet = {
    fontSize: '13px',
    color: '#444',
    lineHeight: '1.9',
    paddingLeft: '18px',
    margin: '0 0 10px',
  };

  return (
    <div style={pageStyle}>
      <div style={bodyStyle}>

        {/* ── PAGE TITLE ── */}
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#222', textAlign: 'center', margin: '40px 0 18px', fontFamily: 'Georgia, serif' }}>
          4 C's of Diamonds
        </h1>

        {/* Intro paragraphs */}
        <p style={bodyText}>
          At <Gold>TAMIRI JEWELLERS PVT LTD</Gold>, we believe every diamond carries a story – of craftsmanship, elegance, and emotional value. Whether you are purchasing an engagement ring, a wedding gift, or a timeless piece of luxury, understanding the 4 C's of Diamonds empowers you to choose a stone that truly reflects your taste and investment.
        </p>
        <p style={bodyText}>
          The <Gold underline>4 C's — Cut, Colour, Clarity, and Carat Weight</Gold> – form the universal standard for judging diamond quality. Here's everything you need to know before buying your perfect stone.
        </p>

        <HR />

        {/* ════════════════════════════════
            SECTION 1 — CUT
        ════════════════════════════════ */}
        <h2 style={sectionTitleStyle}>CUT – The Sparkle of the Diamond</h2>

        {/* Two-col: text left, quality scale right */}
        <div style={{ display: 'flex', gap: '28px', marginBottom: '18px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 280px' }}>
            <p style={bodyText}>
              The <Gold>Cut</Gold> of a diamond is the most important factor influencing its brilliance. It determines how beautifully light enters, reflects, and sparkles within the stone.
            </p>
            <p style={subHead}>Why Cut Matters</p>
            <ul style={bullet}>
              <li>A well-cut diamond appears brighter and more radiant.</li>
              <li>Even a high-carat diamond with poor cut will look dull.</li>
              <li>Cut affects symmetry, proportions, and polish.</li>
            </ul>
          </div>
          {/* Quality scale */}
          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
              <QCircle size={28} fill="#b0a898" label="POOR" />
              <QCircle size={34} fill="#c8bfb0" label="FAIR" />
              <QCircle size={40} fill="#ddd6c8" label="GOOD" />
              <QCircle size={46} fill="#ece5d8" label="VERY GOOD" />
              <QCircle size={54} fill="#f8f0e0" label="EXCELLENT" />
            </div>
            {/* scale bar */}
            <div style={{ width: '100%', height: '4px', background: 'linear-gradient(to right, #888, #c8930a)', borderRadius: '2px', marginTop: '4px' }} />
          </div>
        </div>

        {/* Three cut diagrams */}
        <div style={{ display: 'flex', gap: '18px', marginBottom: '18px', flexWrap: 'wrap' }}>
          {[
            { label: 'Too Shallow', desc: 'LIGHT ESCAPES FROM THE SIDES, CAUSING THE DIAMOND TO LOSE BRILLIANCE – CREATES AN OPAQUE AND GLASSY LOOK.', lines: [[20,8,20,52],[8,28,52,28]] },
            { label: 'Too Deep', desc: 'LIGHT ESCAPES FROM THE BOTTOM, CAUSING THE DIAMOND TO APPEAR DULL AND LIFELESS – THE MAXIMUM AMOUNT OF LIGHT IS REFRACTED DULL AND THROUGH THE TOP OF THE DIAMOND.' },
            { label: 'Ideal Cut', desc: 'PERFECTLY PROPORTIONED. THE MAXIMUM AMOUNT OF LIGHT IS REFRACTED DULL AND THROUGH THE TOP OF THE DIAMOND.' },
          ].map(({ label, desc }, i) => (
            <div key={i} style={{ flex: '1 1 160px', textAlign: 'center' }}>
              <svg width="80" height="60" viewBox="0 0 80 60" style={{ marginBottom: '6px' }}>
                {i === 0 && (
                  /* shallow – wide flat diamond */
                  <>
                    <polygon points="8,20 72,20 55,50 25,50" fill="#e8dfc8" stroke="#a08030" strokeWidth="1.2" />
                    <line x1="8" y1="20" x2="40" y2="35" stroke="#a08030" strokeWidth="0.6" strokeDasharray="2,2" />
                    <line x1="72" y1="20" x2="40" y2="35" stroke="#a08030" strokeWidth="0.6" strokeDasharray="2,2" />
                    <line x1="25" y1="50" x2="40" y2="35" stroke="#a08030" strokeWidth="0.6" strokeDasharray="2,2" />
                    <line x1="55" y1="50" x2="40" y2="35" stroke="#a08030" strokeWidth="0.6" strokeDasharray="2,2" />
                  </>
                )}
                {i === 1 && (
                  /* deep – tall narrow diamond */
                  <>
                    <polygon points="20,8 60,8 45,56 35,56" fill="#e8dfc8" stroke="#a08030" strokeWidth="1.2" />
                    <line x1="20" y1="8" x2="40" y2="28" stroke="#a08030" strokeWidth="0.6" strokeDasharray="2,2" />
                    <line x1="60" y1="8" x2="40" y2="28" stroke="#a08030" strokeWidth="0.6" strokeDasharray="2,2" />
                  </>
                )}
                {i === 2 && (
                  /* ideal – proper proportions */
                  <>
                    <polygon points="15,15 65,15 52,45 28,45" fill="#f5edd5" stroke="#a08030" strokeWidth="1.2" />
                    <line x1="15" y1="15" x2="40" y2="30" stroke="#a08030" strokeWidth="0.7" />
                    <line x1="65" y1="15" x2="40" y2="30" stroke="#a08030" strokeWidth="0.7" />
                    <line x1="28" y1="45" x2="40" y2="30" stroke="#a08030" strokeWidth="0.7" />
                    <line x1="52" y1="45" x2="40" y2="30" stroke="#a08030" strokeWidth="0.7" />
                    <line x1="15" y1="15" x2="40" y2="22" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
                  </>
                )}
              </svg>
              <p style={{ fontSize: '11px', fontWeight: '700', color: '#444', margin: '0 0 4px', textTransform: 'uppercase' }}>{label}</p>
              <p style={{ fontSize: '9px', color: '#777', lineHeight: '1.5', margin: 0 }}>{desc}</p>
            </div>
          ))}

          {/* Grades of Cut list */}
          <div style={{ flex: '1 1 180px' }}>
            <p style={subHead}>Grades of Cut</p>
            <ul style={{ ...bullet, listStyle: 'none', paddingLeft: 0 }}>
              {[
                ['Excellent', 'Maximum brilliance and fire.'],
                ['Very Good', 'High sparkle with slight variation.'],
                ['Good', 'Balanced performance and value.'],
                ['Fair & Poor', 'Less brilliance, lower value.'],
              ].map(([g, d]) => (
                <li key={g} style={{ marginBottom: '4px' }}>
                  <Gold>{g}</Gold> <span style={{ color: '#555' }}>– {d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <HR />

        {/* ════════════════════════════════
            SECTION 2 — COLOUR
        ════════════════════════════════ */}
        <h2 style={sectionTitleStyle}>COLOUR – The Purity of Appearance</h2>

        <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <div style={{ flex: '1 1 260px' }}>
            <p style={bodyText}>
              Diamond colour is graded based on how colourless a diamond is. The less colour, the higher the rarity and value.
            </p>
            <p style={subHead}>Grades of Cut</p>
            <ul style={{ ...bullet, listStyle: 'none', paddingLeft: 0 }}>
              {[
                ['D–F', 'Colourless (premium, rare, and highly valuable)'],
                ['G–J', 'Near Colourless (excellent value and beauty)'],
                ['K–M', 'Faint Colour (slight warm tint)'],
                ['N–Z', 'Noticeable Colour (visible tint)'],
              ].map(([g, d]) => (
                <li key={g} style={{ marginBottom: '4px', fontSize: '13px', color: '#444', lineHeight: '1.7' }}>
                  <Gold>{g}</Gold> – {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Colour diamond scale */}
          <div style={{ flex: '0 0 auto' }}>
            <p style={{ fontSize: '10px', color: '#888', textAlign: 'right', margin: '0 0 6px', fontStyle: 'italic' }}>— Colour Grades (D–Z Scale) —</p>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end' }}>
              {[
                { tint: '#f9f6f0', label: 'D E F', sub: 'D–F: Colourless\nPremium, Rare\n& Highly Valuable' },
                { tint: '#f5edd8', label: 'G H I J', sub: 'G–J: Near Colourless\nExcellent Value &\nBeauty' },
                { tint: '#ede0b8', label: 'K L M', sub: 'K–M: Faint Colour\nSlight Warm Tint' },
                { tint: '#e0c880', label: 'N O Z', sub: 'N–Z: Noticeable Colour\nVisible Tint' },
              ].map(({ tint, label, sub }, i) => (
                <DiamondIcon key={i} size={48 - i * 2} tint={tint} label={label} sub={sub} />
              ))}
            </div>
          </div>
        </div>

        <p style={{ ...bodyText, textAlign: 'center', fontStyle: 'italic' }}>
          Even slight colour differences can significantly affect the look of the diamond. At <Gold>TAMIRI JEWELLERS</Gold>, we offer diamonds selected for their exceptional purity and elegance.
        </p>

        <HR />

        {/* ════════════════════════════════
            SECTION 3 — CLARITY
        ════════════════════════════════ */}
        <h2 style={sectionTitleStyle}>CLARITY – The Diamond's Natural Fingerprint</h2>

        <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {/* Clarity grade diamonds left */}
          <div style={{ flex: '0 0 auto' }}>
            <p style={{ fontSize: '12px', fontWeight: '700', color: '#555', margin: '0 0 10px' }}>Clarity Grades</p>
            {/* row labels */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
              {['VVS1–VVS2', 'VS1–VS2', 'SI1 SI2', 'I1 I3'].map(l => (
                <div key={l} style={{ width: '52px', textAlign: 'center', fontSize: '9px', fontWeight: '700', color: '#555' }}>{l}</div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { tint: '#f8f4ec', dots: [] },
                { tint: '#f4eee0', dots: [{ x: 26, y: 26 }] },
                { tint: '#ede4cc', dots: [{ x: 22, y: 24 }, { x: 32, y: 32 }] },
                { tint: '#e0d0b0', dots: [{ x: 18, y: 20 }, { x: 28, y: 30 }, { x: 36, y: 22 }, { x: 24, y: 36 }] },
              ].map(({ tint, dots }, i) => (
                <div key={i} style={{ width: '52px', textAlign: 'center' }}>
                  <svg width="52" height="52" viewBox="0 0 52 52">
                    <polygon points="26,3 49,16 49,36 26,49 3,36 3,16" fill={tint} stroke="#c8a04a" strokeWidth="1" />
                    {dots.map((d, j) => (
                      <circle key={j} cx={d.x} cy={d.y} r="2.5" fill="#888" opacity="0.6" />
                    ))}
                  </svg>
                  <p style={{ fontSize: '9px', color: '#777', margin: '2px 0 0', lineHeight: '1.3' }}>
                    {['VVS1–VVS2\nVery Very\nSlightly\nIncluded', 'VS1–VS2\nVery Slightly\nIncluded', 'SI1 SI2\nSlightly\nIncluded', 'I1–I3\nIncluded'][i]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Text right */}
          <div style={{ flex: '1 1 240px' }}>
            <p style={bodyText}>
              Clarity measures the presence of tiny natural markings known as <Gold>inclusions</Gold> (internal) and <Gold>blemishes</Gold> (external). These are formed during the diamond's creation deep within the earth.
            </p>
            <p style={subHead}>Clarity Grades</p>
            <ul style={{ ...bullet, listStyle: 'none', paddingLeft: 0 }}>
              {[
                ['FL/IF', 'Flawless / Internally Flawless'],
                ['VVS1–VVS2', 'Very Very Slightly Included'],
                ['VS1–VS2', 'Very Slightly Included'],
                ['SI1–SI2', 'Slightly Included'],
                ['I1–I3', 'Included'],
              ].map(([g, d]) => (
                <li key={g} style={{ marginBottom: '3px', fontSize: '13px', color: '#444', lineHeight: '1.7' }}>
                  <Gold>{g}</Gold> – {d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p style={{ ...bodyText, textAlign: 'center', fontStyle: 'italic' }}>
          Whether you prefer a subtle, elegant stone or a bold statement diamond, <Gold>TAMIRI JEWELLERS</Gold>, offers a wide selection to match every desire.
        </p>

        <HR />

        {/* ════════════════════════════════
            SECTION 4 — CARAT WEIGHT
        ════════════════════════════════ */}
        <h2 style={sectionTitleStyle}>CARAT WEIGHT – The Diamond's Size</h2>

        <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', marginBottom: '16px' }}>
          <div style={{ flex: '1 1 250px' }}>
            <p style={bodyText}>
              Carat refers to the weight – not the size – of a diamond. However, higher carat diamonds tend to appear larger.
            </p>
            <p style={subHead}>Understanding Carat</p>
            <ul style={bullet}>
              <li><strong>1 Carat = 200 milligrams</strong></li>
              <li>Larger diamonds are rarer, making them more expensive.</li>
              <li>Carat should be considered along with cut, as a well-cut diamond can look larger than its actual weight.</li>
            </ul>
          </div>

          {/* Carat size progression */}
          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end' }}>
              {[
                { size: 22, label: '0.25 ct' },
                { size: 28, label: '0.50 ct' },
                { size: 35, label: '0.75 ct' },
                { size: 42, label: '1.00 ct' },
                { size: 50, label: '1.50 ct' },
                { size: 58, label: '3.00 ct' },
              ].map(({ size, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <svg width={size} height={size} viewBox="0 0 60 60">
                    <polygon points="30,4 56,20 56,40 30,56 4,40 4,20" fill="#f0e8d4" stroke="#c8a04a" strokeWidth="1.5" />
                    <polygon points="30,4 56,20 30,24" fill="rgba(255,255,255,0.4)" />
                  </svg>
                  <p style={{ fontSize: '9px', color: '#666', margin: '3px 0 0', whiteSpace: 'nowrap' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p style={{ ...bodyText, textAlign: 'center', fontStyle: 'italic', marginTop: '8px' }}>
          Clarity affects both beauty and price. Many inclusions are microscopic and do not affect a diamond's appearance. At <Gold>TAMIRI JEWELLERS</Gold>, we handpick diamonds that balance clarity and brilliance beautifully.
        </p>

        <HR />

        {/* ════════════════════════════════
            WHY CHOOSE
        ════════════════════════════════ */}
        <p style={{ fontSize: '15px', fontWeight: '700', color: '#c8930a', margin: '0 0 16px', textDecoration: 'underline' }}>
          Why Choose Diamonds from TAMIRI JEWELLERS PVT LTD?
        </p>

        <div style={{ maxWidth: '480px', margin: '0 auto 20px' }}>
          {[
            'Ethically sourced and certified diamonds',
            'Expert gemologists to guide you',
            'A curated selection of premium stones',
            'Custom designs to match your vision',
            'Transparent pricing and quality assurance',
          ].map(item => (
            <p key={item} style={{ fontSize: '14px', color: '#444', margin: '0 0 8px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <span style={{ color: '#c8930a', fontWeight: '700', flexShrink: 0 }}>✓</span>
              {item}
            </p>
          ))}
        </div>

        <p style={{ ...bodyText, textAlign: 'center', marginTop: '16px' }}>
          At <Gold>TAMIRI JEWELLERS</Gold>, we are committed to guiding every customer with knowledge, trust, and personalised care. Understanding the 4 C's helps you make a confident, meaningful decision—selecting a diamond that shines as brightly as your story.
        </p>

      </div>
    </div>
  );
};

export default FourCsOfDiamonds;