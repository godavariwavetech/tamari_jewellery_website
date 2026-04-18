import { useState } from 'react';

const goldColor = "#CF9D12";
const borderLight = "#e8dcc8";
const textDark = "#222";
const textMid = "#444";

const chevronUp = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={goldColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);
const chevronDown = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const faqData = [
  {
    category: "Jewellery Buying Guide – FAQs",
    questions: [
      {
        q: "1. Why is it important to understand jewellery before buying?",
        a: "Jewellery is both an emotional purchase and a long-term investment. Understanding factors like purity, craftsmanship, certifications, and care helps you make confident, informed decisions and ensures lasting value."
      },
      {
        q: "2. How do I decide the right jewellery for my needs?",
        a: "Start by identifying the purpose — daily wear, office wear, special occasions, or investment — and set a budget. This helps streamline the right metal purity, design style, and gemstones."
      },
      {
        q: "3. What gold purity should I choose?",
        a: null,
        bullets: [
          "24K (99.9%) – Pure gold; best for investment, not suitable for jewellery",
          "22K (91.6%) – Ideal for traditional Indian jewellery",
          "18K (75%) – Strong and durable; perfect for diamond jewellery",
          "14K (58.5%) – Budget-friendly and suitable for daily-wear jewellery",
          "Tamiri Jewellers Pvt Ltd recommends always choosing 916 Hallmarked gold."
        ]
      },
      {
        q: "4. What is BIS hallmarking and why is it important?",
        a: "BIS Hallmarking confirms the purity and authenticity of gold jewellery in India. It protects consumers from mislabelled content and ensures trust and transparency.",
        sub: "Before you begin, consider:",
        bullets2: [
          "Is the jewellery for daily wear, a special occasion, or as a special event?",
          "Are you buying as an investment or for regular?",
          "What is your budget range?",
          "Knowing this helps Tamiri Jewellers better clarify design options, and gemstones."
        ]
      },
      {
        q: "5. How can I verify the HUID number on gold jewellery?",
        a: "You can verify the HUID using the BIS CARE App or entering the 6-digit alphanumeric code engraved on every piece. It confirms quality, purity and all other details."
      }
    ]
  },
  {
    category: "Diamonds & the 4 C's – FAQs",
    questions: [
      {
        q: "6. What are the 4 C's of diamonds?",
        a: "The 4 C's are Cut, Colour, Clarity, and Carat Weight, which together determine a diamond's quality, beauty, and value."
      },
      {
        q: "7. Which is the most important of the 4 C's?",
        a: "Cut is the most important factor, as it directly affects a diamond's brilliance and sparkle — even more than size."
      },
      {
        q: "8. Does higher carat mean a better diamond?",
        a: "Not always. Carat refers to weight, not quality. A well-cut small diamond can look more brilliant than a large diamond with poor cut."
      },
      {
        q: "9. Are inclusions always visible in diamonds?",
        a: "Most inclusions are microscopic and not visible to the naked eye. Tamiri Jewellers selects diamonds that balance clarity, beauty, and value."
      }
    ]
  },
  {
    category: "Lab-Grown vs Natural Diamonds – FAQs",
    questions: [
      {
        q: "10. Are lab-grown diamonds real diamonds?",
        a: "Yes. Lab-grown diamonds are chemically, physically, and optically identical to natural diamonds. The only difference is how they are obtained."
      },
      {
        q: "11. What is the main difference between lab-grown and natural diamonds?",
        a: "Natural diamonds are formed over billions of years inside the Earth, while lab-grown diamonds are created in controlled laboratories using advanced technology."
      },
      {
        q: "12. Are lab-grown diamonds more affordable?",
        a: "Yes. Lab-grown diamonds generally cost less, allowing customers to choose bigger or higher-quality stones within the same budget."
      },
      {
        q: "13. Which diamond has better resale value?",
        a: "Natural diamonds usually hold a higher long-term resale value due to their rarity."
      },
      {
        q: "14. Does Tamiri Jewellers sell both types?",
        a: "Yes. Tamiri Jewellers Pvt Ltd offers both natural and lab-grown options, fully certified and transparently disclosed."
      }
    ]
  },
  {
    category: "Jewellery Care – FAQs",
    questions: [
      {
        q: "15. How can I protect my jewellery during daily activities?",
        a: "Avoid wearing jewellery during household chores, bathing, swimming, or sports. Keep jewellery away from chemicals and wear it after applying cosmetics."
      },
      {
        q: "16. How often should I clean my jewellery?",
        a: "Light cleaning can be done at home regularly. Professional cleaning is recommended every 6–12 months for best results."
      },
      {
        q: "17. How should I clean gold jewellery at home?",
        a: "Soak in warm water with mild soap for 10–15 minutes, gently brush with a soft toothbrush, rinse, and pat dry with a soft cloth."
      },
      {
        q: "18. How should I clean diamond jewellery?",
        a: "Use a mild cleaning solution, clean carefully around prongs and settings, and wipe with a lint-free cloth to restore brilliance."
      },
      {
        q: "19. What products should I avoid while cleaning jewellery?",
        a: "Avoid bleach, alcohol, sanitisers, toothpaste, and harsh chemicals as they can damage metal, stones, and settings."
      }
    ]
  },
  {
    category: "Jewellery Storage & Maintenance – FAQs",
    questions: [
      {
        q: "20. How should jewellery be stored?",
        a: "Store jewellery separately in soft pouches or velvet-lined boxes with separate compartments to prevent scratches."
      },
      {
        q: "21. Why is humidity harmful to jewellery?",
        a: "Moisture can tarnish gold, silver, and oxidise it. Keeping storage particularly in jewellery boxes helps control humidity."
      },
      {
        q: "22. How should delicate jewellery like chains be stored?",
        a: "Chains, mangalsutras, and bracelets should always be stored individually to avoid tangling and damage."
      },
      {
        q: "23. Do diamonds need special care?",
        a: "No. While diamonds are hard, their settings can loosen. Regular inspection and careful handling are essential."
      }
    ]
  },
  {
    category: "Jewellery Storage & Maintenance – FAQs",
    questions: [
      {
        q: "24. What is jewellery certification?",
        a: "Certification is an official document that verifies metal purity, diamond or gemstone authenticity, and quality grading."
      },
      {
        q: "25. Which diamond certifications does Tamiri Jewellers provide?",
        a: "Tamiri Jewellers provides diamonds certified by GIA, IGI, and SGL ensuring global and national standards."
      },
      {
        q: "26. Are lab-grown diamonds also certified?",
        a: "Yes. Lab-grown diamonds are certified with full disclosure of growth method (CVD or HPHT) and quality grading."
      },
      {
        q: "27. Is an invoice the same as a certificate?",
        a: "No. An invoice proves purchase and price, whereas a certificate proves authenticity and quality. Both should be kept safely."
      },
      {
        q: "28. Why is certified jewellery important for resale or exchange?",
        a: "Certified jewellery has higher resale value, is easier to exchange or upgrade, and faces fewer valuation disputes."
      }
    ]
  },
  {
    category: "Final Trust & Assurance",
    questions: [
      {
        q: "29. Why should I buy jewellery from Tamiri Jewellers Pvt Ltd?",
        a: null,
        intro: "Tamiri Jewellers Pvt Ltd offers:",
        bullets: [
          "BIS Hallmarked gold",
          "Certified natural and lab-grown diamonds",
          "Transparent pricing",
          "Expert guidance",
          "Long-term service and trust"
        ]
      },
      {
        q: "30. What is Tamiri Jeweller's promise to customers?",
        a: "We promise purity, craftsmanship, transparency, and timely truth — because your jewellery deserves nothing less."
      }
    ]
  }
];

