import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { apiService, type ProductDetail as ProductDetailType, type Product } from "../services/api";
import productImg from "../assets/product.png";
import { Link } from "react-router-dom";

const SF = "-apple-system,'SF Pro Display','SF Pro Text',BlinkMacSystemFont,sans-serif";
const GOLD = "#e6a817";
const GOLD_L = "#fef9ec";

/* ── Tiny SVG icons ── */
const ChevLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
);
const ChevRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
);
const ChevDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
);
const TruckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const ExchangeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const ReturnIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
  </svg>
);
const ShippingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);
const CertIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const SavingsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);
const ShippingQIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

/* ── Swatches ── */
const COLOR_MAP: Record<string, string> = {
  yellow: "#F8E582",
  pink: "#F8C6C6",
  white: "#DDDDDD",
  rose: "#F8C6C6", // Mapping rose to pink as well
};

/* ── Similar products ── */
const SIMILAR = Array(4).fill(null).map((_, i) => ({
  id: i + 1,
  name: "2 Carat Oval Shape Diamond Ring With Halo Setting",
  price: "₹89,999",
  mrp: "₹99,999",
  bg: ["linear-gradient(135deg,#faf5ee,#f0e8d8)", "linear-gradient(135deg,#fdf8ee,#f5edd6)", "linear-gradient(135deg,#f8f4ee,#ede8de)", "linear-gradient(135deg,#faf8ee,#f2ecd6)"][i],
  image: productImg,
}));

