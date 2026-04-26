import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroBanner from "../components/HeroBanner";
import ErrorBoundary from "../components/ErrorBoundary";
import { apiService, type Category, type Product, type BannerVideo } from "../services/api";
import { authService } from "../services/auth";
import { useCurrency } from "../context/CurrencyContext";
import {
  WISHLIST_UPDATE_EVENT,
  getWishlistProductMap,
  toggleWishlistWithUpdate,
} from "../utils/cartUtils";

import bangle from "../assets/product-image.png";
import trending1 from "../assets/trending1.png";
import trending2 from "../assets/trending2.png";
import formen from "../assets/formen.png";
import forwomen from "../assets/forwomen.png";
import reviewImg from "../assets/review.png";
import testimonialBg from "../assets/testimonial-background.jpg";
import underlineImg from "../assets/underline.png";
import genderBg from "../assets/gender-background.png";
import React from "react";

const SF = "-apple-system,'SF Pro Display','SF Pro Text',BlinkMacSystemFont,sans-serif";

/* ── tiny hook for breakpoint ── */
function useWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

/* ── Icons ── */
const HeartIcon = ({ filled = false, dark = false }: { filled?: boolean; dark?: boolean }) => {
  const stroke = filled ? "#ef4444" : (dark ? "#fff" : "#555");
  const fill = filled ? "#ef4444" : "none";
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
};
const ChevL = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
);
const ChevR = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
);
const PlayBtn = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
);