interface FAQItemProps {
  item: {
    q: string;
    a?: string | null;
    intro?: string;
    sub?: string;
    bullets?: string[];
    bullets2?: string[];
  };
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ item, isOpen, onToggle }: FAQItemProps) {
  return (
    <div style={{
      borderBottom: `1px solid ${borderLight}`,
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: 12,
        }}
      >
        <span style={{
          fontSize: 24,
          fontWeight: 600,
          color: isOpen ? goldColor : textDark,
          lineHeight: 1.5,
          flex: 1,
          fontFamily: 'sans-serif',
        }}>{item.q}</span>
        <span style={{ flexShrink: 0 }}>{isOpen ? chevronUp : chevronDown}</span>
      </button>
      {isOpen && (
        <div style={{
          paddingBottom: 16,
          paddingRight: 24,
        }}>
          {item.intro && (
            <p style={{ fontSize: 18, color: textMid, margin: '0 0 6px', fontFamily: 'sans-serif', lineHeight: 1.7 }}>{item.intro}</p>
          )}
          {item.a && (
            <p style={{ fontSize: 18, color: textMid, margin: '0 0 6px', fontFamily: 'sans-serif', lineHeight: 1.7 }}>{item.a}</p>
          )}
          {item.sub && (
            <p style={{ fontSize: 18, color: textMid, margin: '8px 0 4px', fontFamily: 'sans-serif', fontStyle: 'italic' }}>{item.sub}</p>
          )}
          {(item.bullets || item.bullets2) && (
            <ul style={{ margin: '4px 0 0 0', paddingLeft: 18 }}>
              {(item.bullets || []).map((b, i) => (
                <li key={i} style={{ fontSize: 18, color: textMid, marginBottom: 4, lineHeight: 1.6, fontFamily: 'sans-serif' }}>{b}</li>
              ))}
              {(item.bullets2 || []).map((b, i) => (
                <li key={i} style={{ fontSize: 18, color: textMid, marginBottom: 4, lineHeight: 1.6, fontFamily: 'sans-serif' }}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function FAQs() {
  const [openKey, setOpenKey] = useState(null);

  const toggle = (key: string) => setOpenKey(openKey === key ? null as any : key);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#fafaf8',
      fontFamily: 'Georgia, serif',
      padding: '0 0 60px',
    }}>
      {/* Title */}
      <div style={{
        textAlign: 'center',
        padding: '28px 20px 10px',
        borderBottom: `1px solid ${borderLight}`,
        background: '#fff',
      }}>
        <h1 style={{
          fontSize: 34,
          fontWeight: 700,
          color: textDark,
          margin: 0,
          letterSpacing: 1.5,
          fontFamily: 'times new roman',
          textTransform: 'uppercase',
        }}>FAQs</h1>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
        {faqData.map((section, si) => (
          <div key={si} style={{ marginTop: si === 0 ? 28 : 32 }}>
            {/* Category Divider */}
            <div style={{
              textAlign: 'center',
              padding: '10px 0 18px',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                right: 0,
                height: 1,
                background: borderLight,
                transform: 'translateY(-50%)',
                zIndex: 0,
              }} />
              <span style={{
                position: 'relative',
                zIndex: 1,
                background: '#fafaf8',
                padding: '0 16px',
                fontSize: 24,
                fontWeight: 700,
                color: goldColor,
                letterSpacing: 0.3,
                fontFamily: 'sans-serif',
              }}>{section.category}</span>
            </div>

            {/* Questions */}
            <div>
              {section.questions.map((item, qi) => {
                const key = `${si}-${qi}`;
                return (
                  <FAQItem
                    key={key}
                    item={item}
                    isOpen={openKey === key}
                    onToggle={() => toggle(key)}
                  />
                );
              })}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}