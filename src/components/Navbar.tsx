import { useState, useEffect, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiService, type Category } from "../services/api";
import tamiriLogo from "../assets/tamiri-logo.png";
import headerBg from '../assets/header-bg.jpeg';

const SF = "-apple-system, 'SF Pro Display', 'SF Pro Text', BlinkMacSystemFont, sans-serif";

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const HamburgerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

function GoldRatePopup() {
  const [goldRates, setGoldRates] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    const fetchGoldRates = async () => {
      try {
        const data = await apiService.getDailyMetalRates();
        console.log('Gold rates data:', data);
        setGoldRates(data.data || data);
      } catch (error) {
        console.error('Failed to fetch gold rates:', error);
        // Keep fallback data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchGoldRates();
  }, []);

  // Parse API data based on the Postman response structure
  const parseGoldRates = (apiData: any) => {
    if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
      return [];
    }

    const rates = [];
    const rateData = apiData[0]; // Get first object from array

    // Add rates based on API structure
    if (rateData.gold_24k) {
      rates.push({
        label: "24K Gold",
        rate: `₹${parseFloat(rateData.gold_24k).toLocaleString('en-IN')}`,
        unit: "per 10 grams"
      });
    }

    if (rateData.gold_22k) {
      rates.push({
        label: "22K Gold", 
        rate: `₹${parseFloat(rateData.gold_22k).toLocaleString('en-IN')}`,
        unit: "per 10 grams"
      });
    }

    if (rateData.gold_18k) {
      rates.push({
        label: "18K Gold",
        rate: `₹${parseFloat(rateData.gold_18k).toLocaleString('en-IN')}`,
        unit: "per 10 grams"
      });
    }

    if (rateData.silver_rate) {
      rates.push({
        label: "Silver",
        rate: `₹${parseFloat(rateData.silver_rate).toLocaleString('en-IN')}`,
        unit: "per kg"
      });
    }

    if (rateData.platinum_rate) {
      rates.push({
        label: "Platinum",
        rate: `₹${parseFloat(rateData.platinum_rate).toLocaleString('en-IN')}`,
        unit: "per 10 grams"
      });
    }

    return rates;
  };

  // Fallback rates if API fails
  const fallbackRates = [
    { label: "24K Gold", rate: "₹55,535", unit: "per 10 grams" },
    { label: "22K Gold", rate: "₹14,240", unit: "per 10 grams" },
    { label: "18K Gold", rate: "₹11,651", unit: "per 10 grams" },
    { label: "Silver", rate: "₹400", unit: "per kg" },
    { label: "Platinum", rate: "₹6,698", unit: "per 10 grams" },
  ];

  const displayRates = goldRates ? parseGoldRates(goldRates) : fallbackRates;

  return (
    <div style={{
      width: isMobile ? 280 : 320,
      backgroundColor: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      padding: isMobile ? "20px 16px" : "24px 20px",
      fontFamily: SF,
      position: "relative",
      overflow: "hidden"
    }}>

      {/* 🔥 Premium Black Gradient Overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `
          radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%),
          linear-gradient(
            to bottom,
            rgba(0,0,0,0.85) 0%,
            rgba(0,0,0,0.6) 30%,
            rgba(0,0,0,0.5) 60%,
            rgba(0,0,0,0.9) 100%
          )
        `,
        zIndex: 1
      }} />

      <div style={{ position: "relative", zIndex: 2 }}>

        {/* Brand */}
        <div style={{ marginBottom: 12 }}>
          <img 
            src={tamiriLogo} 
            alt="TAMIRI" 
          />
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: isMobile ? 20 : 24,
          marginBottom: 10,
          fontWeight: 500
        }}>
          Today’s Gold Rate
        </h2>

        {/* Divider */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
          gap: 10
        }}>
          <div style={{ width: 40, height: 1, background: "#d4af37" }} />
          <div style={{
            width: 8,
            height: 8,
            background: "#d4af37",
            transform: "rotate(45deg)"
          }} />
          <div style={{ width: 40, height: 1, background: "#d4af37" }} />
        </div>

        {/* Rates */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#ddd' }}>
            Loading rates...
          </div>
        ) : (
          displayRates.map((item: any, idx: number) => (
            <div key={idx} style={{ marginBottom: 16 }}>

              {/* Label */}
              <div style={{
                fontSize: 12,
                color: "#ddd",
                marginBottom: 6
              }}>
                {item.label} &nbsp; – &nbsp; {item.tax}
              </div>

              {/* Price Pill */}
              <div style={{
                border: "1px solid rgba(255,255,255,0.7)",
                borderRadius: 30,
                padding: "6px 14px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                minWidth: 230,
                backdropFilter: "blur(2px)"
              }}>
                <span style={{
                  fontSize: isMobile ? 16 : 18,
                  fontWeight: "bold"
                }}>
                  {item.rate}
                </span>

                <span style={{
                  fontSize: 13,
                  color: "#eee"
                }}>
                  {item.unit}
                </span>
              </div>

            </div>
          ))
        )}

        {/* Phone */}
        <div style={{
          marginTop: 18,
          fontSize: 18,
          fontWeight: "bold",
          letterSpacing: 2
        }}>
          +91 86625 76870
        </div>

      </div>
    </div>
  );
}

