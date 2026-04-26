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
  const [rateData, setRateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    (async () => {
      try {
        const data = await apiService.getDailyMetalRates();
        const arr = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
        setRateData(arr[0] || null);
      } catch (e) {
        console.error('Failed to fetch gold rates:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const GST = 0.03;
  // Fallback matches the reference card
  const fallback = { gold_24k: 14845, gold_22k: 13670, gold_18k: 10645 };
  const src = rateData || fallback;
  const r24 = Number(src.gold_24k || 0);
  // If the API only returns 24K, derive 22K and 18K from karat ratios
  const r22 = Number(src.gold_22k) || r24 * (22 / 24); // 91.66% of 24K
  const r18 = Number(src.gold_18k) || r24 * (18 / 24); // 75%   of 24K
  const fmt = (n: number) => Math.round(n).toLocaleString('en-IN');
console.log(rateData,"ratedataaaaaaaaaaaa")
  const rows = [
    { karat: '24 KTS (999)',   tax: 'Including 3 % GST', price: fmt(r24 * 100 * (1 + GST)), unit: '(100 Grams)' },
    { karat: '22 KTS (91.65)', tax: 'Without 3 % GST',    price: fmt(r22),                   unit: '(Per Grams)' },
    { karat: '22 KTS (91.65)', tax: 'Including 3 % GST',  price: fmt(r22 * (1 + GST)),       unit: '(Per Grams)' },
    { karat: '18 KTS (750)',   tax: 'Without 3 % GST',    price: fmt(r18),                   unit: '(Per Grams)' },
    { karat: '18 KTS (750)',   tax: 'Including 3 % GST',  price: fmt(r18 * (1 + GST)),       unit: '(Per Grams)' },
  ];

  const PhoneIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
  const PinIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );

  return (
    <div style={{
      width: isMobile ? 300 : 340,
      borderRadius: 14,
      boxShadow: '0 14px 36px rgba(0,0,0,0.30)',
      fontFamily: SF,
      position: 'relative',
      overflow: 'hidden',
      color: '#fff',
    }}>
      {/* Dark gold bokeh backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at 20% 15%, rgba(212,175,55,0.25), transparent 45%),
                     radial-gradient(circle at 80% 75%, rgba(212,175,55,0.18), transparent 50%),
                     linear-gradient(160deg, #201610 0%, #140c08 55%, #0c0704 100%)`,
        zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, padding: isMobile ? '20px 18px' : '24px 22px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <img src={tamiriLogo} alt="TAMIRI JEWELLERS PVT LTD" style={{ maxWidth: 130, height: 'auto' }} />
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: isMobile ? 20 : 22,
          fontWeight: 600,
          margin: '4px 0 0',
          textAlign: 'center',
          fontFamily: "'Times New Roman', Times, serif",
          letterSpacing: 0.3,
          color: '#fff',
        }}>
          Today's Gold Rate
        </h2>

        {/* Diamond ornament divider */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '10px 0 18px' }}>
          <div style={{ width: 46, height: 1, background: '#d4af37' }} />
          <div style={{ width: 8, height: 8, background: '#d4af37', transform: 'rotate(45deg)' }} />
          <div style={{ width: 46, height: 1, background: '#d4af37' }} />
        </div>
        {/* e8d9a8 */}
        {/* Rate rows */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#d4af37' }}>Loading rates…</div>
        ) : (
          rows.map((row, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11.5, color: '#fff', padding: '0 8px 4px' }}>
                <span>{row.karat}</span>
                <span>–</span>
                <span>{row.tax}</span>
              </div>
              <div style={{
                border: '1px solid #fff',
                borderRadius: 999,
                padding: '7px 16px',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: 10,
                background: 'rgba(255,255,255,0.03)',
              }}>
                <span style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, fontFamily: "'Times New Roman', Times, serif" }}>
                  {row.price}/-
                </span>
                <span style={{ fontSize: 12, color: '#fff' }}>{row.unit}</span>
              </div>
            </div>
          ))
        )}

        {/* Phone */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 18, padding: '0 4px' }}>
          <PhoneIcon />
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: 1.5 }}>+91 86625 76870</span>
        </div>

        {/* Address */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 10, padding: '0 4px' }}>
          <div style={{ marginTop: 3 }}><PinIcon /></div>
          <span style={{ fontSize: 11.5, color: '#fff', lineHeight: 1.5 }}>
            Rajagopalachari Street, Governorpet, Vijayawada , 520002
          </span>
        </div>

        {/* Fine print */}
        <div style={{ textAlign: 'center', fontSize: 10, color: '#fff', marginTop: 14, letterSpacing: 0.4 }}>
          (SRI SK JEWELS - A UNIT OF TAMIRI JEWELLERS PVT LTD)
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
        textTransform: "capitalize",
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
  const navItemPaddingX = windowWidth < 1280 ? 26 : 52;
  const navItemPadding = `0 ${navItemPaddingX}px`;

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
    { label: "ABOUT US", path: "/about", isActive: isActiveRoute('/about') },
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
            // background: "#ffffff",
            borderBottom: "1px solid rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `url(${headerBg}) no-repeat center center`,
            height: "56px",
            width: "100%",
            zIndex: 1000,
            position: "sticky",
            top: 0,
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            fontFamily: SF,
          }}
        >
          <div style={{ display: "flex", fontSize: '15px', fontWeight: '500', fontFamily: 'inherit' }}>
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
                        fontFamily: 'inherit',
                        fontSize: '15px',
                        fontWeight: '500',
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: isActive ? "#E4AC14" : "#6b7280",
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
                        if (!isActive) e.currentTarget.style.color = "#6b7280";
                      }}
                    >
                      {item.label}
                      {hasDropdown && <ChevronDownIcon />}
                      {isActive && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: "0px",
                            left: `${navItemPaddingX}px`,
                            right: `${navItemPaddingX}px`,
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
                        fontFamily: 'inherit',
                        fontSize: '15px',
                        fontWeight: '500',
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: isActive ? "#E4AC14" : "#6b7280",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                        transition: "color 0.2s",
                        gap: "4px"
                      }}
                      onMouseEnter={e => {
                        if (!isActive && !isGoldRate) e.currentTarget.style.color = "#E4AC14";
                      }}
                      onMouseLeave={e => {
                        if (!isActive && !isGoldRate) e.currentTarget.style.color = "#6b7280";
                      }}
                    >
                      {item.label}
                      {hasDropdown && <ChevronDownIcon />}
                      {isActive && (
                        <span
                          style={{
                            position: "absolute",
                            bottom: "0px",
                            left: `${navItemPaddingX}px`,
                            right: `${navItemPaddingX}px`,
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