/* ── Thumbnail images ── */
const THUMBS = [productImg, productImg, productImg, productImg];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState("White Gold");
  const [purity, setPurity] = useState("18KT");
  const [size, setSize] = useState("14 (54.40 mm)");
  const [tab, setTab] = useState("description");
  const [reviews, setReviews] = useState<any[]>([]);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const [showZoom, setShowZoom] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Get product images or fallback to default thumbnails
  const productImages = product?.product_images?.length ? product.product_images : THUMBS;

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchProductDetail = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const productId = parseInt(id, 10);
        if (isNaN(productId)) {
          setError('Invalid product ID');
          return;
        }
        
        const [productData, recommendedData, reviewsData] = await Promise.all([
          apiService.getProductDetails(productId),
          apiService.getRecommendedProducts(4),
          apiService.getProductReviews(productId)
        ]);
        
        setProduct(productData);
        setRelatedProducts(recommendedData);
        setReviews(reviewsData);
        
        // Set initial color based on product material color
        if (productData.material_color) {
          const mColor = productData.material_color.toLowerCase();
          if (mColor.includes("yellow")) setColor("Yellow Gold");
          else if (mColor.includes("pink") || mColor.includes("rose")) setColor("Pink Gold");
          else if (mColor.includes("white")) setColor("White Gold");
        }
      } catch (err) {
        setError('Failed to load product details');
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    const lensSize = 180; // Size of the lens square
    
    let x = e.clientX - left;
    let y = e.clientY - top;

    // Ensure lens stays within image container
    x = Math.max(lensSize / 2, Math.min(width - lensSize / 2, x));
    y = Math.max(lensSize / 2, Math.min(height - lensSize / 2, y));

    setLensPos({ x: x - lensSize / 2, y: y - lensSize / 2 });
    
    // Calculate background position percentage for zoomed image
    // (x / width) * 100%
    const bx = ((x - lensSize / 2) / (width - lensSize)) * 100;
    const by = ((y - lensSize / 2) / (height - lensSize)) * 100;
    setBgPos({ x: bx, y: by });
  };

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f9f9f7", fontFamily: SF, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          Loading product details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: "100vh", background: "#f9f9f7", fontFamily: SF, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#e74c3c' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; }
        button:focus { outline: none; }
        select:focus { outline: none; }
        
        @media (max-width: 768px) {
          .product-detail-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .similar-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .promise-grid {
            grid-template-columns: 1fr !important;
          }
        }
        
        @media (max-width: 480px) {
          .similar-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#f9f9f7", fontFamily: SF }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "20px 16px 40px" : "28px 24px 60px" }}>

          {/* ── Breadcrumb ── */}
          <nav style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>
              <Link to="/" style={{ textDecoration: 'none', color: '#6b7280' }}>Home</Link> &nbsp;›&nbsp;
              {product?.category_name && (
                <>
                  <Link to={`/products?category=${product.category_id}`} style={{ textDecoration: 'none', color: '#6b7280' }}>
                    {product.category_name}
                  </Link> &nbsp;›&nbsp;
                </>
              )}
              <span style={{ color: "#111827", fontWeight: 500 }}>{product?.product_name}</span>
            </span>
          </nav>

          {/* ── Main two-column layout ── */}
          <div className="product-detail-grid" style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isTablet ? 32 : 48, alignItems: "flex-start" }}>

            {/* LEFT: Images */}
            <div>
              {/* Main image */}
              <div 
                ref={containerRef}
                onMouseEnter={() => !isMobile && setShowZoom(true)}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setShowZoom(false)}
                style={{
                  position: "relative", background: "#f0f0f0",
                  borderRadius: 16, overflow: "visible", // Allow zoom box to overflow
                  aspectRatio: "1/1", marginBottom: 16,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: !isMobile ? "crosshair" : "default",
                }}
              >
                {/* Wrapper to clip lens but allow zoom box overflow */}
                <div style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  overflow: 'hidden', 
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Nav arrows */}
                  <button onClick={(e) => { e.stopPropagation(); setActiveImg(i => (i - 1 + productImages.length) % productImages.length); }} style={{
                    position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                    width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)",
                    border: "1px solid #e5e7eb", display: "flex", alignItems: "center",
                    justifyContent: "center", cursor: "pointer", zIndex: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}>
                    <ChevLeft />
                  </button>
                  <img src={productImages[activeImg]} alt="Product" style={{ width: "100%", height: "100%", objectFit: "cover", userSelect: "none" }} />
                  <button onClick={(e) => { e.stopPropagation(); setActiveImg(i => (i + 1) % productImages.length); }} style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)",
                    border: "1px solid #e5e7eb", display: "flex", alignItems: "center",
                    justifyContent: "center", cursor: "pointer", zIndex: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}>
                    <ChevRight />
                  </button>

                  {/* Lens */}
                  {showZoom && !isMobile && (
                    <div style={{
                      position: "absolute",
                      left: lensPos.x,
                      top: lensPos.y,
                      width: 180,
                      height: 180,
                      border: "1px solid #7c2d12",
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                      pointerEvents: "none",
                      zIndex: 1,
                    }} />
                  )}
                </div>

                {/* Zoom Box (Overlay next to image) */}
                {showZoom && !isMobile && (
                  <div style={{
                    position: "absolute",
                    left: "calc(100% + 24px)",
                    top: 0,
                    width: "100%",
                    height: "100%",
                    background: "#fff",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                    borderRadius: 16,
                    zIndex: 100,
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                    pointerEvents: "none",
                  }}>
                    <div style={{
                      width: "100%",
                      height: "100%",
                      backgroundImage: `url(${productImages[activeImg]})`,
                      backgroundPosition: `${bgPos.x}% ${bgPos.y}%`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "250%",
                    }} />
                    <div style={{
                      position: "absolute",
                      bottom: 12,
                      left: 12,
                      background: "rgba(124, 45, 18, 0.9)",
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 700,
                      padding: "5px 10px",
                      borderRadius: 4,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}>
                      HIGH PRECISION INSPECTION
                    </div>
                  </div>
                )}
              </div>

              {/* Thumbnails row */}
              <div style={{ display: "flex", gap: 10, alignItems: "center", overflowX: 'auto', paddingBottom: 4 }}>
                {productImages.map((t, i) => (
                  <div key={i} onClick={() => setActiveImg(i)} style={{
                    flex: isMobile ? '0 0 70px' : 1, aspectRatio: "1/1",
                    borderRadius: 10, background: "#f0f0f0",
                    border: `2px solid ${activeImg === i ? GOLD : "#e5e7eb"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                    overflow: "hidden",
                  }}>
                    <img src={t} alt={`Thumbnail ${i}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div style={{ marginTop: 28 }}>
                <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", marginBottom: 20, overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none' }}>
                  {["description", "product detail", "reviews"].map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{
                      padding: "10px 0", marginRight: 28,
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: 13, fontWeight: 700, textTransform: "uppercase",
                      letterSpacing: 0.5,
                      color: tab === t ? "#111827" : "#9ca3af",
                      borderBottom: tab === t ? `2.5px solid #111827` : "2.5px solid transparent",
                      transition: "color 0.15s",
                    }}>
                      {t === "reviews" ? `Reviews (${reviews.length})` : t}
                    </button>
                  ))}
                </div>
                {tab === "description" ? (
                  <div style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.75 }}>
                    <p style={{ margin: "0 0 14px" }}>
                      {product?.description || "No description available for this product."}
                    </p>
                  </div>
                ) : tab === "product detail" ? (
                  <div style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.75 }}>
                    {product?.sku_id && <p><strong>SKU:</strong> {product.sku_id}</p>}
                    <p><strong>Metal:</strong> {product?.product_specifications?.metal || "N/A"}</p>
                    <p><strong>Size:</strong> {product?.product_specifications?.size || "N/A"}</p>
                    <p><strong>Diamond:</strong> {product?.product_specifications?.diamond || "N/A"}</p>
                    <p><strong>GWT:</strong> {product?.product_specifications?.weight || "N/A"}</p>
                  </div>
                ) : (
                  <div style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.75 }}>
                    {reviews.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {reviews.map((r, i) => (
                          <div key={i} style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: 15 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                              <span style={{ fontWeight: 700, color: '#111827' }}>{r.user_name}</span>
                              <span style={{ fontSize: 12, color: '#9ca3af' }}>{r.created_at}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                              {[...Array(5)].map((_, idx) => (
                                <svg key={idx} width="14" height="14" viewBox="0 0 24 24" fill={idx < r.rating ? GOLD : "#e5e7eb"}>
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                              ))}
                            </div>
                            <p style={{ margin: 0, fontSize: 13 }}>{r.review}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '20px 0', color: '#9ca3af' }}>
                        No reviews yet for this product.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Product info */}
            <div>
              {/* SKU */}
              {(product?.sku_id || product?.id) && (
                <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 8px" }}>
                  SKU: {product?.sku_id || `PJ-${product?.id}`}
                </p>
              )}

              {/* Title */}
              <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: "#111827", margin: "0 0 16px", lineHeight: 1.4 }}>
                {product?.product_name || "Product"}
              </h1>

              {/* Price */}
              <p style={{ fontSize: isMobile ? 26 : 32, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
                ₹ {product?.price ? product.price.toLocaleString('en-IN') : 'Price not available'}
              </p>
              <p style={{ fontSize: 13, color: GOLD, fontWeight: 600, margin: "0 0 22px", textDecoration: "underline", cursor: "pointer" }}>SEE PRICE BREAKUP</p>

              {/* Color */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: "0 0 10px" }}>
                  Color: &nbsp;<span style={{ fontWeight: 400 }}>{color}</span>
                </p>
                <div style={{ display: "flex", gap: 18, paddingLeft: 6 }}>
                  {Object.entries(COLOR_MAP).filter(([key]) => {
                    if (!product?.material_color) return key === "white"; // default if missing
                    const mColor = product.material_color.toLowerCase();
                    if (key === "rose") return false; // don't show rose twice
                    if (mColor.includes("yellow")) return key === "yellow";
                    if (mColor.includes("pink") || mColor.includes("rose")) return key === "pink";
                    if (mColor.includes("white")) return key === "white";
                    return false;
                  }).map(([key, hex]) => {
                    const label = key === "yellow" ? "Yellow Gold" : key === "pink" ? "Pink Gold" : "White Gold";
                    const isSelected = color === label;
                    return (
                      <div key={key} onClick={() => setColor(label)} style={{
                        width: 28, height: 28, borderRadius: "50%", background: hex,
                        border: "2px solid #fff",
                        cursor: "pointer", transition: "all 0.15s",
                        boxShadow: `0 0 0 2px ${isSelected ? GOLD : "rgba(0,0,0,0.12)"}`,
                        position: 'relative',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Purity */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: "0 0 10px" }}>Purity :</p>
                <div style={{ display: "flex", gap: 10 }}>
                  {["18KT", "22KT"].map(k => (
                    <button key={k} onClick={() => setPurity(k)} style={{
                      padding: isMobile ? "8px 16px" : "8px 22px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                      cursor: "pointer", transition: "all 0.15s",
                      background: purity === k ? GOLD : "#fff",
                      color: purity === k ? "#fff" : "#374151",
                      border: purity === k ? `1.5px solid ${GOLD}` : "1.5px solid #d1d5db",
                    }}>
                      {k}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: "0 0 10px" }}>
                  Size : &nbsp;<span style={{ fontWeight: 400 }}>{size}</span>
                </p>
                <div style={{ position: "relative", display: "inline-block", width: isMobile ? '100%' : 'auto' }}>
                  <select value={size} onChange={e => setSize(e.target.value)} style={{
                    appearance: "none", WebkitAppearance: "none",
                    border: "1.5px solid #d1d5db", borderRadius: 8,
                    padding: "9px 40px 9px 14px", fontSize: 14, color: "#374151",
                    fontFamily: SF, background: "#fff", cursor: "pointer",
                    minWidth: isMobile ? '100%' : 180,
                  }}>
                    {["13 (52.50 mm)", "14 (54.40 mm)", "15 (56.30 mm)", "16 (58.10 mm)", "17 (60.00 mm)"].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                    <ChevDown />
                  </span>
                </div>
                <p style={{ fontSize: 13, color: GOLD, margin: "8px 0 0", textDecoration: "underline", cursor: "pointer", fontWeight: 600 }}>Ring Size Guide</p>
              </div>

              {/* CTA buttons */}
              <div style={{ display: "flex", gap: 12, marginBottom: 14, flexDirection: isMobile ? 'column' : 'row' }}>
                <button style={{
                  flex: 1, padding: "14px 0", borderRadius: 10,
                  background: "#fff", border: `2px solid ${GOLD}`,
                  color: GOLD, fontSize: 14, fontWeight: 700,
                  letterSpacing: 0.5, cursor: "pointer",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = GOLD_L}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  ADD TO CART
                </button>
                <button style={{
                  flex: 1, padding: "14px 0", borderRadius: 10,
                  background: GOLD, border: "none",
                  color: "#fff", fontSize: 14, fontWeight: 700,
                  letterSpacing: 0.5, cursor: "pointer",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#c8900e"}
                  onMouseLeave={e => e.currentTarget.style.background = GOLD}
                >
                  BUY NOW
                </button>
              </div>

              {/* Shipping & Enquiry */}
              <div style={{ display: "flex", gap: 18, marginBottom: 22, flexWrap: 'wrap' }}>
                <button style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 13, color: "#6b7280",
                }}>
                  <TruckIcon /> Shipping &amp; Cancellation
                </button>
                <button style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 13, color: "#6b7280",
                }}>
                  <ShippingQIcon /> Enquiry For This Product
                </button>
              </div>


              {/* Our Promise */}
              <div style={{ background: GOLD_L, borderRadius: 14, padding: isMobile ? "16px" : "20px 22px" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 18px", textAlign: "center" }}>Our Promise</h3>
                <div className="promise-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" }}>
                  {[
                    { Icon: ExchangeIcon, title: "100% Exchange",          sub: "Lifetime exchange" },
                    { Icon: ShieldIcon,   title: "Hallmarked Gold",         sub: "BIS certified" },
                    { Icon: ReturnIcon,   title: "15 Days Return",     sub: "Hassle-free returns" },
                    { Icon: ShippingIcon, title: "Free Shipping", sub: "Fully insured" },
                    { Icon: CertIcon,     title: "Certified Jewellery",     sub: "SGL & IGI certified" },
                    { Icon: SavingsIcon,  title: "Big Savings",                 sub: "30-40% less" },
                  ].map(({ Icon, title, sub }) => (
                    <div key={title} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ flexShrink: 0, marginTop: 1 }}><Icon /></div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 2px" }}>{title}</p>
                        <p style={{ fontSize: 11, color: "#6b7280", margin: 0, lineHeight: 1.4 }}>{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── You May Also Like ── */}
          <div style={{ marginTop: 56 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#111827", textAlign: "center", margin: "0 0 28px" }}>
              You May Also Like
            </h2>
            <div className="similar-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
              {(relatedProducts.length > 0 ? relatedProducts : SIMILAR).slice(0, 4).map((p, index) => (
                <Link key={relatedProducts.length > 0 ? p.id : p.id} to={`/product/${relatedProducts.length > 0 ? p.id : p.id}`} style={{
                  background: "#fff", borderRadius: 14,
                  border: "1px solid #f0f0f0", overflow: "hidden",
                  cursor: "pointer", textDecoration: 'none',
                  boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
                  transition: "all 0.2s ease",
                  display: "block",
                }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.10)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 6px rgba(0,0,0,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{
                    aspectRatio: "1/1", 
                    background: relatedProducts.length > 0 ? "#f0f0f0" : SIMILAR[index]?.bg,
                    display: "flex", alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}>
                    <img 
                      src={relatedProducts.length > 0 ? (p as Product).product_image : (p as typeof SIMILAR[0]).image} 
                      alt={relatedProducts.length > 0 ? (p as Product).product_name : (p as typeof SIMILAR[0]).name} 
                      style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                  </div>
                  <div style={{ padding: "12px 14px 14px" }}>
                    <p style={{
                      fontSize: 13, fontWeight: 600, color: "#111827",
                      margin: "0 0 6px", lineHeight: 1.4,
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {relatedProducts.length > 0 ? (p as Product).product_name : (p as typeof SIMILAR[0]).name}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                        {relatedProducts.length > 0 
                          ? `₹${(p as Product).price?.toLocaleString('en-IN') || '0'}` 
                          : (p as typeof SIMILAR[0]).price
                        }
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}