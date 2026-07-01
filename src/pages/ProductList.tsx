import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { apiService, type Product, type CategoryWithSubcategories } from "../services/api";
import { authService } from "../services/auth";
import { useCurrency } from "../context/CurrencyContext";
import {
  WISHLIST_UPDATE_EVENT,
  getWishlistProductMap,
  toggleWishlistWithUpdate,
  dispatchCartUpdate,
} from "../utils/cartUtils";

const SF = "-apple-system,'SF Pro Display','SF Pro Text',BlinkMacSystemFont,sans-serif";
const GOLD = "#c9a84c";

/* ── Chevron icon ── */
const ChevDown = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
);

/* ── Filter sections data ── */
const GOLD_TYPES = ["Rose Gold", "White Gold", "Yellow Gold"];
const GENDERS = ["Women", "Men"];

// Accept either "Women"/"Female" or "Men"/"Male" in DB
const matchGender = (productGender: string, filter: string) => {
  const p = (productGender || "").toLowerCase();
  const f = filter.toLowerCase();
  if (f === "women") return p === "women" || p === "female";
  if (f === "men") return p === "men" || p === "male";
  return p === f;
};
const JEWELLERY_TYPES = ["Gold", "Diamonds", "Gold & Diamonds"];

interface FilterState {
  categories: number[];
  subcategories: number[];
  genders: string[];
  jewelleryTypes: string[];
  goldTypes: string[];
  minPrice: number;
  maxPrice: number;
  sortBy: string;
}

/* ════════════════════════
   FILTER SECTION COMPONENT
════════════════════════ */
function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: 20 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", background: "none",
          border: "none", cursor: "pointer", padding: "4px 0",
          marginBottom: open ? 12 : 0,
        }}
      >
        <span style={{ fontFamily: SF, fontSize: 14, fontWeight: 600, color: "#111827" }}>{title}</span>
        <span style={{ color: "#6b7280", transform: open ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s" }}>
          <ChevDown />
        </span>
      </button>
      {open && children}
    </div>
  );
}

