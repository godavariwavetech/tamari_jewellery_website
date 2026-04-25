import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import images
import jewelryBuyingImg from '../assets/knowyourguide.jpg';
import diamondImg from '../assets/4cdiamond.jpg';
import labVsNaturalImg from '../assets/chain.png';
import jewelryCareImg from '../assets/earring.png';
import certificationImg from '../assets/product.png';
import faqImg from '../assets/bride.png';

/* ─── Gold highlight helper ─────────────────────────────────────────────── */
const Gold = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: '#c9931a', fontWeight: '600' }}>{children}</span>
);

/* ─── Individual Card ────────────────────────────────────────────────────── */
const Card = ({ section }: { section: any }) => {
  const [hovered, setHovered] = React.useState(false);
  const navigate = useNavigate();
  const isLeft = section.side === 'left';

  const DIAMOND_BOX = 160;
  const OVERLAP     = 46;

  const handleClick = () => {
    navigate(`/${section.id}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: isLeft ? 'row' : 'row-reverse',
        cursor: 'pointer',
      }}
    >
      {/* ── Diamond image ── */}
      <div style={{
        width:  `${DIAMOND_BOX}px`,
        height: `${DIAMOND_BOX}px`,
        flexShrink: 0,
        position: 'relative',
        zIndex: 2,
        marginRight: isLeft  ? `-${OVERLAP}px` : '0',
        marginLeft:  !isLeft ? `-${OVERLAP}px` : '0',
      }}>
        <div style={{
          width: '132px',
          height: '132px',
          transform: 'rotate(45deg)',
          overflow: 'hidden',
          borderRadius: '18px',
          position: 'absolute',
          top: '50%', left: '50%',
          marginTop: '-66px', marginLeft: '-66px',
          backgroundColor: '#2a2a2a',
        }}>
          <img
            src={section.image}
            alt={section.title}
            style={{
              width: '188px',
              height: '188px',
              objectFit: 'cover',
              transform: 'rotate(-45deg)',
              position: 'absolute',
              top: '50%', left: '50%',
              marginTop: '-94px', marginLeft: '-94px',
            }}
          />
        </div>
      </div>

      {/* ── Pill card ── */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          flex: 1,
          backgroundColor: '#FBF5EA',
          border: '1.5px solid #d4b86a',
          borderRadius: isLeft
            ? '10px 999px 999px 10px'
            : '999px 10px 10px 999px',
          padding: isLeft
            ? `18px 32px 18px ${OVERLAP + 18}px`
            : `18px ${OVERLAP + 18}px 18px 32px`,
          transition: 'box-shadow 0.25s ease, transform 0.25s ease',
          boxShadow: hovered
            ? '0 8px 28px rgba(0,0,0,0.13)'
            : '0 3px 14px rgba(0,0,0,0.07)',
          transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
          minHeight: '80px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h3 style={{
          fontSize: '17px',
          fontWeight: '700',
          color: '#1A1E23',
          margin: '0 0 5px',
          letterSpacing: '0.4px',
          fontFamily: "'Times New Roman', Times, serif",
        }}>
          {section.title}
        </h3>
        <p style={{
          fontSize: '13px',
          color: '#55616B',
          margin: 0,
          lineHeight: '1.5',
          fontFamily: "-apple-system,'SF Pro Display','SF Pro Text',BlinkMacSystemFont,sans-serif",
          fontWeight: '400',
        }}>
          {section.subtitle}
        </p>
      </div>

    </div>
  );
};

/* ─── Page ───────────────────────────────────────────────────────────────── */
const KnowYourJewellery = () => {
  const rows = [
    [
      {
        id: 'jewellery-buying-guide',
        title: 'JEWELLERY BUYING GUIDE',
        subtitle: 'Learn key factors before buying jewellery',
        image: jewelryBuyingImg,
        side: 'left',
      },
      {
        id: '4-cs-diamonds',
        title: "4 C'S OF DIAMONDS",
        subtitle: 'Discover cut, color, clarity, and carat weight',
        image: diamondImg,
        side: 'right',
      },
    ],
    [
      {
        id: 'lab-vs-natural',
        title: 'LAB - DIA VS NATURAL - DIA',
        subtitle: 'Compare the origin of both diamond types',
        image: labVsNaturalImg,
        side: 'left',
      },
      {
        id: 'jewellery-care',
        title: 'JEWELLERY CARE',
        subtitle: 'Know how to maintain jewellery properly',
        image: jewelryCareImg,
        side: 'right',
      },
    ],
    [
      {
        id: 'certification-guide',
        title: 'CERTIFICATION GUIDE',
        subtitle: 'Learn about trusted certification laboratories',
        image: certificationImg,
        side: 'left',
      },
      {
        id: 'faqs',
        title: 'FAQs',
        subtitle: 'Provides quick solutions to customer queries',
        image: faqImg,
        side: 'right',
      },
    ],
  ];

  const bottomParas = [
    <>
      Our <Gold>Know Your Jewellery</Gold> section is designed to guide you through every important aspect of jewellery ownership.
      From a <Gold>comprehensive Jewellery Buying</Gold> Guide to understanding the <Gold>4 C's of Diamonds</Gold>, we help you
      recognise true quality and value. Explore the differences between <Gold>Lab-Grown and Natural Diamonds</Gold>, learn essential{' '}
      <Gold>Jewellery Care</Gold> practices to preserve beauty and gain insight through our <Gold>Certification Guide</Gold>, ensuring
      authenticity and trust.
    </>,
    <>
      To make your journey seamless, we've also included a detailed <Gold>FAQ</Gold> section that addresses common questions and
      concerns, allowing you to shop with complete confidence.
    </>,
    <>
      At <Gold>Tamiri Jewellers Pvt Ltd</Gold>, knowledge is the foundation of trust because when you know your jewellery, you
      treasure it forever.
    </>,
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f0e8',
      fontFamily: 'Georgia, "Times New Roman", serif',
      padding: '52px 20px 72px',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '860px',
        margin: '0 auto 58px',
      }}>
        <h1 style={{
          fontSize: '34px',
          fontWeight: '800',
          color: '#000000',
          margin: '0 0 22px',
          letterSpacing: '3px',
          fontFamily: "'Times New Roman', Times, serif",
        }}>
          KNOW YOUR JEWELLERY
        </h1>
        <p style={{
          fontSize: '15.5px',
          color: '#1a1a1a',
          lineHeight: '1.75',
          margin: 0,
          fontFamily: "-apple-system,'SF Pro Display','SF Pro Text',BlinkMacSystemFont,sans-serif",
        }}>
          At <Gold>Tamiri Jewellers Pvt Ltd</Gold>, choosing fine jewellery should be as meaningful as owning it.
          Understanding the details behind craftsmanship, quality, and care empowers you to make confident and informed decisions.
        </p>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        padding: '0 10px',
      }}>
        {rows.map((row, ri) => (
          <div key={ri} style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
          }}>
            {row.map((section) => (
              <Card key={section.id} section={section} />
            ))}
          </div>
        ))}
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '74px auto 0',
        textAlign: 'center',
        padding: '0 20px',
      }}>
        {bottomParas.map((text, i) => (
          <p key={i} style={{
            fontSize: '15px',
            color: '#1A1E23',
            lineHeight: '1.85',
            marginBottom: i < bottomParas.length - 1 ? '18px' : 0,
            fontFamily: "'Times New Roman', Times, serif",
          }}>
            {text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default KnowYourJewellery;