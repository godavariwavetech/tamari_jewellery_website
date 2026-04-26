import { useState, useEffect } from 'react';

const FacebookIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="22" r="22" fill="#1877F2" />
    <path
      d="M28.5 14H25c-1.1 0-1.5.5-1.5 1.5V18H28l-.5 4H23.5v10h-4V22H17v-4h2.5v-2.5C19.5 12.5 21.2 11 24 11c1.3 0 3 .2 4.5.4V14z"
      fill="white"
    />
  </svg>
);

const InstagramIcon = () => (
  <svg width="44" height="44" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ig-grad" cx="30%" cy="107%" r="130%">
        <stop offset="0%" stopColor="#ffd600" />
        <stop offset="20%" stopColor="#ff7a00" />
        <stop offset="40%" stopColor="#ff0069" />
        <stop offset="70%" stopColor="#d300c5" />
        <stop offset="100%" stopColor="#7638fa" />
      </radialGradient>
    </defs>
    <rect width="44" height="44" rx="10" fill="url(#ig-grad)" />
    <rect x="11" y="11" width="22" height="22" rx="6" fill="none" stroke="white" strokeWidth="2.2" />
    <circle cx="22" cy="22" r="5.5" fill="none" stroke="white" strokeWidth="2.2" />
    <circle cx="29" cy="15" r="1.4" fill="white" />
  </svg>
);

const VisaIcon = () => (
  <svg width="70" height="44" viewBox="0 0 70 44" xmlns="http://www.w3.org/2000/svg">
    <rect width="70" height="44" rx="6" fill="#1a1f71" />
    <text x="35" y="29" textAnchor="middle" fontFamily="Times New Roman, serif" fontSize="22" fontWeight="bold" fill="white" fontStyle="italic" letterSpacing="1">VISA</text>
  </svg>
);

const MastercardIcon = () => (
  <svg width="60" height="44" viewBox="0 0 60 44" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="44" rx="6" fill="#252525" />
    <circle cx="22" cy="22" r="13" fill="#EB001B" />
    <circle cx="38" cy="22" r="13" fill="#F79E1B" />
    <path d="M30 11.5a13 13 0 010 21A13 13 0 0130 11.5z" fill="#FF5F00" />
  </svg>
);

const RupayIcon = () => (
  <svg width="72" height="44" viewBox="0 0 72 44" xmlns="http://www.w3.org/2000/svg">
    <rect width="72" height="44" rx="6" fill="#ffffff" stroke="#e0e0e0" strokeWidth="1" />
    <text x="36" y="27" textAnchor="middle" fontFamily="Times New Roman, serif" fontSize="17" fontWeight="900" fill="#1a237e">Ru</text>
    <text x="52" y="27" textAnchor="middle" fontFamily="Times New Roman, serif" fontSize="17" fontWeight="900" fill="#e53935">Pay</text>
    <text x="63" y="22" textAnchor="middle" fontFamily="Times New Roman, serif" fontSize="11" fontWeight="bold" fill="#e53935">»</text>
  </svg>
);

const MaestroIcon = () => (
  <svg width="60" height="44" viewBox="0 0 60 44" xmlns="http://www.w3.org/2000/svg">
    <rect width="60" height="44" rx="6" fill="#252525" />
    <circle cx="22" cy="22" r="13" fill="#EB001B" opacity="0.9" />
    <circle cx="38" cy="22" r="13" fill="#00A2E5" opacity="0.9" />
    <path d="M30 11.5a13 13 0 010 21A13 13 0 0130 11.5z" fill="#6C6BBD" opacity="0.9" />
    <text x="30" y="37" textAnchor="middle" fontFamily="Times New Roman, serif" fontSize="7" fill="white" letterSpacing="0.5">maestro</text>
  </svg>
);

const AmexIcon = () => (
  <svg width="72" height="44" viewBox="0 0 72 44" xmlns="http://www.w3.org/2000/svg">
    <rect width="72" height="44" rx="6" fill="#2E77BC" />
    <text x="36" y="20" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white" letterSpacing="1">AMERICAN</text>
    <text x="36" y="32" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="bold" fill="white" letterSpacing="1">EXPRESS</text>
  </svg>
);

