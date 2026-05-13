import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService, type ProductDetail as ProductDetailType, type Product } from "../services/api";
import { authService } from "../services/auth";
import { useCurrency } from "../context/CurrencyContext";
import {
  dispatchCartUpdate,
  getWishlistProductMap,
  toggleWishlistWithUpdate,
  WISHLIST_UPDATE_EVENT,
} from "../utils/cartUtils";
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
  const navigate = useNavigate();
  const { format } = useCurrency(); // INR → active currency (INR/USD)
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
  const [cartBusy, setCartBusy] = useState(false);
  const [cartMsg, setCartMsg] = useState<{ text: string; kind: 'ok' | 'err' } | null>(null);
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);

  useEffect(() => {
    if (!product?.id) return;
    let cancelled = false;
    const sync = async () => {
      if (!authService.isAuthenticated()) {
        setInWishlist(!!product.is_wishlist);
        return;
      }
      const map = await getWishlistProductMap();
      if (!cancelled) setInWishlist(map.has(product.id));
    };
    sync();
    const refresh = () => sync();
    window.addEventListener(WISHLIST_UPDATE_EVENT, refresh);
    return () => {
      cancelled = true;
      window.removeEventListener(WISHLIST_UPDATE_EVENT, refresh);
    };
  }, [product?.id, product?.is_wishlist]);

  const handleWishlistToggle = async () => {
    if (!product?.id) return;
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    setWishlistBusy(true);
    const previous = inWishlist;
    setInWishlist(!previous);
    const res = await toggleWishlistWithUpdate(product.id);
    if (!res.success) {
      setInWishlist(previous);
      setCartMsg({ text: res.message || 'Failed to update wishlist', kind: 'err' });
      setTimeout(() => setCartMsg(null), 2500);
    }
    setWishlistBusy(false);
  };

  const handleAddToCart = async () => {
    if (!product?.id) return;
    const user = authService.getCurrentUser();
    if (!user?.id) {
      navigate('/login');
      return;
    }
    setCartBusy(true);
    setCartMsg(null);
    try {
      const res = await apiService.addToCart(user.id, product.id, 1, 0, user.role);
      if (res.success) {
        dispatchCartUpdate();
        setCartMsg({ text: 'Added to cart', kind: 'ok' });
      } else if (res.alreadyExists) {
        setCartMsg({ text: res.message || 'Already in your cart', kind: 'err' });
      } else {
        setCartMsg({ text: res.message || 'Could not add to cart', kind: 'err' });
      }
    } finally {
      setCartBusy(false);
      setTimeout(() => setCartMsg(null), 2500);
    }
  };

  const handleBuyNow = async () => {
    if (!product?.id) return;
    const user = authService.getCurrentUser();
    if (!user?.id) {
      navigate('/login');
      return;
    }
    const res = await apiService.addToCart(user.id, product.id, 1, 0, user.role);
    if (res.success || res.alreadyExists) {
      dispatchCartUpdate();
      navigate('/cart');
    } else {
      setCartMsg({ text: res.message || 'Could not start checkout', kind: 'err' });
    }
  };

  const [showPriceBreakup, setShowPriceBreakup] = useState(false);
  const [showSizeChart, setShowSizeChart] = useState(false);
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
        
        const [productData, categoryProducts, reviewsData] = await Promise.all([
          apiService.getProductDetails(productId),
          // Get products from the same category for "You May Also Like"
          apiService.getProducts().then(result => result.products),
          apiService.getProductReviews(productId)
        ]);
        
        setProduct(productData);
        
        // Filter products from the same category, excluding current product
        const sameCategoryProducts = categoryProducts
          .filter(p => p.category_id === productData.category_id && p.id !== productId)
          .slice(0, 4);
        
        setRelatedProducts(sameCategoryProducts);
        setReviews(reviewsData);
        
        // Set initial color based on product material color
        if (productData.material_color) {
          const mColor = productData.material_color.toLowerCase();
          if (mColor.includes("yellow")) setColor("Yellow Gold");
          else if (mColor.includes("pink") || mColor.includes("rose")) setColor("Pink Gold");
          else if (mColor.includes("white")) setColor("White Gold");
        }

        // Default the purity selector to the product's actual karat — otherwise the
        // first render shows "18KT" selected even when the stored prices are for 22KT.
        if (productData.karat) {
          const firstKarat = String(productData.karat).split(',')[0].trim();
          setPurity(`${firstKarat}KT`);
        }

        // Default the size selector to the first size returned from the variant_sizes
        // table. Hardcoded "14 (54.40 mm)" is wrong for non-ring products.
        if (productData.has_sizes === 1 && productData.sizes && productData.sizes.length > 0) {
          setSize(productData.sizes[0].size);
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

  // Price breakup — mirrors the PDF formula implemented on the backend
  // (`tamarijewllesapi/utils/priceCalculator.js`). Single source of truth lives
  // there; this memo only re-runs it locally so the user can preview the
  // 22KT price when the product is stored at 18KT (and vice versa).
  //
  // PDF formula (LOCKET example: 5.5g net, 18KT, 16% VA, ₹750/g making):
  //   final_gold_wt  = net × (purity% + VA%) / purity%     = 5.5 × 92/76 = 6.658g
  //   gold_value     = final_gold_wt × (rate_24k × purity%) = 6.658 × ₹11,575 = ₹77,068
  //   making_wt      = net × (1 + VA%/100)                 = 5.5 × 1.16 = 6.380g
  //   making_value   = making_wt × making_charges_per_gram = 6.380 × ₹750 = ₹4,785
  //   certificate    = diamond_ct × ₹850                   = 2.5 × 850 = ₹2,125
  //   subtotal       = gold + making + diamond + stone + certificate
  //   total          = subtotal × (1 + GST/100)            (GST = 3% for jewellery)
  //
  // At the product's STORED karat we use backend's exact values (zero drift —
  // those numbers feed cart, checkout, invoice). At any OTHER karat we recompute
  // locally; total = sum of rows (no backend reference to pin to).
  type BreakupRow = { label: string; amount: number };

  // Indian jewellery industry hallmark purity ratios (PDF page 2: 18KT=76%, 22KT=92%).
  // Keep in lockstep with PURITY_MAP in backend priceCalculator.js.
  const PURITY_MAP: Record<number, number> = { 14: 0.585, 18: 0.76, 22: 0.92, 24: 1.00 };
  const CERTIFICATE_RATE_PER_CT = 850; // PDF "Other" row, hardcoded per business decision.

  const purityFactor = (karat: number) =>
    PURITY_MAP[karat] !== undefined ? PURITY_MAP[karat] : karat / 24;

  const availableKarats = useMemo(() => {
    if (!product?.karat) return ["18KT", "22KT"];
    const k = String(product.karat).split(',').map(v => v.trim()).filter(v => v);
    if (k.length === 0) return ["18KT", "22KT"];
    return k.map(v => `${v}KT`);
  }, [product?.karat]);

  const breakup = useMemo<{ rows: BreakupRow[]; total: number } | null>(() => {
    debugger
    if (!product) return null;

    const productKaratValue = parseInt(String(product.karat || "").split(',')[0].trim(), 10) || 0;
    const selectedKarat = parseInt(purity, 10) || productKaratValue || 0;
    const sameKarat = selectedKarat === productKaratValue;
    const isGold = (product.metal_name || "").toLowerCase() === "gold";

    const metalLabel = product.metal_name
      ? `${product.metal_name}${selectedKarat ? ` ${selectedKarat}KT` : ""}${product.gross_weight ? ` (${product.gross_weight} g)` : ""}`
      : "Metal";
    const diamondLabel = product.diamond_weight ? `Diamond (${product.diamond_weight} ct)` : "Diamond";
    const gstLabel = product.gst_percentage != null ? `GST (${product.gst_percentage}%)` : "GST";

    // ── Stored karat: use backend's exact values (no recompute). ──────────
    if (sameKarat) {
      const metalValue = Number(product.metal_value || 0);
      const makingValue = Number(product.making_value ?? product.makingcharges ?? 0);
      const diamondValue = product.has_diamond === 1 ? Number(product.diamond_value || 0) : 0;
      const stoneValue = product.has_stone === 1 ? Number(product.stone_value || 0) : 0;
      const certificateValue = product.has_diamond === 1 ? Number(product.certificate_value || 0) : 0;
      const gstAmount = Number(product.gst_amount || 0);
      const total = Number(product.total_price ?? product.price ?? 0);

      const rows: BreakupRow[] = [];
      if (metalValue > 0) rows.push({ label: metalLabel, amount: Math.round(metalValue) });
      if (diamondValue > 0) rows.push({ label: diamondLabel, amount: Math.round(diamondValue) });
      if (stoneValue > 0) rows.push({ label: "Stone", amount: Math.round(stoneValue) });
      rows.push({ label: "Making Charge", amount: Math.round(makingValue) });
      if (certificateValue > 0) rows.push({ label: "Certificate", amount: Math.round(certificateValue) });
      if (gstAmount > 0) rows.push({ label: gstLabel, amount: Math.round(gstAmount) });
      return { rows, total };
    }

    // ── Toggled karat: recompute PDF formula locally; total = sum of rows. ─
    const netWt = Number(product.net_weight || 0);
    const vaPct = Number(product.VA_percentage || 0);
    const makingPerGram = Number(product.making_charges || 0); // ₹/gram (NOT total)
    const rate24k = Number(product.rate_per_gram || 0);

    let metalValue: number;
    if (isGold) {
      debugger
      const purityPct = purityFactor(selectedKarat) * 100;
      const finalGoldWt = purityPct > 0 ? netWt * (purityPct + vaPct) / purityPct : 0;
      const karatRate = rate24k * purityFactor(selectedKarat);
      metalValue = finalGoldWt * karatRate;
    } else {
      metalValue = netWt * rate24k;
    }

    const makingWt = netWt * (1 + vaPct / 100);
    const makingValue = makingWt * makingPerGram;

    const diamondCt = Number(product.diamond_weight || 0);
    const diamondValue = product.has_diamond === 1 ? Number(product.diamond_value || 0) : 0;
    const stoneValue = product.has_stone === 1 ? Number(product.stone_value || 0) : 0;
    const certificateValue = product.has_diamond === 1 ? diamondCt * CERTIFICATE_RATE_PER_CT : 0;

    const subTotal = metalValue + makingValue + diamondValue + stoneValue + certificateValue;
    const gstPercent = Number(product.gst_percentage || 0);
    const gstAmount = subTotal * (gstPercent / 100);
    const total = Math.round(subTotal + gstAmount);

    const rows: BreakupRow[] = [];
    if (metalValue > 0) rows.push({ label: metalLabel, amount: Math.round(metalValue) });
    if (diamondValue > 0) rows.push({ label: diamondLabel, amount: Math.round(diamondValue) });
    if (stoneValue > 0) rows.push({ label: "Stone", amount: Math.round(stoneValue) });
    rows.push({ label: "Making Charge", amount: Math.round(makingValue) });
    if (certificateValue > 0) rows.push({ label: "Certificate", amount: Math.round(certificateValue) });
    if (gstAmount > 0) rows.push({ label: gstLabel, amount: Math.round(gstAmount) });

    return { rows, total };
  }, [product, purity]);
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
            gap: 16px !important;
          }
          .mobile-stack {
            flex-direction: column !important;
            gap: 12px !important;
          }
        }
        
        @media (max-width: 480px) {
          .similar-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#f9f9f7", fontFamily: SF }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: isMobile ? "20px 16px 40px" : "28px 24px 60px" }}>

          {/* ── Breadcrumb ── */}
          <nav style={{ marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>
              <Link to="/" style={{ textDecoration: 'none', color: '#6b7280' }}>Home</Link> &nbsp;›&nbsp;
              {product?.category_name && (
                <>
                  <Link to={`/products?category=${product.category_id}`} style={{ textDecoration: 'none', color: '#6b7280', textTransform: 'capitalize' }}>
                    {product.category_name}
                  </Link> &nbsp;›&nbsp;
                </>
              )}
              <span style={{ color: "#111827", fontWeight: 500, textTransform: "capitalize" }}>{product?.product_name}</span>
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
                      {/* {t === "reviews" ? `Reviews (${reviews.length})` : t} */}
                       {t === "reviews" ? `Reviews` : t}
                    </button>
                  ))}
                </div>
                {tab === "description" ? (
                  <div style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.75 }}>
                    <p style={{ margin: "0 0 14px" }}>
                      {product?.description || "No description available for this product."}
                    </p>
                  </div>
                ) : tab === "product detail" ? (() => {
                  // Each spec row only renders when the underlying field has a real value.
                  // Hardcoded fallbacks like "Yellow Gold" / "VVS1" / "Round" were misleading
                  // because they looked like product data but were actually placeholders.
                  type Row = { label: string; value: string | number | undefined | null };
                  const renderSection = (icon: string, title: string, rows: Row[]) => {
                    const valid = rows.filter(r => {
                      const v = r.value;
                      if (v === null || v === undefined) return false;
                      const s = String(v).trim();
                      return s.length > 0 && s !== "0";
                    });
                    if (valid.length === 0) return null;
                    return (
                      <div style={{ marginBottom: 24 }}>
                        <div style={{
                          background: "#c9a84c", color: "#fff", padding: "12px 16px",
                          borderRadius: "8px 8px 0 0", fontWeight: 600,
                          display: "flex", alignItems: "center", gap: 8,
                        }}>
                          {icon} {title}
                        </div>
                        <div style={{ border: "1px solid #e5e7eb", borderTop: "none", borderRadius: "0 0 8px 8px" }}>
                          {valid.map((r, i) => (
                            <div key={r.label} style={{ display: "flex", borderBottom: i === valid.length - 1 ? "none" : "1px solid #e5e7eb" }}>
                              <div style={{ padding: "12px 16px", background: "#f9fafb", width: "40%", borderRight: "1px solid #e5e7eb" }}>{r.label}</div>
                              <div style={{ padding: "12px 16px", flex: 1, textTransform: "capitalize" }}>{r.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  };

                  const generalRows: Row[] = [
                    { label: "Product Code", value: product?.sku_id },
                    { label: "Jewellery Type", value: product?.jewellery_type || product?.category_name },
                    { label: "Collection", value: product?.collection },
                    { label: "Gender", value: product?.gender },
                    { label: "Occasion", value: product?.occasion },
                  ];

                  const metalRows: Row[] = [
                    { label: "Metal Type", value: product?.metal_name },
                    { label: "Purity", value: product?.karat ? `${product.karat}KT` : undefined },
                    { label: "Gross Weight", value: product?.gross_weight ? `${product.gross_weight} g` : undefined },
                    { label: "Net Weight", value: product?.net_weight ? `${product.net_weight} g` : undefined },
                    { label: "Metal Colour", value: product?.material_color },
                  ];

                  const hasDiamondData = product?.has_diamond === 1;
                  const diamondRows: Row[] = hasDiamondData ? [
                    { label: "Diamond Weight", value: product?.diamond_weight ? `${product.diamond_weight} ct` : undefined },
                    { label: "Diamond Pieces", value: product?.no_of_diamonds },
                    { label: "Diamond Quality", value: product?.diamond_clarity },
                    { label: "Diamond Colour", value: product?.diamond_color },
                    { label: "Diamond Shape", value: product?.diamond_shape },
                    { label: "Diamond Setting", value: product?.diamond_setting },
                  ] : [];

                  // Stone details — backend stores stone_details as JSON array of stones.
                  // We render one combined row per stone if available.
                  const hasStoneData = product?.has_stone === 1 && Array.isArray(product?.stone_details) && product.stone_details.length > 0;
                  const stoneRows: Row[] = hasStoneData
                    ? product!.stone_details!.flatMap((s, i) => {
                        const idx = product!.stone_details!.length > 1 ? ` ${i + 1}` : "";
                        return [
                          { label: `Stone${idx} Name`, value: s.stone_name },
                          { label: `Stone${idx} Weight`, value: s.stone_weight ? `${s.stone_weight} ct` : undefined },
                        ] as Row[];
                      })
                    : [];

                  return (
                    <div style={{ fontSize: 13.5, color: "#374151", lineHeight: 1.75 }}>
                      {renderSection("📋", "General Information", generalRows)}
                      {renderSection("🔶", "Metal Information", metalRows)}
                      {renderSection("💎", "Diamond Information", diamondRows)}
                      {renderSection("🔷", "Stone Information", stoneRows)}

                      <div style={{
                        background: "#fef9ec", border: "1px solid #f59e0b", borderRadius: 8,
                        padding: 16, fontSize: 13, color: "#92400e",
                      }}>
                        <strong>Note:</strong> It's customizable according to your requirements. Please feel free to get in touch with us for more information. Kindly mention the product code number while enquiring.
                      </div>
                    </div>
                  );
                })() : (
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
              <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: "#111827", margin: "0 0 16px", lineHeight: 1.4, textTransform: "capitalize" }}>
                {product?.product_name || "Product"}
              </h1>

              {/* Price — recomputed live when purity changes (mirrors backend formula) */}
              <p style={{ fontSize: isMobile ? 26 : 32, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>
                {breakup ? format(breakup.total, { inputIncludesGst: true }) : 'Price not available'}
              </p>
              <p style={{ fontSize: 13, color: GOLD, fontWeight: 600, margin: "0 0 22px", textDecoration: "underline", cursor: "pointer" }}
                onClick={() => setShowPriceBreakup(!showPriceBreakup)}>SEE PRICE BREAKUP</p>

              {/* Price Breakup Dropdown — driven by `breakup`, which scales with selected purity */}
              {showPriceBreakup && breakup && (
                <div style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: "20px",
                  marginBottom: 20,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 16px" }}>PRICE BREAKUP</h3>

                  <div style={{ marginBottom: 16 }}>
                    {breakup.rows.map(r => (
                      <div key={r.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{ color: "#6b7280" }}>{r.label}</span>
                        <span style={{ fontWeight: 600 }}>{format(r.amount, { inputIncludesGst: false })}</span>
                      </div>
                    ))}
                    <hr style={{ border: "none", borderTop: "1px solid #e5e7eb", margin: "12px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>Total</span>
                      <span style={{ fontWeight: 700, fontSize: 16 }}>{format(breakup.total, { inputIncludesGst: true })}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Color */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#111827", margin: "0 0 10px" }}>
                  Color: &nbsp;<span style={{ fontWeight: 400 }}>{color}</span>
                </p>
                <div style={{ display: "flex", gap: 18, paddingLeft: 6 }}>
                  {Object.entries(COLOR_MAP).filter(([key]) => {
                    if (!product?.material_color) return key === "white"; // default if missing
                    const mColor = product.material_color.toLowerCase();
                    if (key === "rose") return false; // pink + rose share a swatch; only render under "pink"
                    // Each color is checked independently — a product with material_color
                    // "Yellow, White" should show BOTH swatches, not just the first match.
                    if (key === "yellow") return mColor.includes("yellow");
                    if (key === "pink") return mColor.includes("pink") || mColor.includes("rose");
                    if (key === "white") return mColor.includes("white");
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
                  {availableKarats.map(k => (
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

              {/* Size — only render when the product actually has size variants */}
              {product?.has_sizes === 1 && product.sizes && product.sizes.length > 0 && (() => {
                // Map category to an item-type label (Ring / Bangle / Bracelet / Chain / Earring).
                // Falls back to "Size" when the category doesn't suggest a known shape.
                const cat = (product.category_name || product.subcategory_name || "").toLowerCase();
                const itemLabel =
                  cat.includes("ring") ? "Ring" :
                  cat.includes("bangle") ? "Bangle" :
                  cat.includes("bracelet") ? "Bracelet" :
                  cat.includes("chain") || cat.includes("necklace") ? "Chain" :
                  cat.includes("earring") ? "Earring" :
                  "";

                return (
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
                        {product.sizes.map(s => (
                          <option key={s.id} value={s.size}>{s.size}</option>
                        ))}
                      </select>
                      <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                        <ChevDown />
                      </span>
                    </div>
                    <p
                      onClick={() => setShowSizeChart(true)}
                      style={{ fontSize: 13, color: GOLD, margin: "8px 0 0", textDecoration: "underline", cursor: "pointer", fontWeight: 600 }}
                    >
                      {itemLabel ? `${itemLabel} Size Guide` : "Size Guide"}
                    </p>
                  </div>
                );
              })()}

              {/* Size Chart Modal — lists the sizes available for this product */}
              {showSizeChart && product?.sizes && (() => {
                const cat = (product.category_name || product.subcategory_name || "").toLowerCase();
                const itemLabel =
                  cat.includes("ring") ? "Ring" :
                  cat.includes("bangle") ? "Bangle" :
                  cat.includes("bracelet") ? "Bracelet" :
                  cat.includes("chain") || cat.includes("necklace") ? "Chain" :
                  cat.includes("earring") ? "Earring" :
                  "";
                return (
                  <div
                    onClick={() => setShowSizeChart(false)}
                    style={{
                      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      zIndex: 1000, padding: 16,
                    }}
                  >
                    <div
                      onClick={e => e.stopPropagation()}
                      style={{
                        background: "#fff", borderRadius: 12, padding: 24,
                        maxWidth: 480, width: "100%", maxHeight: "80vh", overflow: "auto",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>
                          {itemLabel ? `${itemLabel} Size Guide` : "Size Guide"}
                        </h3>
                        <button
                          onClick={() => setShowSizeChart(false)}
                          aria-label="Close"
                          style={{
                            background: "transparent", border: "none", fontSize: 24, lineHeight: 1,
                            cursor: "pointer", color: "#6b7280", padding: 4,
                          }}
                        >×</button>
                      </div>
                      {product.sizechart_image ? (
                        <img
                          src={product.sizechart_image}
                          alt={itemLabel ? `${itemLabel} size chart` : "Size chart"}
                          style={{ width: "100%", height: "auto", display: "block", borderRadius: 8 }}
                        />
                      ) : (
                        <>
                          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px" }}>
                            Size chart image not available. Available sizes:
                          </p>
                          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                            <thead>
                              <tr style={{ background: GOLD_L }}>
                                <th style={{ padding: "10px 12px", textAlign: "left", fontWeight: 700, color: "#111827", borderBottom: `1px solid ${GOLD}` }}>Size</th>
                              </tr>
                            </thead>
                            <tbody>
                              {product.sizes.map(s => (
                                <tr key={s.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                                  <td style={{ padding: "10px 12px", color: "#374151" }}>{s.size}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* CTA buttons */}
              <div className="mobile-stack" style={{ display: "flex", gap: 12, marginBottom: 14, flexDirection: isMobile ? 'column' : 'row', alignItems: 'stretch' }}>
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistBusy}
                  aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  style={{
                    width: isMobile ? '100%' : 52,
                    padding: isMobile ? "12px 0" : 0,
                    borderRadius: 10,
                    background: inWishlist ? '#fef2f2' : '#fff',
                    border: `2px solid ${inWishlist ? '#ef4444' : '#e5e7eb'}`,
                    color: inWishlist ? '#ef4444' : '#6b7280',
                    cursor: wishlistBusy ? "not-allowed" : "pointer",
                    opacity: wishlistBusy ? 0.6 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 8,
                    fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
                    transition: "all 0.15s",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill={inWishlist ? "#ef4444" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {isMobile && (inWishlist ? 'SAVED' : 'WISHLIST')}
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={cartBusy}
                  style={{
                    flex: 1, padding: "14px 0", borderRadius: 10,
                    background: "#fff", border: `2px solid ${GOLD}`,
                    color: GOLD, fontSize: 14, fontWeight: 700,
                    letterSpacing: 0.5, cursor: cartBusy ? "not-allowed" : "pointer",
                    opacity: cartBusy ? 0.7 : 1,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { if (!cartBusy) e.currentTarget.style.background = GOLD_L; }}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  {cartBusy ? 'ADDING…' : 'ADD TO CART'}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={cartBusy}
                  style={{
                    flex: 1, padding: "14px 0", borderRadius: 10,
                    background: GOLD, border: "none",
                    color: "#fff", fontSize: 14, fontWeight: 700,
                    letterSpacing: 0.5, cursor: cartBusy ? "not-allowed" : "pointer",
                    opacity: cartBusy ? 0.7 : 1,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { if (!cartBusy) e.currentTarget.style.background = "#c8900e"; }}
                  onMouseLeave={e => e.currentTarget.style.background = GOLD}
                >
                  BUY NOW
                </button>
              </div>
              {cartMsg && (
                <div style={{
                  marginBottom: 12,
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  background: cartMsg.kind === 'ok' ? '#dcfce7' : '#fee2e2',
                  color: cartMsg.kind === 'ok' ? '#166534' : '#991b1b',
                }}>
                  {cartMsg.text}
                </div>
              )}

              {/* Shipping & Enquiry */}
              <div className="mobile-stack" style={{ display: "flex", gap: 18, marginBottom: 22, flexWrap: 'wrap' }}>
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
              <div style={{ background: GOLD_L, borderRadius: 16, padding: isMobile ? "24px" : "32px 28px" }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: "0 0 24px", textAlign: "center" }}>Our Promise</h3>
                <div className="promise-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 24px" }}>
                  {[
                    { Icon: ExchangeIcon, title: "100% Exchange",          sub: "Lifetime exchange" },
                    { Icon: ShieldIcon,   title: "Hallmarked Gold",         sub: "BIS certified" },
                    { Icon: ReturnIcon,   title: "15 Days Return",     sub: "Hassle-free returns" },
                    { Icon: ShippingIcon, title: "Free Shipping", sub: "Fully insured" },
                    { Icon: CertIcon,     title: "Certified Jewellery",     sub: "SGL & IGI certified" },
                    { Icon: SavingsIcon,  title: "Big Savings",                 sub: "30-40% less" },
                  ].map(({ Icon, title, sub }) => (
                    <div key={title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ flexShrink: 0, marginTop: 2 }}><Icon /></div>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>{title}</p>
                        <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.4 }}>{sub}</p>
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
                      textTransform: "capitalize",
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>
                      {relatedProducts.length > 0 ? (p as Product).product_name : (p as typeof SIMILAR[0]).name}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
                        {relatedProducts.length > 0
                          ? format((p as Product).price || 0, { inputIncludesGst: true })
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