function KnowJewelleryDropdown({ isVisible }: { isVisible: boolean }) {
  const knowJewelleryItems = [
    { name: 'Jewellery Buying Guide', path: '/jewellery-buying-guide' },
    { name: "4 C's of Diamonds", path: '/4-cs-of-diamonds' },
    { name: 'Lab Diamonds vs Natural Diamonds', path: '/lab-vs-natural-diamonds' },
    { name: 'Jewellery Care', path: '/jewellery-care' },
    { name: 'Certification Guide', path: '/certification-guide' },
    { name: 'FAQs', path: '/faqs' },
  ];

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (!isVisible) return null;

  return (
    <div style={{
      position: "absolute",
      top: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      paddingTop: 10,
      zIndex: 1001,
      width: isMobile ? 260 : 280
    }}>
      <div style={{
        backgroundColor: "#fff",
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: "8px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        overflow: "hidden"
      }}>
        {knowJewelleryItems.map((item, idx) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: "block",
              padding: isMobile ? "10px 16px" : "12px 20px",
              fontSize: isMobile ? "13px" : "14px",
              color: "#1a1a1a",
              textDecoration: "none",
              borderBottom: idx < knowJewelleryItems.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8f8f8"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}


function CustomerServicesDropdown({ isVisible }: { isVisible: boolean }) {
  const customerServicesItems = [
    { name: 'LIFE TIME EXCHANGE - POLICY', path: '/lifetime-exchange-policy' },
    { name: 'BUY BACK & REFUND - POLICY', path: '/buyback-refund-policy' },
    { name: 'CANCELLATION - POLICY', path: '/cancellation-policy' },
    { name: 'TERMS & CONDITIONS', path: '/terms-conditions' },
    { name: 'PAYMENT OPTIONS', path: '/payment-options' },
    { name: 'Contact Us & Store Location', path: '/contact' },
  ];

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (!isVisible) return null;

  return (
    <div style={{
      position: "absolute",
      top: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      paddingTop: 10,
      zIndex: 1001,
      width: isMobile ? 280 : 320
    }}>
      <div style={{
        backgroundColor: "#fff",
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: "8px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        overflow: "hidden"
      }}>
        {customerServicesItems.map((item, idx) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: "block",
              padding: isMobile ? "10px 16px" : "12px 20px",
              fontSize: isMobile ? "13px" : "14px",
              color: "#1a1a1a",
              textDecoration: "none",
              borderBottom: idx < customerServicesItems.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8f8f8"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function LinkItem({ label, to }: { label: string; to: string }) {
  return (
    <Link
      to={to}
      style={{
        display: "block",
        padding: "12px 0",
        color: "#1a1a1a",
        textDecoration: "none",
        fontFamily: SF,
        fontSize: "14px",
        fontWeight: 600,
        borderBottom: "1px solid #f2f2f2",
      }}
    >
      {label}
    </Link>
  );
}

function AccordionItem({
  title,
  isOpen,
  onClick,
  children,
}: {
  title: string;
  isOpen: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <div style={{ borderBottom: "1px solid #f2f2f2" }}>
      <button
        onClick={onClick}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#1a1a1a",
          fontFamily: SF,
          fontSize: "14px",
          fontWeight: 600,
          textAlign: "left",
        }}
      >
        <span>{title}</span>
        <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
          <ChevronDownIcon />
        </span>
      </button>
      {isOpen && <div style={{ padding: "0 0 10px 12px" }}>{children}</div>}
    </div>
  );
}

function SubItem({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      style={{
        display: "block",
        padding: "8px 0",
        color: "#4b5563",
        textDecoration: "none",
        fontFamily: SF,
        fontSize: "13px",
      }}
    >
      {children}
    </Link>
  );
}

export default function TamiriNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGoldRate, setShowGoldRate] = useState(false);
  const [showKnowJewellery, setShowKnowJewellery] = useState(false);
  const [showCustomerServices, setShowCustomerServices] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 1024; // Sync with Header.tsx

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    // If we're currently on a search results page, navigate back to products
    if (location.pathname === '/products' && location.search.includes('search=')) {
      navigate('/products');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // Dynamic padding for desktop nav items based on width
  const navItemPadding = windowWidth < 1280 ? "0 15px" : "0 28px";
  const navItemFontSize = windowWidth < 1280 ? "13px" : "15px";

  const knowJewelleryPaths = [
    '/jewellery-buying-guide', '/4-cs-of-diamonds', '/lab-vs-natural-diamonds',
    '/jewellery-care', '/certification-guide', '/faqs', '/know-your-jewellery'
  ];

  const customerServicesPaths = [
    '/lifetime-exchange-policy', '/buyback-refund-policy', '/cancellation-policy',
    '/terms-conditions', '/payment-options', '/contact'
  ];

  const isActiveRoute = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path;
  };

  const isKnowJewelleryActive = () => {
    return knowJewelleryPaths.some(path => location.pathname === path);
  };

  const isCustomerServicesActive = () => {
    return customerServicesPaths.some(path => location.pathname === path);
  };
  
  const navItems = [
    { label: "HOME", path: "/", isActive: isActiveRoute('/') },
    { label: "GOLD RATE", path: "", isActive: isActiveRoute('/gold-rate'), isGoldRate: true },
    { label: "GALLERY", path: "/products", isActive: isActiveRoute('/products') },
    { label: "KNOW YOUR JEWELLERY", path: "/know-your-jewellery", isActive: isKnowJewelleryActive(), hasDropdown: true, dropdownType: 'know' },
    { label: "CUSTOMER SERVICES", path: null, isActive: isCustomerServicesActive(), hasDropdown: true, dropdownType: 'customer' },
    { label: "ABOUT", path: "/about", isActive: isActiveRoute('/about') },
  ];

  // Mobile Menu Component
 const MobileMenu = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (key: string) => {
    setActiveDropdown(prev => (prev === key ? null : key));
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setIsMobileMenuOpen(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(6px)",
          zIndex: 1050,
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "85%",
          maxWidth: 380,
          height: "100%",
          background: "#fff",
          zIndex: 1060,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-10px 0 30px rgba(0,0,0,0.15)",
          animation: "slideIn 0.3s ease",
        }}
      >
        <style>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}</style>

        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "18px 20px",
          borderBottom: "1px solid #eee"
        }}>
          <img src="/tamiri-logo.png" style={{ height: 28 }} />
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <CloseIcon />
          </button>
        </div>

        {/* Menu */}
        <div style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 14,
          overflowY: "auto"
        }}>

          {/* SIMPLE LINKS */}
          <LinkItem label="HOME" to="/" />
          <LinkItem label="ABOUT" to="/about" />

          {/* ACCORDION */}
          <AccordionItem
            title="GALLERY"
            isOpen={activeDropdown === "gallery"}
            onClick={() => toggleDropdown("gallery")}
          >
            <SubItem to="/products">All Products</SubItem>
            {categories.map(c => (
              <SubItem key={c.id} to={`/products?category=${c.id}`}>
                {c.category_name}
              </SubItem>
            ))}
          </AccordionItem>

          <AccordionItem
            title="KNOW YOUR JEWELLERY"
            isOpen={activeDropdown === "know"}
            onClick={() => toggleDropdown("know")}
          >
            <SubItem to="/jewellery-buying-guide">Buying Guide</SubItem>
            <SubItem to="/4-cs-of-diamonds">4 C's</SubItem>
            <SubItem to="/lab-vs-natural-diamonds">Lab vs Natural</SubItem>
          </AccordionItem>

          <AccordionItem
            title="CUSTOMER SERVICES"
            isOpen={activeDropdown === "service"}
            onClick={() => toggleDropdown("service")}
          >
            <SubItem to="/contact">Contact</SubItem>
            <SubItem to="/terms-conditions">Terms</SubItem>
          </AccordionItem>

        </div>

        {/* Bottom Card */}
        <div style={{
          marginTop: "auto",
          padding: 20,
          background: "#fafafa",
          borderTop: "1px solid #eee"
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 12,
            padding: 16,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
          }}>
            <p style={{ fontSize: 13, color: "#888" }}>Need Help?</p>
            <p style={{ fontWeight: 600 }}>+91 99591 45959</p>
          </div>
        </div>
      </div>
    </>
  );
};

  return (
    <>
      {/* Desktop Navbar */}
      {!isMobile && (
        <nav
          style={{
            background: "#ffffff",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "56px",
            width: "100%",
            zIndex: 1000,
            position: "sticky",
            top: 0,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex" }}>
            {navItems.map((item) => {
              const isActive = item.isActive;
              const isGoldRate = item.isGoldRate;
              const hasDropdown = item.hasDropdown;

              return (
                <div 
                  key={item.label} 
                  style={{ position: "relative" }}
                  onMouseEnter={() => {
                    if (isGoldRate) setShowGoldRate(true);
                    if (item.dropdownType === 'know') setShowKnowJewellery(true);
                    if (item.dropdownType === 'customer') setShowCustomerServices(true);
                  }}
                  onMouseLeave={() => {
                    if (isGoldRate) setShowGoldRate(false);
                    if (item.dropdownType === 'know') setShowKnowJewellery(false);
                    if (item.dropdownType === 'customer') setShowCustomerServices(false);
                  }}
                >
                  {item.path ? (
                    <Link
                      to={item.path}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: navItemPadding,
                        height: "56px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        fontFamily: SF,
                        fontSize: navItemFontSize,
                        fontWeight: "510",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: isActive ? "#E4AC14" : "#1a1a1a",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                        transition: "color 0.2s",
                        textDecoration: "none",
                        gap: "4px"
                      }}
                      onMouseEnter={e => {
                        if (!isActive) e.currentTarget.style.color = "#E4AC14";
                      }}
                      onMouseLeave={e => {
                        if (!isActive) e.currentTarget.style.color = "#1a1a1a";
                      }}
                    >
                      {item.label}
                      {hasDropdown && <ChevronDownIcon />}
                      {isActive && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: "0px",
                            left: "28px",
                            right: "28px",
                            height: "2px",
                            background: "#E4AC14",
                            borderRadius: "1px",
                          }}
                        />
                      )}
                    </Link>
                  ) : (
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: isGoldRate ? "default" : "pointer",
                        padding: navItemPadding,
                        height: "56px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        fontFamily: SF,
                        fontSize: navItemFontSize,
                        fontWeight: "510",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: isActive ? "#E4AC14" : "#1a1a1a",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                        transition: "color 0.2s",
                        gap: "4px"
                      }}
                      onMouseEnter={e => {
                        if (!isActive && !isGoldRate) e.currentTarget.style.color = "#E4AC14";
                      }}
                      onMouseLeave={e => {
                        if (!isActive && !isGoldRate) e.currentTarget.style.color = "#1a1a1a";
                      }}
                    >
                      {item.label}
                      {hasDropdown && <ChevronDownIcon />}
                      {isActive && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: "0px",
                            left: "28px",
                            right: "28px",
                            height: "2px",
                            background: "#E4AC14",
                            borderRadius: "1px",
                          }}
                        />
                      )}
                    </button>
                  )}

                  {isGoldRate && showGoldRate && (
                    <div style={{ 
                      position: "absolute", 
                      top: "100%", 
                      left: "50%", 
                      transform: "translateX(-50%)", 
                      paddingTop: 10,
                      zIndex: 1001 
                    }}>
                      <GoldRatePopup />
                    </div>
                  )}

                  {item.dropdownType === 'know' && (
                    <KnowJewelleryDropdown isVisible={showKnowJewellery} />
                  )}

                  {item.dropdownType === 'customer' && (
                    <CustomerServicesDropdown isVisible={showCustomerServices} />
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      )}

      {/* Mobile Navbar */}
      {isMobile && (
        <>
          {/* Mobile Header Bar - STICKY (Logo & Hamburger Only) */}
          <div style={{
            background: `url(${headerBg}) no-repeat center center`,
            backgroundSize: 'cover',
            borderBottom: "1px solid rgba(198, 138, 52, 0.2)",
            padding: "12px 16px",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              {/* Logo */}
              <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                  src="/tamiri-logo.png" 
                  alt="TAMIRI" 
                  style={{ height: 32, width: 'auto' }}
                />
              </Link>
              
              {/* Hamburger Menu Icon - Right */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HamburgerIcon />
              </button>
            </div>
          </div>

          {/* Separation Line between Logo and Search Bar */}
          <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', width: '100%' }} />
          
          {/* Mobile Search Bar - NOT STICKY (Scrolls Up) */}
          <div style={{
            background: "#fff", // Plain background
            padding: "8px 16px", // Decreased vertical padding
            position: "relative",
            zIndex: 999,
          }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
              <form onSubmit={handleSearch} style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: 15,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  pointerEvents: 'none',
                  zIndex: 1
                }}>
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search Your favourite Jewellery..."
                  style={{
                    width: '100%',
                    padding: '8px 45px 8px 45px', // Added right padding for clear button
                    borderRadius: '9999px',
                    border: '1px solid #e5e7eb',
                    outline: 'none',
                    fontSize: 13,
                    fontFamily: SF,
                    backgroundColor: '#f9fafb',
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
                    boxSizing: 'border-box',
                  }}
                />
                {/* Clear Search Button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    style={{
                      position: 'absolute',
                      right: 15,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#9ca3af',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      zIndex: 2,
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#6b7280'}
                    onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                )}
              </form>
            </div>
          </div>
          
          {/* Mobile Menu Full-screen */}
          {isMobileMenuOpen && <MobileMenu />}
        </>
      )}
    </>
  );
}