const UpiIcon = () => (
  <svg width="72" height="44" viewBox="0 0 72 44" xmlns="http://www.w3.org/2000/svg">
    <rect width="72" height="44" rx="6" fill="#ffffff" stroke="#e0e0e0" strokeWidth="1" />
    <text x="8" y="28" fontFamily="Arial Black, sans-serif" fontSize="18" fontWeight="900" fill="#097939">U</text>
    <text x="22" y="28" fontFamily="Arial Black, sans-serif" fontSize="18" fontWeight="900" fill="#ed752e">P</text>
    <text x="36" y="28" fontFamily="Arial Black, sans-serif" fontSize="18" fontWeight="900" fill="#097939">I</text>
    <text x="48" y="26" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#097939">»</text>
    <line x1="8" y1="32" x2="64" y2="32" stroke="#097939" strokeWidth="1.5" />
  </svg>
);

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export default function TamiriFooter() {
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  return (
    <footer
      style={{
        background: "linear-gradient(180deg, #fdf6e3 0%, #fef3cc 50%, #fde8a0 100%)",
        fontFamily: "Times New Roman, serif",
        borderTop: "1px solid rgba(201,168,76,0.2)",
      }}
    >
      {/* Main footer grid */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: isMobile ? "24px 16px" : isTablet ? "30px 24px" : "28px 32px", // Decreased desktop padding further
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
            gap: isMobile ? "24px" : isTablet ? "30px" : "16px", // Decreased desktop gap
          }}
        >

          {/* Column 1: Get In Touch */}
          <div>
            <h4
              style={{
                fontSize: isMobile ? "18px" : isDesktop ? "19px" : "22px", // Smaller desktop title
                fontWeight: "700",
                color: "#1a1a1a",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
                marginBottom: isMobile ? "12px" : isDesktop ? "10px" : "16px", // Smaller desktop margin
                textAlign: isMobile ? "center" : isTablet ? "center" : "left",
              }}
            >
              GET IN TOUCH
            </h4>
            <div
              style={{
                fontSize: isMobile ? "16px" : isDesktop ? "15px" : "18px", // Smaller desktop text
                color: "#1a1a1a",
                lineHeight: isDesktop ? "1.4" : "1.6", // Tighter desktop line height
                textAlign: isMobile ? "center" : isTablet ? "center" : "left",
              }}
            >
              <p style={{ margin: "0 0 1px" }}>
                <span style={{ fontWeight: "700", textDecoration: "underline" }}>Address:</span>
              </p>
              <p style={{ margin: "0 0 1px" }}>Flat No: 27-14-17, Shop No: 4,</p>
              <p style={{ margin: "0 0 1px" }}>Road /Street: Rajagopalachari Street,</p>
              <p style={{ margin: "0 0 1px" }}>Locality: Governorpet,</p>
              <p style={{ margin: "0 0 1px" }}>City/District: Vijayawada / NTR,</p>
              <p style={{ margin: "0 0 1px" }}>State: Andhra Pradesh, Country: India,</p>
              <p style={{ margin: "0 0 1px" }}>Pin Code: 520002.</p>
              <p style={{ margin: "8px 0 1px" }}>Phone No: +91 9959145959,</p>
              <p style={{ margin: "0 0 1px", paddingLeft: isMobile ? "0" : "88px" }}>+91 866 2576870,</p>
              <p style={{ margin: "0 0 1px", paddingLeft: isMobile ? "0" : "88px" }}>+91 866 259707.</p>
              <p style={{ margin: "8px 0 1px" }}>
                Email:{" "}
                <a
                  href="mailto:Srikanth_tamiri@Yahoo.Co.In"
                  style={{ color: "#1a1a1a", textDecoration: "underline" }}
                >
                  Srikanth_tamiri@Yahoo.Co.In
                </a>
              </p>
            </div>

            {/* Find Us On */}
            <div style={{ marginTop: "16px" }}>
              <p
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  fontWeight: "600",
                  textDecoration: "underline",
                  color: "#1a1a1a",
                  marginBottom: "10px",
                  textAlign: "center",
                }}
              >
                Find Us On
              </p>
              <div style={{ display: "flex", gap: "12px", alignItems: "center", justifyContent: "center" }}>
                <a href="#" aria-label="Facebook">
                  <FacebookIcon />
                </a>
                <a href="#" aria-label="Instagram">
                  <InstagramIcon />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: About Us */}
          <div style={{ textAlign: "center" }}>
            <h4
              style={{
                fontSize: isMobile ? "18px" : isDesktop ? "19px" : "22px",
                fontWeight: "700",
                color: "#1a1a1a",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
                marginBottom: isMobile ? "12px" : isDesktop ? "10px" : "16px",
              }}
            >
              ABOUT US
            </h4>
            <div>
              {["Our Journey", "Who We Are", "Store Location", "Press"].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    display: "block",
                    fontSize: isMobile ? "16px" : isDesktop ? "15px" : "18px",
                    color: "#1a1a1a",
                    textDecoration: "underline",
                    marginBottom: isDesktop ? "3px" : "4px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#E4AC14")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#1a1a1a")}
                >
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Know Your Jewellery */}
          <div style={{ textAlign: "center" }}>
            <h4
              style={{
                fontSize: isMobile ? "18px" : isDesktop ? "19px" : "22px",
                fontWeight: "700",
                color: "#1a1a1a",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
                marginBottom: isMobile ? "12px" : isDesktop ? "10px" : "16px",
              }}
            >
              KNOW YOUR JEWELLERY
            </h4>
            <div>
              {[
                { label: "4 C's Of Diamonds", path: "/4-cs-of-diamonds" },
                { label: "Lab Diamonds Vs Natural Diamonds", path: "/lab-vs-natural-diamonds" },
                { label: "Jewellery Care", path: "/jewellery-care" },
                { label: "Certification Guide", path: "/certification-guide" },
                { label: "FAQs", path: "/faqs" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.path} // ✅ actual route
                  style={{
                    display: "block",
                    fontSize: isMobile ? "16px" : isDesktop ? "15px" : "18px",
                    color: "#1a1a1a",
                    textDecoration: "underline",
                    marginBottom: isDesktop ? "3px" : "4px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#E4AC14")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#1a1a1a")}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Customer Services */}
          <div style={{ textAlign: "center" }}>
            <h4
              style={{
                fontSize: isMobile ? "18px" : isDesktop ? "19px" : "22px",
                fontWeight: "700",
                color: "#1a1a1a",
                textTransform: "uppercase",
                letterSpacing: "0.3px",
                marginBottom: isMobile ? "12px" : isDesktop ? "10px" : "16px",
              }}
            >
              CUSTOMER SERVICES
            </h4>
            <div style={{ marginBottom: isDesktop ? "10px" : "16px" }}>
              {[
                "Life Time Exchange – Policy",
                "Buy Back & Refund – Policy",
                "Cancellation – Policy",
                "Terms & Conditions",
                "Payment Options",
                "Contact Us & Store Locator",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  style={{
                    display: "block",
                    fontSize: isMobile ? "16px" : isDesktop ? "15px" : "18px",
                    color: "#1a1a1a",
                    textDecoration: "underline",
                    marginBottom: isDesktop ? "3px" : "4px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#E4AC14")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#1a1a1a")}
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Payment Icons */}
            <div style={{marginTop:"130px", display:"flex", justifyContent:"space-between", flexDirection:"column"}}>
              <div style={{ display: "flex", gap: "15px", justifyContent: "center", alignItems: "center", marginBottom: "px" }}>
                <VisaIcon />
                <MastercardIcon />
                <RupayIcon />
              </div>
              <div style={{ display: "flex", gap: "15px", justifyContent: "center", alignItems: "center" }}>
                <MaestroIcon />
                <AmexIcon />
                <UpiIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "rgba(0,0,0,0.25)",
          margin: isMobile ? "0 16px" : "0 32px",
        }}
      />

      {/* Bottom copyright bar */}
      <div
        style={{
          textAlign: "center",
          padding: isMobile ? "12px" : "16px 32px",
          fontSize: isMobile ? "14px" : "16px",
          fontWeight: "700",
          color: "#1a1a1a",
          lineHeight: "1.5",
          fontFamily: "Times New Roman, serif",
        }}
      >
        <p style={{ margin: "0 0 2px" }}>
          © 2025 - 2026 Tamiri Jewellers Pvt Ltd. All Rights Reserved.
        </p>
        <p style={{ margin: 0 }}>CIN: U32111AP2024PTC116923</p>
      </div>
    </footer>
  );
}