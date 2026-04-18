import { useState } from "react";
import BIS from '../assets/BIS HallMark.jpg';
import gold24k from '../assets/24carat.jpeg';
import gold22k from '../assets/22carat.jpeg';
import gold18k from '../assets/18carat.jpeg';
import gold14k from '../assets/14carat.jpeg';

const chevronDown = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CF9D12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const chevronUp = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CF9D12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const sections = [
  {
    number: "1.",
    title: "Know Your Purpose and Budget.",
    content: (
      <>
        <p style={{ fontSize: '18px', color: '#1A1E23', marginBottom: '10px' }}>Before you begin, consider:</p>
        <ul style={{ fontSize: '18px', color: '#1A1E23', lineHeight: '2', paddingLeft: '20px', margin: '0 0 10px' }}>
          <li>Is the jewellery for daily wear, occasional use, or a special event?</li>
          <li>Are you buying as an investment or for style?</li>
          <li>What is your budget range?</li>
        </ul>
        <p style={{ fontSize: '18px', color: '#1A1E23', margin: 0 }}>
          Knowing this helps narrow down metal purity, design options, and gemstones.
        </p>
      </>
    ),
  },
  {
    number: "2.",
    title: "Understanding Gold Purity",
    content: (
      <>
        <p style={{ fontSize: '20px', color: '#3E4851', marginBottom: '18px' }}>
          Gold jewellery comes in <span style={{ color: '#CF9D12', fontWeight: '600' }}>different purities</span>. The most common are:
        </p>
        {/* 24K */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: '700', color: '#CF9D12', fontSize: '24px', margin: '0 0 4px', textDecoration: 'underline' }}>24K Gold</p>
            <ul style={{ fontSize: '18px', color: '#444', lineHeight: '1.8', paddingLeft: '18px', margin: 0 }}>
              <li>99.9% pure gold</li>
              <li>Bright yellow, very soft.</li>
              <li>Best for investment (coins, bars), not ideal for daily-wear jewellery.</li>
            </ul>
          </div>
          <img src={gold24k} alt="24K Gold" style={{ width: '150px', height: 'auto', borderRadius: '8px' }} />
        </div>
        {/* 22K */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'flex-start' }}>
          <img src={gold22k} alt="22K Gold" style={{ width: '150px', height: 'auto', borderRadius: '8px' }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: '700', color: '#CF9D12', fontSize: '24px', margin: '0 0 4px', textDecoration: 'underline' }}>22K Gold</p>
            <ul style={{ fontSize: '18px', color: '#444', lineHeight: '1.8', paddingLeft: '18px', margin: 0 }}>
              <li>91.6% pure gold.</li>
              <li>Rich yellow tone.</li>
              <li>Perfect for traditional Indian jewellery like bangles, chains, rings, tops, haaram, valaianam, locketts, jada &amp; necklaces.</li>
            </ul>
          </div>
        </div>
        {/* 18K */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: '700', color: '#CF9D12', fontSize: '24px', margin: '0 0 4px', textDecoration: 'underline' }}>18K Gold</p>
            <ul style={{ fontSize: '18px', color: '#444', lineHeight: '1.8', paddingLeft: '18px', margin: 0 }}>
              <li>75% pure gold.</li>
              <li>Stronger and more durable.</li>
              <li>Ideal for diamond and modern jewellery.</li>
            </ul>
          </div>
          <img src={gold18k} alt="18K Gold" style={{ width: '150px', height: 'auto', borderRadius: '8px' }} />
        </div>
        {/* 14K */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'flex-start' }}>
          <img src={gold14k} alt="14K Gold" style={{ width: '150px', height: 'auto', borderRadius: '8px' }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: '700', color: '#CF9D12', fontSize: '24px', margin: '0 0 4px', textDecoration: 'underline' }}>14K Gold</p>
            <ul style={{ fontSize: '18px', color: '#444', lineHeight: '1.8', paddingLeft: '18px', margin: 0 }}>
              <li>58.5% pure gold</li>
              <li>Highly Affordable &amp; durable, budget-friendly</li>
              <li>Suitable for everyday wear</li>
            </ul>
          </div>
        </div>
        <p style={{ fontSize: '18px', color: '#444', marginTop: '16px', textAlign: 'center' }}>
          <span style={{ color: '#c8930a', fontWeight: '600', textDecoration: 'underline' }}>Tamiri Jewellers Tip :</span> Check for <strong>hallmarking (BIS Hallmark)</strong> to ensure purity and authenticity.
        </p>
      </>
    ),
  },
  {
    number: "3.",
    title: "Evaluating Diamond Jewellery – The 4 C's",
    content: (
      <>
        <p style={{ fontSize: '18px', color: '#444', marginBottom: '12px' }}>
          If you are buying diamond jewellery, <span style={{ color: '#c8930a', fontWeight: '500' }}>understanding the 4 C's</span> is essential.
        </p>
        <ul style={{ fontSize: '18px', color: '#444', lineHeight: '2', paddingLeft: '20px', margin: '0 0 10px' }}>
          <li><span style={{ color: '#c8930a', fontWeight: '600' }}>Cut</span> – Determines brilliance</li>
          <li><span style={{ color: '#c8930a', fontWeight: '600' }}>Colour</span> – Ranges from colourless to yellow</li>
          <li><span style={{ color: '#c8930a', fontWeight: '600' }}>Clarity</span> – Measures inclusions</li>
          <li><span style={{ color: '#c8930a', fontWeight: '600' }}>Carat</span> – Weight and size</li>
        </ul>
        <p style={{ fontSize: '18px', color: '#444', margin: 0 }}>
          <span style={{ color: '#c8930a', fontWeight: '600' }}>Tamiri Jewellers</span> provides certified diamonds with complete transparency.
        </p>
      </>
    ),
  },
  {
    number: "4.",
    title: "Choosing the Right Metal: In Gold?",
    content: (
      <>
        <p style={{ fontSize: '18px', color: '#444', marginBottom: '12px' }}>
          <span style={{ color: '#c8930a', fontWeight: '600' }}>Gold</span> is timeless, elegant, and always in style. Loved for its beauty and value, it's the perfect choice for both tradition and modern fashion.
        </p>
        <ul style={{ fontSize: '18px', color: '#444', lineHeight: '2', paddingLeft: '20px', margin: '0 0 12px' }}>
          <li><span style={{ color: '#c8930a', fontWeight: '600' }}>Yellow Gold</span> – Classic &amp; traditional, ideal for weddings and cultural jewellery</li>
          <li><span style={{ color: '#c8930a', fontWeight: '600' }}>White Gold</span> – Modern &amp; sophisticated. Perfect for diamond and contemporary designs</li>
          <li><span style={{ color: '#c8930a', fontWeight: '600' }}>Rose Gold</span> – Trendy &amp; romantic. A stylish choice for modern, everyday jewellery.</li>
        </ul>
        <p style={{ fontSize: '18px', fontWeight: '600', color: '#c8930a', marginBottom: '6px', textDecoration: 'underline' }}>Purity Guide:</p>
        <ul style={{ fontSize: '18px', color: '#444', lineHeight: '2', paddingLeft: '20px', margin: 0 }}>
          <li><strong style={{ color: '#c8930a' }}>24KT</strong> – Best for investment</li>
          <li><strong style={{ color: '#c8930a' }}>22KT</strong> – Traditional &amp; rich look</li>
          <li><strong style={{ color: '#c8930a' }}>18KT</strong> – Traditional &amp; rich look</li>
          <li><strong style={{ color: '#c8930a' }}>14KT</strong> – Traditional &amp; rich look</li>
        </ul>
      </>
    ),
  },
  {
    number: "5.",
    title: "Check for Hallmarks and Certifications",
    content: (
      <>
        <p style={{ fontSize: '24px', fontWeight: '800', color: '#CF9D12', marginBottom: '20px', letterSpacing: '0.5px' }}>BIS HALLMARK STAMP ON OUR JEWELLERY.</p>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>
              <strong style={{color: '#CF9D12' , textDecoration: 'underline' }}>BIS LOGO:</strong> THE SYMBOL THAT REPRESENTS BIS STANDARDS.
            </p>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>
              <strong style={{ color: '#CF9D12' , textDecoration: 'underline' }}>PURITY GRADE:</strong> INDICATES THE GOLD PURITY, LIKE 22K (91.6% PURITY), 18K (75% PURITY), OR 14k (58.5% PURITY)
            </p>
            <p style={{ fontSize: '18px', marginBottom: '20px' }}>
              <strong style={{ color: '#CF9D12' , textDecoration: 'underline' }}>JEWELLER'S IDENTIFICATION MARK OR CODE:</strong> THE UNIQUE CODE OR MARK OF THE JEWELER WHO MANUFACTURED THE JEWELRY.
            </p>
            <p style={{ fontSize: '18px', margin: 0 }}>
              <strong style={{ color: '#CF9D12' , textDecoration: 'underline' }}>A HALLMARKING CENTRE'S IDENTIFICATION MARK OR NUMBER:</strong> SHOWS WHERE THE JEWELRY WAS ASSAYED AND MARKED.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <img src={BIS} alt="Hallmark Ring" style={{ width: '400px' }} />
          </div>
        </div>
      </>
    ),
  },
  {
    number: "6.",
    title: "Check for Fine Diamond Certifications",
    content: (
      <>
        <p style={{ fontSize: '18px', color: '#1A1E23', marginBottom: '10px' }}>Always check:</p>
        <ul style={{ fontSize: '18px', color: '#727989', lineHeight: '2', paddingLeft: '20px', margin: '0 0 10px' }}>
          <li><span style={{ color: '#CF9D12', fontWeight: '600' }}>GIA Certification</span> – Click on ➡ <span style={{ color: '#444', textDecoration: 'underline', cursor: 'pointer' }}>(GIA Report Check)</span></li>
          <li><span style={{ color: '#CF9D12', fontWeight: '600' }}>IGI Certification</span> – Click on ➡ <span style={{ color: '#444', textDecoration: 'underline', cursor: 'pointer' }}>(IGI Report Check)</span></li>
          <li><span style={{ color: '#CF9D12', fontWeight: '600' }}>SGL Certification</span> – Click on ➡ <span style={{ color: '#444', textDecoration: 'underline', cursor: 'pointer' }}>(SGL Report Check)</span></li>
          <li><span style={{ color: '#1A1E23', fontWeight: '500' }}>Laser inscription on the diamond (if available)<br />
</span></li>
        </ul>
        <p style={{ fontSize: '18px', color: '#1A1E23', margin: 0 }}>
          At <span style={{ color: '#CF9D12', fontWeight: '600' }}>TAMIRI JEWELLERS</span>, all jewellery is sold with genuine certifications for complete trust.
        </p>
      </>
    ),
  },
  {
    number: "7.",
    title: "Selecting the Perfect Design",
    content: (
      <>
        <p style={{ fontSize: '20px', color: '#CF9D12', fontWeight: '500', marginBottom: '24px', textAlign: 'center', textDecoration: 'underline' }}>
          Jewellery should reflect your personal style. Consider the following
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', textAlign: 'center', maxWidth: '1100px', margin: '0 auto' }}>
          <div>
            <p style={{ fontSize: '20px', fontWeight: '600', color: '#CF9D12', textDecoration: 'underline', marginBottom: '16px' }}>Daily Wear</p>
            <p style={{ fontSize: '18px', color: '#1A1E23', lineHeight: '1.6' }}>
              Lightweight,<br />
              Comfortable,<br />
              Simple Designs.
            </p>
          </div>
          <div>
            <p style={{ fontSize: '20px', fontWeight: '600', color: '#CF9D12', textDecoration: 'underline', marginBottom: '16px' }}>Office Wear</p>
            <p style={{ fontSize: '18px', color: '#1A1E23', lineHeight: '1.6' }}>
              Elegant and subtle,<br />
              Classic chains,<br />
              studs, bracelets
            </p>
          </div>
          <div>
            <p style={{ fontSize: '20px', fontWeight: '600', color: '#CF9D12', textDecoration: 'underline', marginBottom: '16px' }}>Wedding & Special Occasions</p>
            <p style={{ fontSize: '18px', color: '#1A1E23', lineHeight: '1.6' }}>
              Heavy traditional designs,<br />
              Antique gold, diamond sets,<br />
              polki jewellery
            </p>
          </div>
          <div>
            <p style={{ fontSize: '20px', fontWeight: '600', color: '#CF9D12', textDecoration: 'underline', marginBottom: '16px' }}>Modern Style</p>
            <p style={{ fontSize: '18px', color: '#1A1E23', lineHeight: '1.6' }}>
              Sleek, minimalist,<br />
              rose gold tones,<br />
              Custom and contemporary designs.
            </p>
          </div>
        </div>
        <p style={{ fontSize: '20px', color: '#1A1E23', marginTop: '32px', textAlign: 'center' }}>
          <span style={{ color: '#CF9D12', fontWeight: '600' }}>TAMIRI JEWELLERS</span> offers a diverse range of designs to suit every individual's personality.
        </p>
      </>
    ),
  },
  {
    number: "8.",
    title: "Check Craftsmanship and Finishing",
    content: (
      <>
        <p style={{ fontSize: '18px', color: '#1A1E23', marginBottom: '10px' }}>Quality craftsmanship is the foundation of durable jewellery.</p>
        <p style={{ fontSize: '18px', fontWeight: '600', color: '#c8930a', marginBottom: '6px', textDecoration: 'underline' }}>Look for:</p>
        <ul style={{ fontSize: '18px', color: '#1A1E23', lineHeight: '2', paddingLeft: '20px', margin: '0 0 10px' }}>
          <li>Smooth edges</li>
          <li>Strong clasps</li>
          <li>Neat stone settings</li>
          <li>Secure prongs</li>
          <li>Even finishing and polishing.</li>
        </ul>
        <p style={{ fontSize: '18px', color: '#1A1E23', margin: 0 }}>Our artisans ensure every piece meets the highest standards of craftsmanship.</p>
      </>
    ),
  },
  {
    number: "9.",
    title: "Buy From Trusted Jewellers",
    content: (
      <>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '18px', fontWeight: '700', color: '#CF9D12', margin: '0 0 12px', letterSpacing: '0.5px', textDecoration: 'underline' }}>Final Word from TAMIRI JEWELLERS PVT LTD</p>
          <p style={{ fontSize: '18px', color: '#1A1E23', lineHeight: '1.7', margin: '0 0 20px' }}>
            Jewellery buying should be a joyful and informed experience. Whether you're selecting a timeless gold piece, dazzling diamonds, or a unique custom-made design, <span style={{ color: '#c8930a', fontWeight: '600' }}>TAMIRI JEWELLERS</span> is here to guide you every step of the way.
          </p>
          <p style={{ fontSize: '18px', color: '#1A1E23', margin: 0 }}>
            With our commitment to purity, craftsmanship and trust, we ensure your jewellery becomes a cherished part of your life and legacy.
          </p>
        </div>
      </>
    ),
  },
];