/* ── Checkbox row ── */
function CheckRow({ label, checked, count, onClick }: { label: string; checked: boolean; count?: number; onClick?: () => void }) {
  const handleClick = () => {
    onClick?.();
  };
  
  return (
    <label style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      cursor: "pointer", padding: "3px 0", userSelect: "none",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div
          onClick={handleClick}
          style={{
            width: 16, height: 16, borderRadius: 4, flexShrink: 0,
            border: checked ? "none" : "1.5px solid #d1d5db",
            background: checked ? GOLD : "#fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          {checked && (
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <polyline points="1.5,6 4.5,9 10.5,3" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span style={{ fontFamily: SF, fontSize: 13, color: "#374151", textTransform: "capitalize" }}>{label}</span>
      </div>
      {count != null && <span style={{ fontFamily: SF, fontSize: 12, fontWeight: 600, color: "#111827" }}>({count})</span>}
    </label>
  );
}

/* ════════════════════════
   SIDEBAR
════════════════════════ */
function Sidebar({
  allProducts,
  filters,
  onFiltersChange
}: {
  allProducts: Product[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}) {
  const [priceRangeOpen, setPriceRangeOpen] = useState(true);
  const [sortByOpen, setSortByOpen] = useState(true);

  // Slider bounds derived from the actual product catalog.
  // Min always starts at 0 — even when every product happens to be ≥ ₹500, anchoring
  // the slider at 0 lets users see the full range and keeps "price on request" items
  // (price = 0) inside the visible range rather than below it.
  const pricedProducts = allProducts.filter(p => (p.price || 0) > 0);
  const minPriceLimit = 0;
  const maxPrice = pricedProducts.length > 0
    ? Math.ceil(Math.max(...pricedProducts.map(p => p.price), minPriceLimit + 100000))
    : 100000;
  
  const sliderPct = ((filters.minPrice - minPriceLimit) / (maxPrice - minPriceLimit)) * 100;

  const handleCategoryToggle = (categoryId: number) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(id => id !== categoryId)
      : [...filters.categories, categoryId];
    
    // Clear subcategories if no categories selected
    const newSubcategories = newCategories.length === 0 ? [] : filters.subcategories;
    
    onFiltersChange({
      ...filters,
      categories: newCategories,
      subcategories: newSubcategories
    });
  };

  const handleSubcategoryToggle = (subcategoryId: number) => {
    const newSubcategories = filters.subcategories.includes(subcategoryId)
      ? filters.subcategories.filter(id => id !== subcategoryId)
      : [...filters.subcategories, subcategoryId];
    
    onFiltersChange({
      ...filters,
      subcategories: newSubcategories
    });
  };

  const handleGoldTypeToggle = (type: string) => {
    const newTypes = filters.goldTypes.includes(type)
      ? filters.goldTypes.filter(t => t !== type)
      : [...filters.goldTypes, type];

    onFiltersChange({
      ...filters,
      goldTypes: newTypes
    });
  };

  const handleGenderToggle = (g: string) => {
    const next = filters.genders.includes(g)
      ? filters.genders.filter(x => x !== g)
      : [...filters.genders, g];
    onFiltersChange({ ...filters, genders: next });
  };

  const handleJewelleryTypeToggle = (t: string) => {
    const next = filters.jewelleryTypes.includes(t)
      ? filters.jewelleryTypes.filter(x => x !== t)
      : [...filters.jewelleryTypes, t];
    onFiltersChange({ ...filters, jewelleryTypes: next });
  };

  // Match helpers (same logic used by the main filter pipeline)
  const matchesCategory = (p: Product) =>
    filters.categories.length === 0 || filters.categories.includes(p.category_id);
  const matchesSubcategory = (p: Product) =>
    filters.subcategories.length === 0 ||
    (p.subcategory_id != null && filters.subcategories.includes(p.subcategory_id));
  const matchesGenderF = (p: Product) =>
    filters.genders.length === 0 ||
    filters.genders.some(sel => matchGender(p.gender || "", sel));
  const matchesJewelleryType = (p: Product) => {
    if (filters.jewelleryTypes.length === 0) return true;
    const metal = (p.metal_name || "").toLowerCase();
    const hasDiamond = Number(p.has_diamond) === 1;
    return filters.jewelleryTypes.some(t => {
      if (t === "Gold") return metal.includes("gold");
      if (t === "Diamonds") return hasDiamond;
      if (t === "Gold & Diamonds") return metal.includes("gold") && hasDiamond;
      return false;
    });
  };
  const matchesGoldType = (p: Product) => {
    if (filters.goldTypes.length === 0) return true;
    const c = (p.material_color || "").toLowerCase();
    return filters.goldTypes.some(g => {
      if (g === "Rose Gold") return c.includes("rose") || c.includes("pink");
      if (g === "White Gold") return c.includes("white");
      if (g === "Yellow Gold") return c.includes("yellow");
      return false;
    });
  };
  const matchesPrice = (p: Product) => {
    // Products with price = 0 are "price on request" items — they're excluded from
    // the catalog min/max calculation, so applying the slider bounds to them would
    // always drop them (0 < catalogMin). Treat unpriced products as outside the
    // price filter rather than below it, so they remain visible.
    if (!p.price || p.price <= 0) return true;
    if (filters.minPrice > 0 && p.price < filters.minPrice) return false;
    if (filters.maxPrice > 0 && p.price > filters.maxPrice) return false;
    return true;
  };

  // Faceted counts — each section's count reflects "adding this option on top of the current filters".
  // i.e. we apply every OTHER section's filter, then count how many of those match this option.
  const countCategory = (id: number) =>
    allProducts.filter(p =>
      p.category_id === id &&
      matchesSubcategory(p) && matchesGenderF(p) && matchesJewelleryType(p) && matchesGoldType(p) && matchesPrice(p)
    ).length;
  const countSubcategory = (id: number) =>
    allProducts.filter(p =>
      p.subcategory_id === id &&
      matchesCategory(p) && matchesGenderF(p) && matchesJewelleryType(p) && matchesGoldType(p) && matchesPrice(p)
    ).length;
  const countGender = (g: string) =>
    allProducts.filter(p =>
      matchGender(p.gender || "", g) &&
      matchesCategory(p) && matchesSubcategory(p) && matchesJewelleryType(p) && matchesGoldType(p) && matchesPrice(p)
    ).length;
  const countJewelleryType = (t: string) => {
    return allProducts.filter(p => {
      const metal = (p.metal_name || "").toLowerCase();
      const hasDiamond = Number(p.has_diamond) === 1;
      let ok = false;
      if (t === "Gold") ok = metal.includes("gold");
      else if (t === "Diamonds") ok = hasDiamond;
      else if (t === "Gold & Diamonds") ok = metal.includes("gold") && hasDiamond;
      return ok && matchesCategory(p) && matchesSubcategory(p) && matchesGenderF(p) && matchesGoldType(p) && matchesPrice(p);
    }).length;
  };
  const countGoldType = (g: string) => {
    return allProducts.filter(p => {
      const c = (p.material_color || "").toLowerCase();
      let ok = false;
      if (g === "Rose Gold") ok = c.includes("rose") || c.includes("pink");
      else if (g === "White Gold") ok = c.includes("white");
      else if (g === "Yellow Gold") ok = c.includes("yellow");
      return ok && matchesCategory(p) && matchesSubcategory(p) && matchesGenderF(p) && matchesJewelleryType(p) && matchesPrice(p);
    }).length;
  };

  // Build the Category + Subcategory option lists from the actual product data,
  // using the names returned by the getproducts JOIN. Only categories/subs that have products appear.
  const productCategories = Array.from(
    allProducts.reduce((map, p) => {
      if (p.category_id != null && !map.has(p.category_id)) {
        map.set(p.category_id, p.category_name || `Category ${p.category_id}`);
      }
      return map;
    }, new Map<number, string>())
  ).map(([id, category_name]) => ({ id, category_name }));

  const allSubcategories = Array.from(
    allProducts.reduce((map, p) => {
      if (p.subcategory_id != null && !map.has(p.subcategory_id)) {
        map.set(p.subcategory_id, p.subcategory_name || `Subcategory ${p.subcategory_id}`);
      }
      return map;
    }, new Map<number, string>())
  ).map(([id, subcategory_name]) => ({ id, subcategory_name }));

  const handlePriceChange = (minPrice: number, maxPrice: number) => {
    onFiltersChange({
      ...filters,
      minPrice,
      maxPrice
    });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({
      ...filters,
      sortBy
    });
  };

  return (
    <aside style={{
      width: 210, flexShrink: 0,
      fontFamily: SF,
      display: 'block',
    }}>
      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop {
            display: none !important;
          }
          .sidebar-mobile {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .sidebar-mobile {
            display: none !important;
          }
        }
      `}</style>
      
      {/* Price Range */}
      <div style={{ marginBottom: 22 }}>
        <button
          onClick={() => setPriceRangeOpen(!priceRangeOpen)}
          style={{
            width: "100%", display: "flex", alignItems: "center",
            justifyContent: "space-between", background: "none",
            border: "none", cursor: "pointer", padding: "4px 0", marginBottom: priceRangeOpen ? 12 : 0,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Price Range</span>
          <span style={{ color: "#6b7280", transform: priceRangeOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s" }}>
            <ChevDown />
          </span>
        </button>
        {priceRangeOpen && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <input
                type="text"
                value={filters.minPrice.toLocaleString("en-IN")}
                onChange={e => {
                  const value = Number(e.target.value.replace(/,/g, ""));
                  if (!isNaN(value)) {
                    handlePriceChange(value, filters.maxPrice);
                  }
                }}
                style={{
                  flex: 1, border: "1.5px solid #e5e7eb", borderRadius: 6,
                  padding: "6px 8px", fontSize: 13, color: "#374151",
                  fontFamily: SF, outline: "none", textAlign: "center",
                  width: 0,
                }}
              />
              <input
                type="text"
                value={filters.maxPrice.toLocaleString("en-IN")}
                onChange={e => {
                  const value = Number(e.target.value.replace(/,/g, ""));
                  if (!isNaN(value)) {
                    handlePriceChange(filters.minPrice, value);
                  }
                }}
                style={{
                  flex: 1, border: "1.5px solid #e5e7eb", borderRadius: 6,
                  padding: "6px 8px", fontSize: 13, color: "#374151",
                  fontFamily: SF, outline: "none", textAlign: "center",
                  width: 0,
                }}
              />
            </div>
            {/* Range slider */}
            <div style={{ position: "relative", height: 20, marginBottom: 6 }}>
              <div style={{
                position: "absolute", top: "50%", left: 0, right: 0,
                height: 4, background: "#e5e7eb", borderRadius: 2,
                transform: "translateY(-50%)",
              }} />
              <div style={{
                position: "absolute", top: "50%", left: 0,
                width: `${sliderPct}%`, height: 4,
                background: GOLD, borderRadius: 2,
                transform: "translateY(-50%)",
              }} />
              <input
                type="range" min={minPriceLimit} max={maxPrice}
                value={filters.minPrice}
                onChange={e => handlePriceChange(Number(e.target.value), filters.maxPrice)}
                style={{
                  position: "absolute", top: "50%", left: 0, right: 0,
                  transform: "translateY(-50%)", width: "100%",
                  WebkitAppearance: "none", appearance: "none",
                  background: "transparent", cursor: "pointer", outline: "none",
                  zIndex: 2,
                }}
              />
            </div>
            <style>{`
              input[type='range']::-webkit-slider-thumb {
                -webkit-appearance: none; width: 18px; height: 18px;
                border-radius: 50%; background: ${GOLD};
                border: 2px solid #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.18);
                cursor: pointer;
              }
              input[type='range']::-moz-range-thumb {
                width: 18px; height: 18px; border-radius: 50%;
                background: ${GOLD}; border: 2px solid #fff;
                box-shadow: 0 1px 4px rgba(0,0,0,0.18); cursor: pointer;
              }
            `}</style>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af" }}>
              <span>{minPriceLimit.toLocaleString()}</span><span>{maxPrice.toLocaleString()}</span>
            </div>
          </>
        )}
      </div>

      {/* Clear Filters Button */}
      <div style={{ marginBottom: 22 }}>
        <button
          onClick={() => {
            onFiltersChange({
              categories: [],
              subcategories: [],
              genders: [],
              jewelleryTypes: [],
              goldTypes: [],
              minPrice: 0,
              maxPrice: 0,
              sortBy: "Default"
            });
            // Also clear URL params
            const url = new URL(window.location.href);
            url.searchParams.delete('search');
            url.searchParams.delete('category');
            window.history.pushState({}, '', url.toString());
          }}
          style={{
            width: "100%",
            padding: "10px 16px",
            background: "#f3f4f6",
            border: "1px solid #d1d5db",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            color: "#374151",
            cursor: "pointer",
            fontFamily: SF,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "#e5e7eb";
            e.currentTarget.style.borderColor = "#9ca3af";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "#f3f4f6";
            e.currentTarget.style.borderColor = "#d1d5db";
          }}
        >
          Clear All Filters
        </button>
      </div>

      {/* Sort By */}
      <div style={{ marginBottom: 22 }}>
        <button 
          onClick={() => setSortByOpen(!sortByOpen)}
          style={{
            width: "100%", display: "flex", alignItems: "center",
            justifyContent: "space-between", background: "none",
            border: "none", cursor: "pointer", padding: "4px 0", marginBottom: sortByOpen ? 10 : 0,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Sort By</span>
          <span style={{ color: "#6b7280", transform: sortByOpen ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform 0.2s" }}>
            <ChevDown />
          </span>
        </button>
        {sortByOpen && (
          <select
            value={filters.sortBy}
            onChange={e => handleSortChange(e.target.value)}
            style={{
              width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 6,
              padding: "8px 10px", fontSize: 13, color: "#374151",
              fontFamily: SF, outline: "none", background: "#fff",
              cursor: "pointer", appearance: "none",
            }}
          >
            {["Default", "Price: Low to High", "Price: High to Low", "Newest First", "Name: A to Z", "Name: Z to A"].map(o => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        )}
      </div>

      {/* Categories — derived from actual products */}
      {productCategories.length > 0 && (
        <FilterSection title="Categories">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {productCategories.map((cat) => (
              <CheckRow
                key={cat.id}
                label={cat.category_name}
                count={countCategory(cat.id)}
                checked={filters.categories.includes(cat.id)}
                onClick={() => handleCategoryToggle(cat.id)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Gender */}
      <FilterSection title="Gender">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {GENDERS.map(g => (
            <CheckRow
              key={g}
              label={g}
              count={countGender(g)}
              checked={filters.genders.includes(g)}
              onClick={() => handleGenderToggle(g)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Subcategories (flat, across all categories) */}
      {allSubcategories.length > 0 && (
        <FilterSection title="subcategories">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {allSubcategories.map(sub => (
              <CheckRow
                key={sub.id}
                label={sub.subcategory_name}
                count={countSubcategory(sub.id)}
                checked={filters.subcategories.includes(sub.id)}
                onClick={() => handleSubcategoryToggle(sub.id)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Jewellery Type (Material) */}
      <FilterSection title="Jewellery Type (Material)">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {JEWELLERY_TYPES.map(t => (
            <CheckRow
              key={t}
              label={t}
              count={countJewelleryType(t)}
              checked={filters.jewelleryTypes.includes(t)}
              onClick={() => handleJewelleryTypeToggle(t)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Gold Type */}
      <FilterSection title="Gold Type">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {GOLD_TYPES.map(g => (
            <CheckRow
              key={g}
              label={g}
              count={countGoldType(g)}
              checked={filters.goldTypes.includes(g)}
              onClick={() => handleGoldTypeToggle(g)}
            />
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}

/* ════════════════════════
   PRODUCT CARD
════════════════════════ */
const COLOR_SWATCHES: { key: string; label: string; hex: string; ring: string; match: (c: string) => boolean }[] = [
  { key: "rose", label: "Rose Gold", hex: "#E0B0A0", ring: "#f0d5cc", match: c => c.includes("rose") || c.includes("pink") },
  { key: "white", label: "White Gold", hex: "#D9D9D9", ring: "#ececec", match: c => c.includes("white") },
  { key: "yellow", label: "Yellow Gold", hex: "#E4AC14", ring: "#f4dc8f", match: c => c.includes("yellow") },
];

function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const { format } = useCurrency(); // converts INR → active currency (INR/USD)
  const [hovered, setHovered] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [busy, setBusy] = useState<false | 'cart' | 'wishlist'>(false);
  const [toast, setToast] = useState<string | null>(null);

  const materialColor = (product.material_color || "").toLowerCase();
  const availableSwatches = COLOR_SWATCHES.filter(s => s.match(materialColor));
  // MRP comes from z_all_products.actual_price. Only render the strikethrough when
  // it's genuinely higher than the selling price — no fake 12% markup anymore.
  const mrp = Number(product.actual_price || 0) > Number(product.price || 0) && !product.is_combo
    ? Number(product.actual_price)
    : 0;

  const hoverImage = product.product_image_hover && product.product_image_hover !== product.product_image
    ? product.product_image_hover
    : null;

  useEffect(() => {
    if (!authService.isAuthenticated()) return;
    let cancelled = false;
    const sync = async () => {
      const map = await getWishlistProductMap();
      if (!cancelled) setInWishlist(map.has(Number(product.id)));
    };
    sync();
    const refresh = () => sync();
    window.addEventListener(WISHLIST_UPDATE_EVENT, refresh);
    return () => {
      cancelled = true;
      window.removeEventListener(WISHLIST_UPDATE_EVENT, refresh);
    };
  }, [product.id]);

  const flashToast = (text: string) => {
    setToast(text);
    setTimeout(() => setToast(null), 1800);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    const user = authService.getCurrentUser();
    if (!user?.id) {
      navigate('/login');
      return;
    }
    setBusy('cart');
    const res = await apiService.addToCart(user.id, Number(product.id), 1, 0, user.role);
    if (res.success) {
      dispatchCartUpdate();
      flashToast('Added to cart');
    } else if (res.alreadyExists) {
      flashToast('Already in cart');
    } else {
      flashToast(res.message || 'Could not add');
    }
    setBusy(false);
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    setBusy('wishlist');
    const previous = inWishlist;
    setInWishlist(!previous);
    const res = await toggleWishlistWithUpdate(Number(product.id));
    if (!res.success) {
      setInWishlist(previous);
      flashToast('Failed to update wishlist');
    }
    setBusy(false);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 14,
        border: "none",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: hovered ? "0 6px 24px rgba(0,0,0,0.10)" : "0 1px 6px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.2s, transform 0.2s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        fontFamily: SF,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        textDecoration: "none",
      }}
    >
      {/* Image area — full-bleed: image fills the tile with its own backdrop */}
      <div style={{ padding: 10 }}>
        <div style={{
          position: "relative",
          aspectRatio: "1/1",
          backgroundColor: "#eef0f3",
          borderRadius: 12,
          overflow: "hidden",
          boxSizing: "border-box",
        }}>
          {/* Primary image — covers the tile edge-to-edge */}
          <img
            src={product.product_image}
            alt={product.product_name}
            loading="lazy"
            decoding="async"
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              transform: hovered && !hoverImage ? "scale(1.05)" : "scale(1)",
              transition: "transform 0.35s ease",
            }}
          />
          {/* Hover (lifestyle) image — slides in from the right to cover the studio shot */}
          {hoverImage && (
            <img
              src={hoverImage}
              alt={product.product_name}
              loading="lazy"
              decoding="async"
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                objectFit: "cover",
                transform: hovered ? "translateX(0)" : "translateX(100%)",
                transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
                willChange: "transform",
                zIndex: 1,
              }}
            />
          )}

          {/* Action overlay — cart + heart, fades in on hover */}
          <div
            style={{
              position: "absolute",
              left: 0, right: 0, bottom: 12,
              display: "flex", gap: 10,
              alignItems: "center", justifyContent: "center",
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateY(0)" : "translateY(6px)",
              pointerEvents: hovered ? "auto" : "none",
              transition: "opacity 0.2s, transform 0.2s",
              zIndex: 2,
            }}
          >
            <button
              onClick={handleAddToCart}
              aria-label="Add to cart"
              disabled={busy === 'cart'}
              style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: busy === 'cart' ? 'wait' : 'pointer',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </button>
            <button
              onClick={handleToggleWishlist}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              disabled={busy === 'wishlist'}
              style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: busy === 'wishlist' ? 'wait' : 'pointer',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={inWishlist ? "#ef4444" : "none"} stroke={inWishlist ? "#ef4444" : "#111827"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>
          </div>

          {toast && (
            <div style={{
              position: "absolute", top: 10, left: 10, right: 10,
              textAlign: "center",
              background: "rgba(17,24,39,0.88)",
              color: "#fff",
              fontSize: 12, fontWeight: 600,
              padding: "6px 10px",
              borderRadius: 6,
              zIndex: 3,
            }}>
              {toast}
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div style={{
        padding: "6px 16px 16px",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}>
        <p style={{
          fontSize: 15, fontWeight: 700, color: "#111827",
          margin: "0 0 10px", lineHeight: 1.35,
          textAlign: "left",
          textTransform: "capitalize",
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {product.product_name}
        </p>

        {/* Price row — sale + MRP strikethrough, anchored to bottom of card */}
        {/* Prices come from the API in INR. format() converts + formats per currency. */}
        {/* inputIncludesGst: INR backend prices bake in 3% GST; for USD we strip that. */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12, marginTop: "auto" }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
            {format(product.price || 0, { inputIncludesGst: true })}
          </span>
          {mrp > 0 && (
            <span style={{ fontSize: 13, color: "#9ca3af", textDecoration: "line-through" }}>
              {format(mrp, { inputIncludesGst: true })}
            </span>
          )}
        </div>

        {/* Color swatches — matches ProductDetail style */}
        {availableSwatches.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            {availableSwatches.map(s => (
              <span
                key={s.key}
                title={s.label}
                aria-label={s.label}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: s.hex,
                  border: "2px solid #fff",
                  boxShadow: "0 0 0 2px rgba(0,0,0,0.12)",
                  display: "inline-block",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

/* ════════════════════════
   MAIN PAGE
════════════════════════ */
const PAGE_SIZE = 20; // How many products to render per "page"; user clicks "Load More" for the next batch

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const genderParam = searchParams.get('gender') || '';
  const searchQuery = searchParams.get('search') || '';

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    subcategories: [],
    genders: [],
    jewelleryTypes: [],
    goldTypes: [],
    minPrice: 0,
    maxPrice: 0,
    sortBy: "Default"
  });

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, productsData, comboData] = await Promise.all([
          apiService.getCategoriesWithSubcategories(),
          apiService.getProducts(),
          apiService.getComboProducts()
        ]);
        
        const mappedCombos: Product[] = comboData.map(c => ({
          id: `combo-${c.id}`,
          product_name: c.combo_name,
          product_image: c.combo_main_image,
          price: c.combo_total_price || 0,
          category_id: 0,
          is_combo: true,
          gender: c.combo_gender,
          description: c.combo_description
        }));
        
        const combinedProducts = [...productsData.products, ...mappedCombos];
        
        setCategories(categoriesData);
        setAllProducts(combinedProducts);
        setProducts(combinedProducts);
        
        // Set initial category filter from URL param
        if (categoryParam) {
          const categoryId = parseInt(categoryParam);
          setFilters(prev => ({
            ...prev,
            categories: [categoryId]
          }));
        }

        // Set initial gender filter from URL param (e.g. ?gender=Men from "Crafted for Him")
        if (genderParam) {
          const normalized =
            /^m/i.test(genderParam) ? "Men" :
            /^w|^f/i.test(genderParam) ? "Women" : "";
          if (normalized) {
            setFilters(prev => ({
              ...prev,
              genders: [normalized]
            }));
          }
        }
      } catch (err) {
        setError('Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryParam, genderParam]);

  // Once products load, align the max price filter to the catalog's actual ceiling.
  // Min stays at 0 so the slider's left edge always represents "no lower bound" —
  // this keeps zero-price ("price on request") products inside the active range.
  useEffect(() => {
    if (allProducts.length === 0) return;
    const priced = allProducts.filter(p => (p.price || 0) > 0);
    if (priced.length === 0) return;
    const catalogMax = Math.ceil(Math.max(...priced.map(p => p.price), 100000));
    setFilters(prev => ({
      ...prev,
      maxPrice: prev.maxPrice === 0 ? catalogMax : prev.maxPrice,
    }));
  }, [allProducts]);

  // Apply filters whenever filters change
  useEffect(() => {
    const applyFilters = async () => {
      let filtered = [...allProducts];
      
      // Apply search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(p => p.product_name.toLowerCase().includes(query));
      }
      
      // Apply category filter
      if (filters.categories.length > 0) {
        filtered = filtered.filter(p => filters.categories.includes(p.category_id));
      }
      
      // Apply subcategory filter (allow subcategory_id of 0)
      if (filters.subcategories.length > 0) {
        filtered = filtered.filter(p => p.subcategory_id != null && filters.subcategories.includes(p.subcategory_id));
      }

      // Apply gender filter
      if (filters.genders.length > 0) {
        filtered = filtered.filter(p => filters.genders.some(sel => matchGender(p.gender || "", sel)));
      }

      // Apply jewellery type filter (inclusive: "Gold" matches any gold product, even with diamonds)
      if (filters.jewelleryTypes.length > 0) {
        filtered = filtered.filter(p => {
          const metal = (p.metal_name || "").toLowerCase();
          const hasDiamond = Number(p.has_diamond) === 1;
          return filters.jewelleryTypes.some(t => {
            if (t === "Gold") return metal.includes("gold");
            if (t === "Diamonds") return hasDiamond;
            if (t === "Gold & Diamonds") return metal.includes("gold") && hasDiamond;
            return false;
          });
        });
      }

      // Apply gold type (color) filter — material_color now arrives with /getproducts
      if (filters.goldTypes.length > 0) {
        filtered = filtered.filter(p => {
          const pColor = (p.material_color || "").toLowerCase();
          if (!pColor) return false;
          return filters.goldTypes.some(g => {
            if (g === "Yellow Gold") return pColor.includes("yellow");
            if (g === "Rose Gold") return pColor.includes("pink") || pColor.includes("rose");
            if (g === "White Gold") return pColor.includes("white");
            return false;
          });
        });
      }
      
      // Apply price range filter — 0 on either bound means "not set yet (initial state)".
      // Keep "price on request" products (price <= 0) visible regardless of the slider —
      // they're not in any price bucket, so excluding them via min/max is wrong.
      filtered = filtered.filter(p => {
        if (!p.price || p.price <= 0) return true;
        if (filters.minPrice > 0 && p.price < filters.minPrice) return false;
        if (filters.maxPrice > 0 && p.price > filters.maxPrice) return false;
        return true;
      });
      
      // Apply sorting
      switch (filters.sortBy) {
        case "Price: Low to High":
          filtered.sort((a, b) => a.price - b.price);
          break;
        case "Price: High to Low":
          filtered.sort((a, b) => b.price - a.price);
          break;
        case "Name: A to Z":
          filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
          break;
        case "Name: Z to A":
          filtered.sort((a, b) => b.product_name.localeCompare(a.product_name));
          break;
        case "Newest First":
          filtered.sort((a, b) => Number(b.id) - Number(a.id));
          break;
        default:
          // Default sorting - no change
          break;
      }
      
      setProducts(filtered);
      setVisibleCount(PAGE_SIZE); // Reset to first page whenever filters change
    };

    applyFilters();
  }, [allProducts, searchQuery, filters]);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`;
    }
    
    if (filters.categories.length === 1) {
      const category = categories.find(c => c.id === filters.categories[0]);
      return category?.category_name || "Products";
    }
    
    if (filters.categories.length > 1) {
      return "Multiple Categories";
    }
    
    return "Sustainable Lab Created Diamond Rings";
  };

  const getPageDescription = () => {
    if (searchQuery) {
      return `Found ${products.length} products matching your search.`;
    }
    return `Discover beautifully crafted lab-created diamond rings designed for modern elegance. Each piece offers exceptional brilliance, ethical sourcing, and timeless style perfect for engagements, weddings, and special moments.`;
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#f9f9f7",
        padding: "40px 32px 60px",
        fontFamily: SF,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          Loading products...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#f9f9f7",
        padding: "40px 32px 60px",
        fontFamily: SF,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
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
        
        /* Mobile - Below 768px */
        @media (max-width: 768px) {
          .product-layout {
            flex-direction: column !important;
            gap: 24px !important;
          }
          .product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
          }
          .page-padding {
            padding: 24px 16px !important;
          }
        }
        
        /* Tablet - 768px to 1200px */
        @media (min-width: 769px) and (max-width: 1199px) {
          .product-layout {
            gap: 28px !important;
          }
          .product-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 16px !important;
          }
          .sidebar-desktop {
            width: 180px !important;
          }
          .page-padding {
            padding: 32px 24px !important;
          }
        }
        
        /* Very Small Mobile - Below 480px */
        @media (max-width: 480px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 8px !important;
          }
        }
      `}</style>
      <div style={{
        minHeight: "100vh",
        background: "#f9f9f7",
        padding: "40px 32px 60px",
        fontFamily: SF,
      }} className="page-padding">
        <div style={{ maxWidth: 1800, margin: "0 auto" }}>

          {/* Page heading */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h1 style={{
              fontFamily: SF, fontSize: 26, fontWeight: 700,
              color: "#111827", margin: "0 0 12px", letterSpacing: -0.3,
              textTransform: "capitalize",
            }}>
              {getPageTitle()}
            </h1>
            <p style={{
              fontFamily: SF, fontSize: 14, color: "#6b7280",
              maxWidth: 900, margin: "0 auto", lineHeight: 1.65,
            }}>
              {getPageDescription()}
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <div style={{ 
            display: 'none',
            marginBottom: 16,
            position: 'sticky' as any,
            top: 80,
            zIndex: 40,
            backgroundColor: '#f9f9f7',
            padding: '10px 0',
            marginTop: '-10px',
          }} className="sidebar-mobile">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontFamily: SF,
                fontSize: 14,
                fontWeight: 600,
                color: '#111827',
              }}
            >
              <span>Filters & Sorting</span>
              <ChevDown size={16} />
            </button>
          </div>

          {/* Layout: sidebar + grid */}
          <div style={{ display: "flex", gap: 36, alignItems: "flex-start" }} className="product-layout">
            <div className="sidebar-desktop" style={{ 
              display: 'block',
              position: 'sticky' as any,
              top: '100px', /* Offset for navbar/spacing */
              maxHeight: 'calc(100vh - 120px)', /* Viewport height minus spacing */
              overflowY: 'auto',
              scrollbarWidth: 'none', /* Firefox */
              msOverflowStyle: 'none' /* IE/Edge */
            }}>
              <style>{`
                .sidebar-desktop::-webkit-scrollbar {
                  display: none;
                }
              `}</style>
              <Sidebar
                allProducts={allProducts}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>
            
            {/* Mobile Sidebar (conditionally rendered) */}
            {isMobileFilterOpen && (
              <div className="sidebar-mobile" style={{ 
                position: 'fixed',
                inset: 0,
                zIndex: 50,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'block',
              }}>
                <div 
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '85%',
                    maxWidth: 320,
                    backgroundColor: '#f9f9f7',
                    padding: '20px',
                    overflowY: 'auto',
                    boxShadow: '-4px 0 12px rgba(0,0,0,0.1)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontFamily: SF, fontSize: 16, fontWeight: 700, color: '#111827' }}>Filters</h3>
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 8,
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                  <Sidebar
                    allProducts={allProducts}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                  />
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    style={{
                      width: '100%',
                      marginTop: 16,
                      padding: '12px',
                      background: GOLD,
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      fontFamily: SF,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
            
            {/* Product grid */}
            <main style={{ flex: 1, minWidth: 0 }}>
              {products.length > 0 ? (
                <>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 18,
                  }} className="product-grid">
                    {products.slice(0, visibleCount).map(p => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>

                  {visibleCount < products.length && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                      <button
                        onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                        style={{
                          padding: '12px 28px',
                          background: '#fff',
                          color: '#111827',
                          border: `1.5px solid ${GOLD}`,
                          borderRadius: 10,
                          fontSize: 14,
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: SF,
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = GOLD;
                          e.currentTarget.style.color = '#fff';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = '#fff';
                          e.currentTarget.style.color = '#111827';
                        }}
                      >
                        Load More ({products.length - visibleCount} remaining)
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '60px 0', background: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                  <h3 style={{ fontSize: 18, fontWeight: 600, color: '#111827', marginBottom: 8 }}>No products found</h3>
                  <p style={{ color: '#6b7280', fontSize: 14 }}>Try adjusting your search or filters to find what you're looking for.</p>
                  <button 
                    onClick={() => {
                      setFilters({
                        categories: [],
                        subcategories: [],
                        genders: [],
                        jewelleryTypes: [],
                        goldTypes: [],
                        minPrice: 0,
                        maxPrice: 0,
                        sortBy: "Default"
                      });
                      const url = new URL(window.location.href);
                      url.searchParams.delete('search');
                      url.searchParams.delete('category');
                      window.history.pushState({}, '', url.toString());
                    }}
                    style={{
                      marginTop: 20,
                      padding: '10px 24px',
                      background: GOLD,
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}