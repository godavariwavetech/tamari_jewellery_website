import React from 'react';
import avoidWearingImg from '../assets/avoidwearing.png';
import cleaningJewelleryImg from '../assets/cleaningjewellery.png';
import properStorageImg from '../assets/properstorage.png';
import protectingDiamondsImg from '../assets/protectingdiamonds.png';
import caringOfGoldImg from '../assets/caringofgoldjewellery.png';
import careOfPearlsImg from '../assets/careofpearls&genstones.png';
import professionalMaintenanceImg from '../assets/professionalmaintainance.png';
import smartTravelTipsImg from '../assets/smarttraveltips.png';

const goldColor = "#CF9D12";
const textDark = "#222";
const textMid = "#444";
const borderLight = "#e8dcc8";

const S = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#fff',
    fontFamily: 'Georgia, "Times New Roman", serif',
    color: textDark,
    padding: '0 0 60px',
  },
  wrap: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: goldColor,
    textAlign: 'center' as const,
    margin: '0 0 30px',
    textDecoration: 'underline',
    textTransform: 'uppercase' as const,
    letterSpacing: '1px',
  },
  subTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: goldColor,
    margin: '20px 0 10px',
    textDecoration: 'underline',
  },
  bodyText: {
    fontSize: '16px',
    color: textMid,
    lineHeight: '1.7',
    margin: '0 0 15px',
  },
  bullet: {
    fontSize: '16px',
    color: textMid,
    lineHeight: '1.8',
    paddingLeft: '20px',
    margin: '0 0 15px',
    listStyleType: 'disc',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '4px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  }
};

const Gold = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: goldColor, fontWeight: '600' }}>{children}</span>
);