interface AccordionSectionProps {
  section: {
    number: string;
    title: string;
    content: React.ReactNode;
  };
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionSection = ({ section, isOpen, onToggle }: AccordionSectionProps) => {
  return (
    <div style={{
      borderBottom: '1px solid #e8e0d0',
      background: '#fff',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: '12px',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px', fontWeight: '700', color: '#CF9D12', minWidth: '22px' }}>{section.number}</span>
          <span style={{ fontSize: '24px', fontWeight: '600', color: '#CF9D12' }}>{section.title}</span>
        </span>
        {isOpen ? chevronUp : chevronDown}
      </button>
      {isOpen && (
        <div style={{
          padding: '4px 24px 20px 24px',
          marginLeft: '24px',
        }}>
          {section.content}
        </div>
      )}
    </div>
  );
};

const JewelleryBuyingGuide = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fff',
      fontFamily: 'Georgia, "Times New Roman", serif',
      padding: '0 0 60px',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        padding: '40px 20px 24px',
        background: '#fff',
        marginBottom: '24px',
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#1a1a1a',
          margin: '0 0 24px',
          fontFamily: 'Georgia, serif',
          letterSpacing: '0.5px',
        }}>
          Jewellery Buying Guide
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#555',
          lineHeight: '1.75',
          maxWidth: '1100px',
          margin: '0 auto 20px',
          fontWeight: '400'
        }}>
          Buying jewellery is more than a purchase – it is an investment in beauty, craftsmanship, and emotion. Whether you are selecting a gold bangle, a diamond ring, or a bridal set, the right knowledge can help you make a confident and meaningful choice.
        </p>
        <p style={{
          fontSize: '18px',
          color: '#555',
          lineHeight: '1.75',
          maxWidth: '1100px',
          margin: '0 auto',
          fontWeight: '400'
        }}>
          At <span style={{ color: '#c8930a', fontWeight: '600' }}>TAMIRI JEWELLERS PVT LTD</span>, we believe in transparency and customer education. This Jewellery Buying Guide is designed to help you understand everything you need to know before making your next jewellery purchase.
        </p>
      </div>

      {/* Accordion Sections */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        background: '#fff',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        {sections.map((section, i) => (
          <AccordionSection 
            key={i} 
            section={section} 
            isOpen={openIndex === i}
            onToggle={() => handleToggle(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default JewelleryBuyingGuide;