const ArrR = ({ col = "#1a1a1a" }: { col?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);
const ArrL = ({ col = "#1a1a1a" }: { col?: string }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={col} strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
);

/* ════════════════════════════════════════
   SECTION HEADING
════════════════════════════════════════ */
function Heading({ title, ornament = false, light = false }: { title: string; ornament?: boolean; light?: boolean }) {
  return (
    <div style={{ textAlign: "center", marginBottom: ornament ? 24 : 20, position: "relative" }}>
      <h2 style={{
        fontFamily: "'Song Myung', serif", fontSize: "clamp(22px,3vw,32px)", fontWeight: 400,
        color: light ? "#fff" : "#1a1a1a", margin: 0, letterSpacing: 0.8,
        textTransform: "capitalize",
      }}>{title}</h2>
      {ornament && (
        <div style={{
          display: "flex", justifyContent: "center", marginTop: 4,
          height: 16, width: "100%",
          backgroundImage: `url(${underlineImg})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }} />
      )}
    </div>
  );
}

/* ════════════════════════════════════════
   2. SHOP BY CATEGORY
════════════════════════════════════════ */
function ShopByCategory({ w }: { w: number }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await apiService.getCategories();
        setCategories(data);
      } catch (err) {
        setError('Failed to load categories');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    navigate(`/products?category=${categoryId}`);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const isTablet = w >= 768 && w < 1200;
  const isDesktop = w >= 1200;
  const isMobile = w < 768;
  
  const columns = isDesktop ? 5 : isTablet ? 3 : 2;
  const gap = isDesktop ? 24 : isTablet ? 18 : 12;
  const sectionPadX = isDesktop ? 48 : isTablet ? 32 : 16;

  if (loading) {
    return (
      <section style={{ background: "#fff", padding: `${isDesktop ? 50 : isTablet ? 40 : 36}px 0 ${isDesktop ? 40 : isTablet ? 32 : 28}px` }}>
        <Heading title="Shop by Category" ornament />
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
          Loading categories...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ background: "#fff", padding: `${isDesktop ? 50 : isTablet ? 40 : 36}px 0 ${isDesktop ? 40 : isTablet ? 32 : 28}px` }}>
        <Heading title="Shop by Category" ornament />
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#e74c3c' }}>
          {error}
        </div>
      </section>
    );
  }

  return (
    <section style={{
      background: "#fff",
      padding: `${isDesktop ? 50 : isTablet ? 40 : 36}px 0`,
      width: "100%",
    }}>
      <Heading title="Shop by Category" ornament />
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: 1400,
        margin: "0 auto",
        paddingLeft: sectionPadX,
        paddingRight: sectionPadX,
      }}>
        {!isMobile && categories.length > columns && (
          <NavBtn side="left" onClick={() => handleScroll('left')}><ChevL /></NavBtn>
        )}

        <div
          ref={scrollRef}
          style={{
            display: isMobile ? "grid" : "flex",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : undefined,
            flexDirection: isMobile ? undefined : "row",
            overflowX: isMobile ? "visible" : "auto",
            scrollbarWidth: "none",
            gap: gap,
            padding: isMobile ? `4px 0 24px` : `4px 0 10px`,
            WebkitOverflowScrolling: "touch",
          }}
          className="hide-scrollbar"
        >
          {categories.map(c => (
            <div 
              key={c.id} 
              style={{ 
                width: isMobile ? "100%" : isTablet ? "220px" : "260px",
                flexShrink: isMobile ? 1 : 0,
                textAlign: "center", 
                cursor: "pointer",
                padding: "2px"
              }}
              onClick={() => handleCategoryClick(c.id)}
            >
              <div style={{
                width: "100%", 
                aspectRatio: "1/1.1",
                borderRadius: 20,
                backgroundImage: `url(${c.category_image || bangle})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                transition: "transform 0.22s, box-shadow 0.22s",
                border: "1px solid #f0f0f0",
                backgroundColor: "#f9f9f9"
              }}
                onMouseEnter={e => { if(!isMobile) { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)"; } }}
                onMouseLeave={e => { if(!isMobile) { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)"; } }}
              />
              <p style={{ 
                fontFamily: SF, 
                fontSize: isDesktop ? 15 : 13, 
                fontWeight: 600, 
                color: "#333", 
                marginTop: 10, 
                textTransform: "capitalize",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                {c.category_name}
              </p>
            </div>
          ))}
        </div>
        {!isMobile && categories.length > columns && (
          <NavBtn side="right" onClick={() => handleScroll('right')}><ChevR /></NavBtn>
        )}
      </div>
    </section>
  );
}

function NavBtn({ side, children, onClick }: { side: 'left' | 'right'; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      style={{
        position: "absolute", [side]: 12, top: "44%", transform: "translateY(-50%)",
        width: 32, height: 32, borderRadius: "50%", background: "#fff",
        border: "1.5px solid #e0e0e0", display: "flex", alignItems: "center",
        justifyContent: "center", cursor: "pointer", zIndex: 2,
        boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
      }}
    >{children}</button>
  );
}

/* ════════════════════════════════════════
   3. TRENDING STYLES
════════════════════════════════════════ */
function TrendingStyles({ w }: { w: number }) {
  const navigate = useNavigate();
  const { format } = useCurrency(); // INR → active currency
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const refreshWishlist = async () => {
      const map = await getWishlistProductMap();
      setWishlistIds(new Set(map.keys()));
    };
    refreshWishlist();
    window.addEventListener(WISHLIST_UPDATE_EVENT, refreshWishlist);
    return () => window.removeEventListener(WISHLIST_UPDATE_EVENT, refreshWishlist);
  }, []);

  const handleWishlistToggle = async (productId: number) => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    setTogglingId(productId);
    setWishlistIds(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
    const res = await toggleWishlistWithUpdate(productId);
    if (!res.success) {
      const map = await getWishlistProductMap();
      setWishlistIds(new Set(map.keys()));
    }
    setTogglingId(null);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const currentUser = authService.getCurrentUser();
        const data = await apiService.getTopProducts(10, currentUser?.id);
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const isTablet = w >= 768 && w < 1200;
  const isDesktop = w >= 1200;
  const isMobile = w < 768;
  const cardsVisible = isDesktop ? 4 : isTablet ? 3 : 2;
  const cardWidth = isDesktop ? 280 : isTablet ? 240 : 200;
  const gap = isDesktop ? 24 : isTablet ? 20 : 12;

  if (loading) {
    return (
      <section style={{ background: "linear-gradient(180deg,#faf5e8,#f5edd8)", padding: `${isDesktop ? 60 : isTablet ? 50 : 40}px ${isDesktop ? 48 : isTablet ? 32 : 12}px` }}>
        <Heading title="Trending Styles" ornament />
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
          Loading products...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section style={{ background: "linear-gradient(180deg,#faf5e8,#f5edd8)", padding: `${isDesktop ? 60 : isTablet ? 50 : 40}px ${isDesktop ? 48 : isTablet ? 32 : 12}px` }}>
        <Heading title="Trending Styles" ornament />
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#e74c3c' }}>
          {error}
        </div>
      </section>
    );
  }

  return (
    <section style={{ background: "linear-gradient(180deg,#faf5e8,#f5edd8)", padding: `${isDesktop ? 60 : isTablet ? 50 : 40}px 0` }}>
      <Heading title="Trending Styles" ornament />
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 1400,
          margin: "0 auto",
          paddingLeft: isDesktop ? 48 : isTablet ? 32 : 16,
          paddingRight: isDesktop ? 48 : isTablet ? 32 : 16,
        }}
      >
        {products.length > cardsVisible && (
          <button
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
            style={{
              position: "absolute",
              left: isDesktop ? 4 : isTablet ? 4 : 6,
              top: "50%",
              transform: "translateY(-50%)",
              width: isMobile ? 36 : 40,
              height: isMobile ? 36 : 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.95)",
              border: "1.5px solid #e5d9b8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
            }}
          >
            <ChevL />
          </button>
        )}

        <div
          ref={scrollRef}
          style={{
            display: "flex",
            flexDirection: "row",
            overflowX: "auto",
            scrollbarWidth: "none",
            gap: gap,
            padding: "4px 0 10px",
            WebkitOverflowScrolling: "touch",
            scrollSnapType: "x mandatory",
          }}
          className="hide-scrollbar"
        >
        {products.map((p) => (
          <div key={p.id} style={{
            width: cardWidth,
            flexShrink: 0,
            scrollSnapAlign: 'start',
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 18px rgba(0,0,0,0.07)",
            overflow: "hidden",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.13)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 18px rgba(0,0,0,0.07)"; }}
          >
            {/* Image area — padded inner tile with all-round corners */}
            <div style={{
              position: "relative",
              padding: isDesktop ? 12 : isTablet ? 10 : 8,
            }}>
              <div style={{
                width: "100%",
                height: isDesktop ? 200 : isTablet ? 220 : 170,
                backgroundImage: `url(${p.product_image || trending1})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundColor: "#f5eedd",
                backgroundBlendMode: "multiply",
                borderRadius: 14,
                border: "1px solid rgba(228,172,20,0.12)",
              }} />

              {/* Wishlist heart — top right, inside the inner tile */}
              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleWishlistToggle(p.id); }}
                disabled={togglingId === p.id}
                aria-label={wishlistIds.has(p.id) ? "Remove from wishlist" : "Add to wishlist"}
                style={{
                  position: "absolute",
                  top: isDesktop ? 22 : isTablet ? 20 : 16,
                  right: isDesktop ? 22 : isTablet ? 20 : 16,
                  width: isMobile ? 30 : 34,
                  height: isMobile ? 30 : 34,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.35)",
                  border: "none",
                  backdropFilter: "blur(6px)",
                  WebkitBackdropFilter: "blur(6px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: togglingId === p.id ? "wait" : "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                }}>
                <HeartIcon filled={wishlistIds.has(p.id)} dark />
              </button>
            </div>

            {/* Info area */}
            <div style={{
              padding: isDesktop ? "16px 16px 20px" : isTablet ? "14px 14px 18px" : "10px 10px 14px",
              position: "relative",
            }}>
              {/* Product name */}
              <p style={{
                fontFamily: SF,
                fontSize: isDesktop ? 16 : isTablet ? 14 : 12,
                fontWeight: 700,
                color: "#1a1a1a",
                margin: "0 0 6px",
                lineHeight: 1.3,
                paddingRight: isMobile ? 36 : 44, // space for + button
                textTransform: "capitalize",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                height: isMobile ? "2.6em" : "auto",
              }}>{p.product_name}</p>

              {/* Price row — MRP (actual_price) only shows when it's genuinely higher
                  than the selling price. Otherwise we just show one clean price, since
                  rendering identical bold + strikethrough numbers looks like a fake discount. */}
              <div style={{display:"flex", flexDirection:"row", gap:"10px"}}>
              {/* Prices are stored in INR; format() converts to active currency (INR/USD) */}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                <span style={{
                  fontFamily: SF,
                  fontSize: isDesktop ? 15 : isTablet ? 14 : 13,
                  fontWeight: 700,
                  color: "#1a1a1a",
                }}>{format(p.total_price || p.price || 0, { inputIncludesGst: true })}</span>
              </div>
              {Number(p.actual_price || 0) > Number(p.total_price || p.price || 0) && (
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                  <span style={{
                    fontFamily: SF,
                    textDecoration: "line-through",
                    fontSize: isDesktop ? 13 : isTablet ? 14 : 13,
                    fontWeight: 500,
                    color: "#666666",
                  }}>{format(Number(p.actual_price), { inputIncludesGst: true })}</span>
                </div>
              )}
              </div>
              
               <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                <span style={{
                  fontFamily: SF,
                  fontSize: isDesktop ? 12 : isTablet ? 14 : 13,
                  fontWeight: 500,
                  color: "#666666",
                }}>20% off on making charges</span>
              </div>

              {/* ✅ Round gold + button — bottom right */}
              <button style={{
                position: "absolute",
                bottom: isMobile ? 10 : 16,
                right: isMobile ? 10 : 16,
                width: isMobile ? 36 : 44,
                height: isMobile ? 36 : 44,
                borderRadius: "50%",           // fully round
                background: "#E4AC14",          // solid gold
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 3px 10px rgba(228,172,20,0.40)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "scale(1.1)";
                  e.currentTarget.style.boxShadow = "0 5px 16px rgba(228,172,20,0.55)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 3px 10px rgba(228,172,20,0.40)";
                }}
              >
                {/* White + icon */}
                <svg width={isMobile ? 16 : 20} height={isMobile ? 16 : 20} viewBox="0 0 24 24" fill="none"
                  stroke="#fff" strokeWidth="2.8" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
        </div>

        {products.length > cardsVisible && (
          <button
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
            style={{
              position: "absolute",
              right: isDesktop ? 4 : isTablet ? 4 : 6,
              top: "50%",
              transform: "translateY(-50%)",
              width: isMobile ? 36 : 40,
              height: isMobile ? 36 : 40,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.95)",
              border: "1.5px solid #e5d9b8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
              boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
            }}
          >
            <ChevR />
          </button>
        )}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   4. CRAFTED FOR HER / HIM
════════════════════════════════════════ */
function CraftedSection({ w }: { w: number }) {
  const isTablet = w >= 768 && w < 1200;
  const isDesktop = w >= 1200;
  const isMobile = w < 768;
  const navigate = useNavigate();
  const goToGender = (gender: "Men" | "Women") =>
    navigate(`/products?gender=${gender}`);

  return (
    <section
      style={{
        position: "relative",
        minHeight: isDesktop ? 750 : isTablet ? 600 : 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: isMobile ? "40px 0" : 0,
      }}
    >
      {/* Background Image */}
      <img
        src={genderBg}
        alt="background"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: isMobile ? "cover" : "contain",
          zIndex: 0,
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 1200,
          height: isDesktop ? 650 : isTablet ? 550 : "auto",
          position: "relative",
          zIndex: 1,
          display: isMobile ? "flex" : "block",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "center" : "stretch",
          gap: isMobile ? 40 : 0,
          padding: isMobile ? "0 20px" : 0,
        }}
      >
        {/* ================= HIM ================= */}
        <div
          onClick={() => goToGender("Men")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") goToGender("Men");
          }}
          style={{
            position: isMobile ? "relative" : "absolute",
            left: isMobile ? "auto" : "3%",
            top: isMobile ? "auto" : "-20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: isMobile ? "100%" : "auto",
            cursor: "pointer",
          }}
        >
          {/* ✅ Image with NO styling */}
          <img 
            src={formen} 
            alt="for men" 
            style={{ 
              maxWidth: isMobile ? "80%" : "100%", 
              height: "auto" 
            }} 
          />

          {/* Label */}
          <div
            style={{
              marginTop: isMobile ? 16 : 30,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: isMobile ? 28 : 32,
                height: isMobile ? 28 : 32,
                borderRadius: "50%",
                background: "#f0f2f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrL col="#333" />
            </div>

            <span
              style={{
                fontWeight: 700,
                color: "#000",
                fontSize: isMobile ? 14 : 17,
              }}
            >
              Crafted for Him
            </span>
          </div>
        </div>

        {/* ================= HER ================= */}
        <div
          onClick={() => goToGender("Women")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") goToGender("Women");
          }}
          style={{
            position: isMobile ? "relative" : "absolute",
            right: isMobile ? "auto" : "3%",
            bottom: isMobile ? "auto" : "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: isMobile ? "100%" : "auto",
            cursor: "pointer",
          }}
        >
          {/* Label */}
          <div
            style={{
              marginBottom: isMobile ? 16 : 30,
              display: "flex",
              alignItems: "center",
              gap: 12,
              zIndex: 2,
            }}
          >
            <span
              style={{
                fontWeight: 700,
                color: "#000",
                fontSize: isMobile ? 14 : 17,
              }}
            >
              Crafted for Her
            </span>

            <div
              style={{
                width: isMobile ? 28 : 32,
                height: isMobile ? 28 : 32,
                borderRadius: "50%",
                background: "#f0f2f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ArrR col="#333" />
            </div>
          </div>

          {/* ✅ Image with NO styling */}
          <img 
            src={forwomen} 
            alt="for women" 
            style={{ 
              maxWidth: isMobile ? "80%" : "100%", 
              height: "auto" 
            }} 
          />
        </div>
      </div>
    </section>
  );
}
/* ════════════════════════════════════════
   5. MEDIA PRESENCE
════════════════════════════════════════ */
function MediaPresence({ w }: { w: number }) {
  const [videos, setVideos] = useState<BannerVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch titles from YouTube oEmbed for any video that didn't come with one
  useEffect(() => {
    const missing = videos.filter(v => !v.video_title && v.video_url);
    if (missing.length === 0) return;

    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        missing.map(async v => {
          try {
            const res = await fetch(
              `https://www.youtube.com/oembed?url=${encodeURIComponent(v.video_url)}&format=json`
            );
            if (!res.ok) return [v.id, null] as const;
            const json = await res.json();
            return [v.id, json.title as string] as const;
          } catch {
            return [v.id, null] as const;
          }
        })
      );
      if (cancelled) return;
      setVideos(prev =>
        prev.map(v => {
          const match = entries.find(([id]) => id === v.id);
          if (match && match[1]) return { ...v, video_title: match[1] };
          return v;
        })
      );
    })();
    return () => { cancelled = true; };
  }, [videos]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const data = await apiService.getBannerVideos();
        setVideos(data);
      } catch (err) {
        setError('Failed to load videos');
        console.error('Error fetching videos:', err);
        // Fallback to static data if API fails
        setVideos([
          {
            id: 1,
            video_url: "https://www.youtube.com/watch?v=y7HeCZiCPOQ",
            video_title: "TAMIRI JEWELLERY PRIVATE LIMITED TAMIRI SRIKANTH RECEIVED Raj News...",
          },
          {
            id: 2, 
            video_url: "https://www.youtube.com/watch?v=y7HeCZiCPOQ",
            video_title: "జ్యువెలరీ వ్యాపారం అంత సులువు కాదు - Tamiri Jewellery MD Tamiri Srikanth",
          },
          {
            id: 3,
            video_url: "https://www.youtube.com/watch?v=y7HeCZiCPOQ", 
            video_title: "నాణ్యత, నమ్మకమే మా బిజినెస్ సీక్రెట్స్ | Tamiri Jewellery MD Tamiri Srikanth Fac...",
          },
          {
            id: 4,
            video_url: "https://www.youtube.com/watch?v=y7HeCZiCPOQ",
            video_title: "Amazing diamond ring! The brilliance of the stone catches the light beautifully...",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const isTablet = w >= 768 && w < 1200;
  const isDesktop = w >= 1200;

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    if (!url) return 'y7HeCZiCPOQ'; // fallback ID if url is missing
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : 'y7HeCZiCPOQ'; // fallback ID
  };

  if (loading) {
    return (
      <section id="media" style={{ background: "#fff", padding: `${isDesktop ? 60 : isTablet ? 50 : 40}px 0` }}>
        <Heading title="Our Media Presence" ornament />
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>
          Loading media content...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="media" style={{ background: "#fff", padding: `${isDesktop ? 60 : isTablet ? 50 : 40}px 0` }}>
        <Heading title="Our Media Presence" ornament />
        <div style={{ textAlign: 'center', padding: '20px 0', color: '#e74c3c' }}>
          {error}
        </div>
      </section>
    );
  }

  return (
    <section id="media" style={{ background: "#fff", padding: `${isDesktop ? 60 : isTablet ? 50 : 40}px 0` }}>
      <Heading title="Our Media Presence" ornament />
      <div style={{
        display: "grid",
        gridTemplateColumns: isDesktop ? "repeat(4, 1fr)" : isTablet ? "repeat(2, 1fr)" : "1fr",
        gap: isDesktop ? 24 : isTablet ? 20 : 20,
        padding: `24px ${isDesktop ? 48 : isTablet ? 32 : 16}px`,
        maxWidth: 1400,
        margin: "0 auto",
      }}>
        {videos.slice(0, isDesktop ? 4 : isTablet ? 4 : 3).map((m) => {
          const videoId = getYouTubeVideoId(m.video_url);
          return (
            <a 
              key={m.id} 
              href={m.video_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                width: "100%",
                textDecoration: 'none',
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{
                position: "relative",
                borderRadius: 12, 
                overflow: "hidden",
                boxShadow: "0 4px 18px rgba(0,0,0,0.1)", 
                cursor: "pointer",
                marginBottom: 12,
              }}>
                <img 
                  src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
                  alt={m.video_title || 'Video thumbnail'}
                  style={{ 
                    width: '100%', 
                    display: 'block',
                    aspectRatio: '16/9',
                    objectFit: 'cover',
                  }} 
                />
                <div style={{
                  position: "absolute", 
                  inset: 0,
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  backgroundColor: 'rgba(0,0,0,0.2)',
                }}>
                  <div style={{
                    width: isDesktop ? 52 : 48, 
                    height: isDesktop ? 52 : 48, 
                    borderRadius: "50%",
                    background: "rgba(128, 128, 128, 0.6)", // Changed from white to grey
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                  }}>
                    <PlayBtn />
                  </div>
                </div>
              </div>

              {m.video_title && (
                <p
                  style={{
                    fontFamily: SF,
                    fontSize: isDesktop ? 14 : 13,
                    fontWeight: 600,
                    color: "#1a1a1a",
                    margin: "4px 4px 0",
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {m.video_title}
                </p>
              )}
            </a>
          );
        })}
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   6. TESTIMONIALS
════════════════════════════════════════ */
const REVIEWS = [
  {
    text: "Amazing diamond ring! The brilliance of the stone catches the light beautifully, making it truly eye-catching. The craftsmanship is detail carefully designed and perfectly finished. It's a stunning piece that reflects...",
    img: trending1,
  },
  {
    text: "Amazing diamond ring! The brilliance of the stone catches the light beautifully, making it truly eye-catching. The craftsmanship is detail carefully designed and perfectly finished. It's a stunning piece...",
    img: trending2,
  },
  {
    text: "Amazing diamond ring! The brilliance of the stone catches the light beautifully, making it truly eye-catching. The craftsmanship is detail carefully designed and perfectly finished. It's a stunning piece...",
    img: trending1,
  },
  {
    text: "Amazing diamond ring! The brilliance of the stone catches the light beautifully, making it truly eye-catching. The craftsmanship is both elegance and timeless beauty.",
    img: trending2,
  },
];

function TestimonialCard({ review, w }: { review: { text: string, img: string }, w: number }) {
  const isMobile = w < 768;
  const isTablet = w >= 768 && w < 1200;
  const isDesktop = w >= 1200;

  return (
    <div
      style={{
        flexShrink: 0,
        width: isMobile ? 280 : 320,
        background: "rgba(255, 253, 249, 0.9)",
        borderRadius: 16,
        padding: isDesktop ? "24px" : isTablet ? "22px" : "20px",
        border: "1px solid rgba(201,168,76,0.25)",
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        backdropFilter: "blur(4px)",
        transition: "all 0.2s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: isDesktop ? 40 : 36,
            height: isDesktop ? 40 : 36,
            borderRadius: "50%",
            backgroundImage: `url(${reviewImg})`,
            backgroundSize: "cover",
          }}
        />
        <div>
          <p
            style={{
              fontFamily: SF,
              fontSize: isDesktop ? 15 : 14,
              fontWeight: 600,
              margin: 0,
              color: "#333",
            }}
          >
            K. Rajesh
          </p>
          <p
            style={{
              fontSize: isDesktop ? 12 : 11,
              color: "#888",
              margin: "3px 0 0",
            }}
          >
            11/09/2025
          </p>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          display: "flex",
          gap: 14,
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 10,
            backgroundImage: `url(${review.img})`,
            backgroundSize: "cover",
            flexShrink: 0,
            border: "1px solid #eee",
          }}
        />
        <p
          style={{
            fontFamily: SF,
            fontSize: isDesktop ? 13.5 : 13,
            color: "#555",
            lineHeight: 1.55,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 5,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {review.text}
        </p>
      </div>
    </div>
  );
}

function Testimonials({ w }: { w: number }) {
  const isMobile = w < 768;
  const isTablet = w >= 768 && w < 1200;
  const isDesktop = w >= 1200;
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = isMobile ? 292 : 340;
      scrollContainerRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <section
      style={{
        backgroundImage: `url(${testimonialBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: isDesktop
          ? "64px 0"
          : isTablet
          ? "56px 0"
          : "44px 0",
        position: "relative",
      }}
    >
      {/* overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(255, 255, 255, 0.75)",
        }}
      />

      <div style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 1400,
        margin: "0 auto",
        paddingLeft: isDesktop ? 48 : isTablet ? 32 : 16,
        paddingRight: isDesktop ? 48 : isTablet ? 32 : 16,
      }}>
        <Heading title="Testimonials" ornament />

        <div style={{ position: 'relative' }}>
          <div
            ref={scrollContainerRef}
            style={{
              display: "flex",
              gap: isDesktop ? 24 : isTablet ? 20 : 16,
              overflowX: "auto",
              scrollbarWidth: "none",
              padding: "24px 0",
              marginTop: 24,
            }}
          >
            {REVIEWS.map((review, i) => (
              <TestimonialCard key={i} review={review} w={w} />
            ))}
          </div>

          {/* Navigation Arrows — vertically centered on cards, horizontally outside them */}
          <button
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
            style={{
              position: 'absolute',
              left: isDesktop ? -42 : isTablet ? -26 : -10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.95)',
              border: '1px solid #ddd',
              borderRadius: '50%',
              width: 36,
              height: 36,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              zIndex: 2,
            }}
          >
            <ChevL />
          </button>
          <button
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
            style={{
              position: 'absolute',
              right: isDesktop ? -42 : isTablet ? -26 : -10,
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.95)',
              border: '1px solid #ddd',
              borderRadius: '50%',
              width: 36,
              height: 36,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              zIndex: 2,
            }}
          >
            <ChevR />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════
   ROOT
════════════════════════════════════════ */
export default function TamiriHomePage() {
  const w = useWidth();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Song+Myung&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        button { outline: none; }
        body { margin: 0; padding: 0; }
      `}</style>
      <div style={{
        width: "100%", background: "#fff",
        minHeight: "100vh", fontFamily: SF, overflowX: "hidden",
      }}>

        <HeroBanner w={w} />
        <ErrorBoundary>
          <ShopByCategory w={w} />
        </ErrorBoundary>
        <ErrorBoundary>
          <TrendingStyles w={w} />
        </ErrorBoundary>
        <ErrorBoundary>
          <CraftedSection w={w} />
        </ErrorBoundary>
        <ErrorBoundary>
          <MediaPresence w={w} />
        </ErrorBoundary>
        <ErrorBoundary>
          <Testimonials w={w} />
        </ErrorBoundary>
      </div>
    </>
  );
}