const JewelleryCare = () => (
  <div style={S.page}>
    <div style={S.wrap}>

      {/* ── PAGE TITLE ── */}
      <h1 style={{ fontSize: '36px', fontWeight: '700', textAlign: 'center', margin: '0 0 20px', fontFamily: 'Georgia, serif' }}>
        Jewellery Care
      </h1>
      <div style={{ textAlign: 'center', maxWidth: '1000px', margin: '0 auto 40px' }}>
        <p style={S.bodyText}>
          Your jewellery is more than an accessory — it is a symbol of love, tradition, and beauty. Whether it's a gold necklace, a diamond ring, or a delicate bracelet, proper care ensures that your treasured pieces stay radiant for years to come.
        </p>
        <p style={S.bodyText}>
          At <Gold>TAMIRI JEWELLERS PVT LTD</Gold>, we believe in empowering our customers with the knowledge to protect and maintain their jewellery effortlessly.
        </p>
      </div>

      {/* ════════════════════════════════
          SECTION 1 — DAILY CARE
      ════════════════════════════════ */}
      <h2 style={S.sectionTitle}>Daily Care Tips – Protect Your Jewellery from Damage</h2>
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '50px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={S.subTitle}>Avoid Wearing Jewellery During:</h3>
          <ul style={S.bullet}>
            <li><Gold>Household chores</Gold> (chemical damage/water friction)</li>
            <li><Gold>Bathing or swimming</Gold> (chlorine & salt water affect alloys)</li>
            <li><Gold>Gym or sports activities</Gold> (mechanical impact/sweat corrosion)</li>
          </ul>
          <h3 style={S.subTitle}>Keep Away from Chemicals</h3>
          <p style={S.bodyText}>
            Perfumes, lotions, deodorants, and hairsprays can cloud the metal and stones. 
            Tip: Wear jewellery <Gold>last</Gold> — after applying cosmetics.
          </p>
          <h3 style={S.subTitle}>Handle with Clean, Dry Hands</h3>
          <p style={S.bodyText}>
            Moisture, friction, and salts can diminish brilliance on stones and metals.
          </p>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={avoidWearingImg} alt="Avoid Wearing Tips" style={S.image} />
        </div>
      </div>

      {/* ════════════════════════════════
          SECTION 2 — CLEANING AT HOME
      ════════════════════════════════ */}
      <h2 style={S.sectionTitle}>Cleaning Your Jewellery at Home</h2>
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '50px' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={cleaningJewelleryImg} alt="Cleaning Jewellery at Home" style={S.image} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={S.bodyText}>
            Regular cleaning helps maintain the shine and brilliance of your jewellery. Use gentle care, gold and diamond jewellery can be safely cleaned at home.
          </p>
          <h3 style={S.subTitle}>Gold Jewellery Care</h3>
          <p style={S.bodyText}>
            Wash gold jewellery in warm water mixed with a supplier like <Gold>dish soap</Gold>. Use a brush with a soft toothbrush, rinse thoroughly, and pat dry using a soft cloth to restore shine.
          </p>
          <h3 style={S.subTitle}>Diamond Jewellery Care</h3>
          <p style={S.bodyText}>
            Use a gentle cleaning solution like warm liquid soap. Carefully scrub around prongs and settings where dirt collects. Rinse well with water. Dry with a lint-free cloth or tissue.
          </p>
          <h3 style={S.subTitle}>Avoid Harsh Products</h3>
          <p style={S.bodyText}>
            No perfumes, bleach, alcohol, or sanitisers, as these can damage and tarnish metal, and keep your stone looking dull and less.
          </p>
        </div>
      </div>

      {/* ════════════════════════════════
          SECTION 3 — PROPER STORAGE
      ════════════════════════════════ */}
      <h2 style={S.sectionTitle}>Proper Storage – Keep Your Jewellery Safe</h2>
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '50px' }}>
        <div style={{ flex: 1 }}>
          <p style={S.bodyText}>
            Jewellery pieces may scratch each other when stored together — separate storage helps preserve their finish.
          </p>
          <ul style={S.bullet}>
            <li>Keep in a <Gold>cool, dry place</Gold>.</li>
            <li>Velvet-lined boxes are perfect to protect jewellery.</li>
            <li>Separate compartments.</li>
          </ul>
          <h3 style={S.subTitle}>Avoid Humidity</h3>
          <p style={S.bodyText}>
            Exposure to moisture may dull gold, silver, and platinum. Silica gel packets help keep your jewellery dry.
          </p>
          <h3 style={S.subTitle}>Space Collect Facts</h3>
          <p style={S.bodyText}>
            <Gold>Tamiri Jewellers Pvt Ltd</Gold> recommends storing chains, mangalsutras, and bracelets individually to prevent knots and damage.
          </p>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={properStorageImg} alt="Proper Storage Tips" style={S.image} />
        </div>
      </div>

      {/* ════════════════════════════════
          SECTION 4 — PROTECTING DIAMONDS
      ════════════════════════════════ */}
      <h2 style={S.sectionTitle}>Protecting Diamond Jewellery</h2>
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '50px' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={protectingDiamondsImg} alt="Protecting Diamond Jewellery" style={S.image} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={S.bodyText}>
            Diamonds are exceptionally strong, yet they are not indestructible.
          </p>
          <h3 style={S.subTitle}>Key Tips</h3>
          <ul style={S.bullet}>
            <li>Regularly check prongs to ensure diamonds remain secure in place.</li>
            <li>Avoid impact with hard surfaces to avoid metal stone chipping.</li>
            <li>Clean stones regularly to preserve their natural brilliance.</li>
          </ul>
          <p style={S.bodyText}>
            Fingerprints and natural oils reduce light reflection, making regular cleaning essential for diamonds to shine.
          </p>
        </div>
      </div>

      {/* ════════════════════════════════
          SECTION 5 — CARING FOR GOLD
      ════════════════════════════════ */}
      <h2 style={S.sectionTitle}>Caring for Gold Jewellery</h2>
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '50px' }}>
        <div style={{ flex: 1 }}>
          <p style={S.bodyText}>
            Gold is a soft metal and must be handled carefully with daily wear.
          </p>
          <h3 style={S.subTitle}>Tips to Protect Gold Jewellery:</h3>
          <ul style={S.bullet}>
            <li>To prevent damage, remove jewellery before heavy work.</li>
            <li>Avoid contact between jewellery pieces to prevent scratches.</li>
            <li>Occasional polishing helps restore the natural shine of gold.</li>
          </ul>
          <p style={{ ...S.bodyText, fontStyle: 'italic' }}>
            Note: Rose Gold, white gold can lose its brightness and may require rhodium plating to restore its original look.
          </p>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={caringOfGoldImg} alt="Caring for Gold Jewellery" style={S.image} />
        </div>
      </div>

      {/* ════════════════════════════════
          SECTION 6 — PEARLS & GEMSTONES
      ════════════════════════════════ */}
      <h2 style={S.sectionTitle}>How to Care for Pearls & Gemstones</h2>
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '50px' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={careOfPearlsImg} alt="Pearl and Gemstone Care" style={S.image} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={S.bodyText}>
            Pearls and gemstones are delicate and require specific care.
          </p>
          <h3 style={S.subTitle}>Pearl Care:</h3>
          <ul style={S.bullet}>
            <li>Wiping with a soft cloth after each wear helps maintain shine and remove residue.</li>
            <li>Keep pearls away from perfumes and cosmetics.</li>
            <li>Hanging pearl jewellery can stretch the silk thread, always store flat.</li>
          </ul>
          <h3 style={S.subTitle}>Gemstone Care:</h3>
          <p style={S.bodyText}>
            Each gemstone has a different hardness level. Gentle cleaning with mild soap is recommended; avoid ultrasonic cleaners which can damage porous stones like gems.
          </p>
        </div>
      </div>

      {/* ════════════════════════════════
          SECTION 7 — PROFESSIONAL MAINTENANCE
      ════════════════════════════════ */}
      <h2 style={S.sectionTitle}>Professional Jewellery Maintenance for Lasting Beauty</h2>
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '50px' }}>
        <div style={{ flex: 1 }}>
          <p style={S.bodyText}>
            At <Gold>TAMIRI JEWELLERS PVT LTD</Gold>, professional maintenance services are available every 6–12 months.
          </p>
          <h3 style={S.subTitle}>Our expert team provides:</h3>
          <ul style={S.bullet}>
            <li>Deep cleaning and polishing for a like-new brilliance.</li>
            <li>Professional prong tightening to prevent loose or lost stones.</li>
            <li>Rhodium plating for long-lasting jewellery.</li>
            <li>Repair services for broken clasps and settings.</li>
          </ul>
          <p style={{ ...S.bodyText, fontWeight: 'bold' }}>
            REGULAR MAINTENANCE CAN PREVENT THE LOSS OF DIAMONDS AND ENSURE DURABLE QUALITY.
          </p>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={professionalMaintenanceImg} alt="Professional Maintenance" style={S.image} />
        </div>
      </div>

      {/* ════════════════════════════════
          SECTION 8 — SMART TRAVEL TIPS
      ════════════════════════════════ */}
      <h2 style={S.sectionTitle}>Smart Travel Tips for Jewellery Care</h2>
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', marginBottom: '60px' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <img src={smartTravelTipsImg} alt="Smart Travel Tips" style={S.image} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={S.subTitle}>Tips:</h3>
          <ul style={S.bullet}>
            <li>Use travel jewellery organisers to keep items secure.</li>
            <li>Don't keep all jewellery while travelling.</li>
            <li>Avoid placing jewellery in checked-in luggage while travelling.</li>
            <li>Use hotel safes or cushioned cases in resort jewellery during stays.</li>
          </ul>
          <p style={{ ...S.bodyText, fontWeight: 'bold' }}>
            Regular professional checks help protect your jewellery and keep it shiny and sparkle.
          </p>
        </div>
      </div>

      {/* ── FINAL WORD ── */}
      <div style={{ textAlign: 'center', borderTop: `1px solid ${borderLight}`, paddingTop: '50px' }}>
        <h2 style={{ ...S.sectionTitle, textDecoration: 'none' }}>Final Word from TAMIRI JEWELLERS PVT LTD</h2>
        <p style={{ ...S.bodyText, maxWidth: '1000px', margin: '0 auto 20px' }}>
          Your jewellery deserves the same care and love that went into crafting it. With proper maintenance and regular checkups, your favorite pieces will continue to shine brightly and stay secure for years to come.
        </p>
        <p style={S.bodyText}>
          At <Gold>TAMIRI JEWELLERS</Gold>, we are always here to help you clean, repair, and preserve your precious treasures.
        </p>
      </div>

    </div>
  </div>
);

export default JewelleryCare;
