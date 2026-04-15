import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiService, type Category } from "../services/api";
import { authService } from '../services/auth';
import { CART_UPDATE_EVENT, getCurrentCartCount } from '../utils/cartUtils';
import goldRateBg from "../assets/goldrate-background.png";
import tamiriLogo from "../assets/tamiri-logo.png";
import headerBg from '../assets/header-bg.jpeg';

const SF = "-apple-system, 'SF Pro Display', 'SF Pro Text', BlinkMacSystemFont, sans-serif";

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

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
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div style={{
      width: isMobile ? 300 : 340,
      backgroundImage: `url(${goldRateBg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: isMobile ? "20px 16px" : "26px 22px",
      color: "#fff",
      fontFamily: "'Playfair Display', serif",
      position: "relative",
      borderRadius: "10px",
      overflow: "hidden",
      textAlign: "center"
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
        {[
          { label: "24 KTS (999)", tax: "Including 3 % GST", rate: "15,29,000/-", unit: "(100 Grams)" },
          { label: "22 KTS (91.65)", tax: "Without 3 % GST", rate: "13,670/-", unit: "(Per Grams)" },
          { label: "22 KTS (91.65)", tax: "Including 3 % GST", rate: "14,095/-", unit: "(Per Grams)" },
          { label: "18 KTS (750)", tax: "Without 3 % GST", rate: "10,645/-", unit: "(Per Grams)" },
          { label: "18 KTS (750)", tax: "Including 3 % GST", rate: "11,645/-", unit: "(Per Grams)" },
        ].map((item, idx) => (
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
        ))}

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

function CategoriesDropdown({ isVisible, categories }: { isVisible: boolean; categories: Category[] }) {
  const navigate = useNavigate();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  if (!isVisible) return null;

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/products?category=${categoryId}`);
  };

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
        <Link
          to="/products"
          style={{
            display: "block",
            padding: isMobile ? "10px 16px" : "12px 20px",
            fontSize: isMobile ? "13px" : "14px",
            color: "#1a1a1a",
            textDecoration: "none",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
            transition: "background-color 0.2s",
            fontWeight: 600
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8f8f8"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
        >
          All Products
        </Link>
        {categories.map((category, idx) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            style={{
              width: "100%",
              display: "block",
              padding: isMobile ? "10px 16px" : "12px 20px",
              fontSize: isMobile ? "13px" : "14px",
              color: "#1a1a1a",
              textDecoration: "none",
              borderBottom: idx < categories.length - 1 ? "1px solid rgba(0,0,0,0.05)" : "none",
              transition: "background-color 0.2s",
              background: "none",
              border: "none",
              textAlign: "left",
              cursor: "pointer"
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f8f8f8"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            {category.category_name}
          </button>
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

export default function TamiriNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showGoldRate, setShowGoldRate] = useState(false);
  const [showKnowJewellery, setShowKnowJewellery] = useState(false);
  const [showCustomerServices, setShowCustomerServices] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(authService.getCurrentUser());

  // Update user state when auth changes
  useEffect(() => {
    const checkAuthStatus = () => {
      setUser(authService.getCurrentUser());
    };

    // Check auth status on mount and set up interval to check periodically
    checkAuthStatus();
    const interval = setInterval(checkAuthStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch cart count when user changes
  useEffect(() => {
    const fetchCartCount = async () => {
      if (user?.id) {
        try {
          const count = await getCurrentCartCount();
          setCartCount(count);
        } catch (error) {
          console.error('Failed to fetch cart count:', error);
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [user]);

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = async () => {
      if (user?.id) {
        try {
          const count = await getCurrentCartCount();
          setCartCount(count);
        } catch (error) {
          console.error('Failed to fetch cart count:', error);
        }
      }
    };

    window.addEventListener(CART_UPDATE_EVENT, handleCartUpdate);
    return () => window.removeEventListener(CART_UPDATE_EVENT, handleCartUpdate);
  }, [user]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setCartCount(0);
    setIsMobileMenuOpen(false);
  };

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
      setSearchQuery(''); // Clear search input after navigation
      setIsMobileMenuOpen(false);
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

  const isOnProductsPage = location.pathname === '/products';
  
  const navItems = [
    { label: "HOME", path: "/", isActive: isActiveRoute('/') },
    { label: "GOLD RATE", path: "", isActive: isActiveRoute('/gold-rate'), isGoldRate: true },
    { label: "GALLERY", path: "/products", isActive: isActiveRoute('/products'), hasDropdown: !isOnProductsPage, dropdownType: 'categories' },
    { label: "KNOW YOUR JEWELLERY", path: "/know-your-jewellery", isActive: isKnowJewelleryActive(), hasDropdown: true, dropdownType: 'know' },
    { label: "CUSTOMER SERVICES", path: null, isActive: isCustomerServicesActive(), hasDropdown: true, dropdownType: 'customer' },
    { label: "ABOUT", path: "/about", isActive: isActiveRoute('/about') },
  ];

  // Mobile Menu Component
  const MobileMenu = () => (
    <>
      {/* Overlay */}
      <div 
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(8px)',
          zIndex: 1050,
        }}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Full-screen Menu */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: '#fff',
          zIndex: 1060,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>

        {/* Header with Close Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 30px',
        }}>
          <img 
            src="/src/assets/tamiri-logo.png" 
            alt="TAMIRI" 
            style={{ height: 32 }}
          />
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              background: '#f5f5f5',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              padding: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation Menu Items - Full Page Layout */}
        <div style={{ 
          padding: '20px 30px 60px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }}>
          {navItems.map((item) => (
            <div key={item.label}>
              {item.path ? (
                <Link
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 0',
                    textDecoration: 'none',
                    color: item.isActive ? '#E4AC14' : '#1a1a1a',
                    fontFamily: SF,
                    fontSize: 20,
                    fontWeight: 500,
                    letterSpacing: '-0.3px',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <span>{item.label}</span>
                  <ChevronRightIcon />
                </Link>
              ) : (
                <div>
                  <button
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 0',
                      background: 'none',
                      border: 'none',
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontFamily: SF,
                      fontSize: 20,
                      fontWeight: 500,
                      letterSpacing: '-0.3px',
                      color: item.isActive ? '#E4AC14' : '#1a1a1a',
                    }}
                    onClick={() => {
                      if (item.dropdownType === 'know') setShowKnowJewellery(!showKnowJewellery);
                      if (item.dropdownType === 'customer') setShowCustomerServices(!showCustomerServices);
                      if (item.dropdownType === 'categories') setShowCategories(!showCategories);
                    }}
                  >
                    <span>{item.label}</span>
                    <ChevronRightIcon />
                  </button>
                  
                  {/* Categories Submenu */}
                  {item.dropdownType === 'categories' && showCategories && (
                    <div style={{ padding: '10px 0 20px 20px', display: 'flex', flexDirection: 'column', gap: 15 }}>
                      <Link
                        to="/products"
                        onClick={() => setIsMobileMenuOpen(false)}
                        style={{
                          fontSize: 16,
                          color: '#666',
                          textDecoration: 'none',
                          fontFamily: SF,
                          fontWeight: 600
                        }}
                      >
                        All Products
                      </Link>
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/products?category=${category.id}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          style={{
                            fontSize: 16,
                            color: '#666',
                            textDecoration: 'none',
                            fontFamily: SF,
                          }}
                        >
                          {category.category_name}
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {/* Know Your Jewellery Submenu */}
                  {item.dropdownType === 'know' && showKnowJewellery && (
                    <div style={{ padding: '10px 0 20px 20px', display: 'flex', flexDirection: 'column', gap: 15 }}>
                      {[
                        { name: 'Jewellery Buying Guide', path: '/jewellery-buying-guide' },
                        { name: "4 C's of Diamonds", path: '/4-cs-of-diamonds' },
                        { name: 'Lab Diamonds vs Natural Diamonds', path: '/lab-vs-natural-diamonds' },
                        { name: 'Jewellery Care', path: '/jewellery-care' },
                        { name: 'Certification Guide', path: '/certification-guide' },
                        { name: 'FAQs', path: '/faqs' },
                      ].map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          style={{
                            fontSize: 16,
                            color: '#666',
                            textDecoration: 'none',
                            fontFamily: SF,
                          }}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                  
                  {/* Customer Services Submenu */}
                  {item.dropdownType === 'customer' && showCustomerServices && (
                    <div style={{ padding: '10px 0 20px 20px', display: 'flex', flexDirection: 'column', gap: 15 }}>
                      {[
                        { name: 'LIFE TIME EXCHANGE - POLICY', path: '/lifetime-exchange-policy' },
                        { name: 'BUY BACK & REFUND - POLICY', path: '/buyback-refund-policy' },
                        { name: 'CANCELLATION - POLICY', path: '/cancellation-policy' },
                        { name: 'TERMS & CONDITIONS', path: '/terms-conditions' },
                        { name: 'PAYMENT OPTIONS', path: '/payment-options' },
                        { name: 'Contact Us & Store Location', path: '/contact' },
                      ].map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          style={{
                            fontSize: 16,
                            color: '#666',
                            textDecoration: 'none',
                            fontFamily: SF,
                          }}
                        >
                          {subItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Contact Info */}
        <div style={{ 
          marginTop: 'auto', 
          padding: '40px 30px', 
          backgroundColor: '#f9fafb',
          borderTop: '1px solid #f0f0f0'
        }}>
          <p style={{ fontFamily: SF, fontSize: 14, color: '#888', marginBottom: 15 }}>NEED HELP?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a href="tel:+919959145959" style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a', textDecoration: 'none' }}>+91 99591 45959</a>
            <a href="mailto:Srikanth_tamiri@Yahoo.Co.In" style={{ fontSize: 14, color: '#E4AC14', textDecoration: 'none' }}>Srikanth_tamiri@Yahoo.Co.In</a>
          </div>
          
          {/* Authentication Status */}
          {user ? (
            <div style={{ marginTop: 20, marginBottom: 20 }}>
              <p style={{ fontFamily: SF, fontSize: 14, color: '#888', marginBottom: 10 }}>LOGGED IN AS</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>
                  {user.name || user.phone}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid #E4AC14',
                    background: 'transparent',
                    color: '#E4AC14',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: 20, marginBottom: 20 }}>
              <p style={{ fontFamily: SF, fontSize: 14, color: '#888', marginBottom: 10 }}>ACCOUNT</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <Link 
                  to="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: '1px solid #E4AC14',
                    background: 'transparent',
                    color: '#E4AC14',
                    fontSize: '14px',
                    fontWeight: '500',
                    textDecoration: 'none'
                  }}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    background: '#E4AC14',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500',
                    textDecoration: 'none'
                  }}
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
          
          <div style={{ display: 'flex', gap: 20, marginTop: 30 }}>
            {user ? (
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#1a1a1a' }}>
                <UserIcon />
              </Link>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#1a1a1a' }}>
                <UserIcon />
              </Link>
            )}
            <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#1a1a1a' }}>
              <HeartIcon />
            </Link>
            <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#1a1a1a', position: 'relative' }}>
              <CartIcon />
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  fontSize: '10px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '16px'
                }}>
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </>
  );

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
                    if (item.dropdownType === 'categories') setShowCategories(true);
                  }}
                  onMouseLeave={() => {
                    if (isGoldRate) setShowGoldRate(false);
                    if (item.dropdownType === 'know') setShowKnowJewellery(false);
                    if (item.dropdownType === 'customer') setShowCustomerServices(false);
                    if (item.dropdownType === 'categories') setShowCategories(false);
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

                  {item.dropdownType === 'categories' && (
                    <CategoriesDropdown isVisible={showCategories} categories={categories} />
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
                  src="/src/assets/tamiri-logo.png" 
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
                    padding: '8px 16px 8px 45px', // Decreased padding for height
                    borderRadius: '9999px',
                    border: '1px solid #e5e7eb', // Slightly more visible border for white background
                    outline: 'none',
                    fontSize: 13, // Slightly smaller font
                    fontFamily: SF,
                    backgroundColor: '#f9fafb', // Light grey background for input
                    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
                    boxSizing: 'border-box',
                  }}
                />
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