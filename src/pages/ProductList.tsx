import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { apiService, type Product, type CategoryWithSubcategories, type Subcategory } from "../services/api";

const SF = "-apple-system,'SF Pro Display','SF Pro Text',BlinkMacSystemFont,sans-serif";
const GOLD = "#c9a84c";

/* ── Chevron icon ── */
const ChevDown = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
);

/* ── Filter sections data ── */
const GOLD_TYPES = [
  { label: "Rose Gold", checked: false },
  { label: "White Gold", checked: false },
  { label: "Yellow Gold", checked: false },
];

interface FilterState {
  categories: number[];
  subcategories: number[];
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
        <span style={{ fontFamily: SF, fontSize: 13, color: "#374151" }}>{label}</span>
      </div>
      {count && <span style={{ fontFamily: SF, fontSize: 12, color: "#9ca3af" }}>({count})</span>}
    </label>
  );
}

/* ════════════════════════
   SIDEBAR
════════════════════════ */
function Sidebar({ 
  categories, 
  filters, 
  onFiltersChange 
}: { 
  categories: CategoryWithSubcategories[]; 
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}) {
  const [priceRangeOpen, setPriceRangeOpen] = useState(true);
  const [sortByOpen, setSortByOpen] = useState(true);
  
  const [availableSubcategories, setAvailableSubcategories] = useState<Subcategory[]>([]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (filters.categories.length > 0) {
        try {
          const subPromises = filters.categories.map(catId => apiService.getSubcategory(catId));
          const subResults = await Promise.all(subPromises);
          const allSubs = subResults.flat();
          setAvailableSubcategories(allSubs);
        } catch (error) {
          console.error('Failed to fetch subcategories:', error);
          setAvailableSubcategories([]);
        }
      } else {
        setAvailableSubcategories([]);
      }
    };
    fetchSubcategories();
  }, [filters.categories]);

  const maxPrice = 1000000;
  const minPriceLimit = 10000;
  
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

      {/* Categories */}
      <FilterSection title="Categories">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {categories.map((cat) => (
            <CheckRow 
              key={cat.id}
              label={cat.category_name} 
              checked={filters.categories.includes(cat.id)}
              onClick={() => handleCategoryToggle(cat.id)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Subcategories */}
      {filters.categories.length > 0 && availableSubcategories.length > 0 && (
        <FilterSection title="Subcategories">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {availableSubcategories.map((sub) => (
              <CheckRow 
                key={sub.id}
                label={sub.subcategory_name} 
                checked={filters.subcategories.includes(sub.id)}
                onClick={() => handleSubcategoryToggle(sub.id)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Gold Type */}
      <FilterSection title="Gold Type">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {GOLD_TYPES.map((g) => (
            <CheckRow 
              key={g.label} 
              label={g.label} 
              checked={filters.goldTypes.includes(g.label)}
              onClick={() => handleGoldTypeToggle(g.label)}
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
function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  
  // Generate a gradient background based on product ID
  const gradients = [
    "linear-gradient(135deg,#f8f4f0,#ede8e2)",
    "linear-gradient(135deg,#f0f0f4,#e4e4ec)",
    "linear-gradient(135deg,#faf0f0,#f0e4e4)",
    "linear-gradient(135deg,#f4f4f0,#eaeae0)",
    "linear-gradient(135deg,#fdf8ee,#f5edd6)",
    "linear-gradient(135deg,#f0f4f0,#e4eae4)",
  ];
  const bg = gradients[product.id % gradients.length];
  
  return (
    <Link
      to={`/product/${product.id}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #f0f0f0",
        overflow: "hidden",
        cursor: "pointer",
        boxShadow: hovered ? "0 6px 24px rgba(0,0,0,0.10)" : "0 1px 6px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.2s, transform 0.2s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        fontFamily: SF,
        display: "block",
        textDecoration: "none",
      }}
    >
      {/* Image area */}
      <div style={{
        aspectRatio: "1/1",
        background: bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 72,
        overflow: "hidden",
      }}>
        <img 
          src={product.product_image} 
          alt={product.product_name} 
          style={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover", 
            transform: hovered ? "scale(1.06)" : "scale(1)", 
            transition: "transform 0.25s" 
          }} 
        />
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px 14px" }}>
        <p style={{
          fontSize: 13, fontWeight: 600, color: "#111827",
          margin: "0 0 6px", lineHeight: 1.4,
          display: "-webkit-box", WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {product.product_name}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
            ₹{product.price?.toLocaleString('en-IN') || '0'}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ════════════════════════
   MAIN PAGE
════════════════════════ */
export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryWithSubcategories[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    subcategories: [],
    jewelleryTypes: [],
    goldTypes: [],
    minPrice: 10000,
    maxPrice: 1000000,
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
        const [categoriesData, productsData] = await Promise.all([
          apiService.getCategoriesWithSubcategories(),
          apiService.getProducts()
        ]);
        setCategories(categoriesData);
        setAllProducts(productsData.products);
        setProducts(productsData.products);
        
        // Set initial category filter from URL param
        if (categoryParam) {
          const categoryId = parseInt(categoryParam);
          setFilters(prev => ({
            ...prev,
            categories: [categoryId]
          }));
        }
      } catch (err) {
        setError('Failed to load data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryParam]);

  // Apply filters whenever filters change
  useEffect(() => {
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
    
    // Apply subcategory filter
    if (filters.subcategories.length > 0) {
      filtered = filtered.filter(p => p.subcategory_id && filters.subcategories.includes(p.subcategory_id));
    }

    // Apply gold type (color) filter
    if (filters.goldTypes.length > 0) {
      filtered = filtered.filter(p => {
        if (!p.material_color) return false;
        const pColor = p.material_color.toLowerCase();
        return filters.goldTypes.some(g => {
          if (g === "Yellow Gold") return pColor.includes("yellow");
          if (g === "Rose Gold") return pColor.includes("pink") || pColor.includes("rose");
          if (g === "White Gold") return pColor.includes("white");
          return false;
        });
      });
    }
    
    // Apply price range filter
    filtered = filtered.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);
    
    // Apply jewellery type filter (this would need to be based on product properties)
    // For now, we'll skip this as it requires product metadata
    
    // Apply gold type filter (this would need to be based on product properties)
    // For now, we'll skip this as it requires product metadata
    
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
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Default sorting - no change
        break;
    }
    
    setProducts(filtered);
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
    
    return "All Products";
  };

  const getPageDescription = () => {
    if (searchQuery) {
      return `Found ${products.length} products matching your search.`;
    }
    return `Discover our collection of ${products.length} beautiful jewellery pieces.`;
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
        
        /* Small Mobile - Below 480px */
        @media (max-width: 480px) {
          .product-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div style={{
        minHeight: "100vh",
        background: "#f9f9f7",
        padding: "40px 32px 60px",
        fontFamily: SF,
      }} className="page-padding">
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>

          {/* Page heading */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <h1 style={{
              fontFamily: SF, fontSize: 26, fontWeight: 700,
              color: "#111827", margin: "0 0 12px", letterSpacing: -0.3,
            }}>
              {getPageTitle()}
            </h1>
            <p style={{
              fontFamily: SF, fontSize: 14, color: "#6b7280",
              maxWidth: 680, margin: "0 auto", lineHeight: 1.65,
            }}>
              {getPageDescription()}
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <div style={{ display: 'none', marginBottom: 16 }} className="sidebar-mobile">
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
            <div className="sidebar-desktop" style={{ display: 'block' }}>
              <Sidebar 
                categories={categories}
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
                    categories={categories}
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
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: 18,
                }} className="product-grid">
                  {products.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
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
                        jewelleryTypes: [],
                        goldTypes: [],
                        minPrice: 10000,
                        maxPrice: 1000000,
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