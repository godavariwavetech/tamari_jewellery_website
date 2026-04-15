import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { authService } from "../services/auth";
import product from "../assets/product.png";

const SF = "-apple-system,'SF Pro Display','SF Pro Text',BlinkMacSystemFont,sans-serif";
const GOLD = "#e6a817";

interface CartItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  sku_id?: string;
  metal_name?: string;
  material_color?: string;
  size?: string;
  diamond_clarity?: string;
  gross_weight?: string;
  net_weight?: string;
  diamond_weight?: string;
}

/* ── Icons ── */
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

/* ── Ring product image placeholder ── */
const RingImage = ({ isMobile }: { isMobile?: boolean }) => (
  <div style={{ 
    width: isMobile ? 80 : 100, 
    height: isMobile ? 80 : 100, 
    borderRadius: 8, 
    background: "#f3f4f6", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden"
  }}>
    <img src={product} alt="Product Image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </div>
);

/* ── Initial cart data ── */
const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

/* ════════════════════════
   CART ITEM ROW
════════════════════════ */
type CartItemProps = {
  item: CartItem;
  isMobile: boolean;
  onQtyChange: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
};

function CartItem({ item, isMobile, onQtyChange, onRemove }: CartItemProps) {
  const total = item.price * item.quantity;

  if (isMobile) {
    return (
      <div style={{
        padding: "20px 0",
        borderBottom: "1px solid #e5e7eb",
        fontFamily: SF,
      }}>
        <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
          <div style={{ 
            width: 80, 
            height: 80, 
            borderRadius: 8, 
            background: "#f3f4f6", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden"
          }}>
            <img src={item.product_image || product} alt="Product Image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 6px", lineHeight: 1.4 }}>
              {item.product_name}
            </p>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 4px" }}>SKU: {item.sku_id || 'N/A'}</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: GOLD }}>{fmt(item.price)}</p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{
            display: "flex", alignItems: "center",
            border: "1.5px solid #d1d5db", borderRadius: 8,
            overflow: "hidden",
          }}>
            <button
              onClick={() => onQtyChange(item.id, Math.max(1, item.quantity - 1))}
              style={{ width: 32, height: 32, background: "#fff", border: "none", fontSize: 16, cursor: "pointer" }}
            >−</button>
            <span style={{ minWidth: 30, textAlign: "center", fontSize: 13, fontWeight: 600 }}>{item.quantity}</span>
            <button
              onClick={() => onQtyChange(item.id, item.quantity + 1)}
              style={{ width: 32, height: 32, background: "#fff", border: "none", fontSize: 16, cursor: "pointer" }}
            >+</button>
          </div>
          
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer" }}>
              <TrashIcon />
            </button>
            <button style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer" }}>
              <HeartIcon />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 100px 140px 100px 80px",
      alignItems: "center",
      padding: "32px 0",
      borderBottom: "1px solid #e5e7eb",
      gap: 16,
      fontFamily: SF,
    }}>
      {/* Product */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{ 
          width: 100, 
          height: 100, 
          borderRadius: 8, 
          background: "#f3f4f6", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          flexShrink: 0,
          overflow: "hidden"
        }}>
          <img src={item.product_image || product} alt="Product Image" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: 0, lineHeight: 1.4 }}>
            {item.product_name}
          </p>
          <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>SKU: {item.sku_id || 'N/A'}</p>
          {item.metal_name && <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>Metal: {item.metal_name} {item.material_color}</p>}
          {item.size && <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>Size: {item.size}</p>}
          {item.diamond_clarity && <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>Diamond: {item.diamond_clarity}</p>}
          {item.gross_weight && <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>GWT: {item.gross_weight}</p>}
          {item.net_weight && <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>NWT: {item.net_weight}</p>}
          {item.diamond_weight && <p style={{ fontSize: 11, color: "#6b7280", margin: 0 }}>DWT: {item.diamond_weight}</p>}
        </div>
      </div>

      {/* Unit Price */}
      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", textAlign: "center" }}>
        {fmt(item.price)}
      </div>

      {/* Quantity stepper */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{
          display: "flex", alignItems: "center",
          border: "1px solid #d1d5db", borderRadius: 6,
          overflow: "hidden", userSelect: "none",
        }}>
          <button
            onClick={() => onQtyChange(item.id, Math.max(1, item.quantity - 1))}
            style={{
              width: 30, height: 30, background: "#fff", border: "none",
              fontSize: 18, cursor: "pointer", color: "#374151",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >−</button>
          <span style={{
            minWidth: 32, textAlign: "center", fontSize: 13, fontWeight: 600,
            color: "#111827", borderLeft: "1px solid #d1d5db", borderRight: "1px solid #d1d5db",
            padding: "0 8px", lineHeight: "30px",
          }}>{item.quantity}</span>
          <button
            onClick={() => onQtyChange(item.id, item.quantity + 1)}
            style={{
              width: 30, height: 30, background: "#fff", border: "none",
              fontSize: 18, cursor: "pointer", color: "#374151",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >+</button>
        </div>
      </div>

      {/* Item Total */}
      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", textAlign: "center" }}>
        {fmt(total)}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
          <EditIcon />
        </button>
        <button style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
          <HeartIcon />
        </button>
        <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
          <TrashIcon />
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════
   SUMMARY PANEL
════════════════════════ */
function Summary({ subtotal, isMobile }: { subtotal: number; isMobile?: boolean }) {
  return (
    <div style={{
      borderRadius: 14, overflow: "hidden",
      border: "1px solid #e5e7eb",
      position: isMobile ? 'static' : "sticky", top: 24,
      fontFamily: SF,
      marginTop: isMobile ? 24 : 0
    }}>
      {/* Gold header */}
      <div style={{
        background: GOLD, padding: "14px 20px",
      }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: 0.8, textTransform: "uppercase" }}>
          SUMMARY
        </h2>
      </div>

      <div style={{ background: "#fff", padding: "20px 20px 24px" }}>
        {[
          { label: "Subtotal",     value: fmt(subtotal) },
          { label: "Shipping Fee", value: "₹0" },
        ].map(r => (
          <div key={r.label} style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: 12,
          }}>
            <span style={{ fontSize: 14, color: "#374151" }}>{r.label}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{r.value}</span>
          </div>
        ))}

        <div style={{ height: 1, background: "#e5e7eb", margin: "14px 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>Order Total</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{fmt(subtotal)}</span>
        </div>

        <button style={{
          width: "100%", background: GOLD, color: "#fff",
          border: "none", borderRadius: 8, padding: "13px 0",
          fontSize: 13, fontWeight: 700, letterSpacing: 1,
          textTransform: "uppercase", cursor: "pointer",
        }}>
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════
   ROOT CART PAGE
════════════════════════ */
export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const user = authService.getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.getCartItems(user.id);
      if (response.success && response.data) {
        const cartItems: CartItem[] = response.data.map((item: any) => ({
          id: item.id,
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          price: item.price || item.total_price,
          quantity: item.quantity,
          sku_id: item.sku_id,
          metal_name: item.metal_name,
          material_color: item.material_color,
          size: item.size,
          diamond_clarity: item.diamond_clarity,
          gross_weight: item.gross_weight,
          net_weight: item.net_weight,
          diamond_weight: item.diamond_weight,
        }));
        setItems(cartItems);
      }
    } catch (err) {
      setError('Failed to load cart items');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const isMobile = windowWidth < 768;

  const handleQtyChange = async (id: number, qty: number) => {
    const user = authService.getCurrentUser();
    if (!user) return;

    try {
      // Update locally first for immediate feedback
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
      
      // Then update on server
      const item = items.find(i => i.id === id);
      if (item) {
        await apiService.addToCart(user.id, item.product_id, qty);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      // Revert on error
      fetchCartItems();
    }
  };

  const handleRemove = async (id: number) => {
    const user = authService.getCurrentUser();
    if (!user) return;

    try {
      // Update locally first
      setItems(prev => prev.filter(i => i.id !== id));
      
      // Then remove from server
      await apiService.deleteCartItem(user.id, id);
    } catch (error) {
      console.error('Failed to remove item:', error);
      // Revert on error
      fetchCartItems();
    }
  };

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const COL = { fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase" };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#f9f9f7",
        padding: isMobile ? "24px 16px" : "40px 40px 60px", fontFamily: SF,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#666' }}>Loading cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: "100vh", background: "#f9f9f7",
        padding: isMobile ? "24px 16px" : "40px 40px 60px", fontFamily: SF,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#e74c3c' }}>{error}</div>
      </div>
    );
  }

  if (!authService.isAuthenticated()) {
    return (
      <div style={{
        minHeight: "100vh", background: "#f9f9f7",
        padding: isMobile ? "24px 16px" : "40px 40px 60px", fontFamily: SF,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <p>Please login to view your cart</p>
          <button 
            onClick={() => window.location.href = '/login'}
            style={{
              background: GOLD, color: '#fff', border: 'none', borderRadius: 8,
              padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer'
            }}
          >
            Login
          </button>
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
      `}</style>
      <div style={{
        minHeight: "100vh", background: "#f9f9f7",
        padding: isMobile ? "24px 16px" : "40px 40px 60px", fontFamily: SF,
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>

          <h1 style={{
            fontSize: isMobile ? 24 : 28, fontWeight: 700, color: "#111827",
            textAlign: "center", margin: "0 0 32px", letterSpacing: -0.3,
          }}>
            Shopping in Cart
          </h1>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 280px", gap: isMobile ? 24 : 40, alignItems: "flex-start" }}>

            {/* Left: items table */}
            <div>
              {!isMobile && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 100px 140px 100px 80px",
                  gap: 16, padding: "0 0 14px",
                  borderBottom: "1.5px solid #e5e7eb",
                }}>
                  <div style={COL}>Product</div>
                  <div style={{ ...COL, textAlign: "center" }}>Unit Price</div>
                  <div style={{ ...COL, textAlign: "center" }}>Quantity</div>
                  <div style={{ ...COL, textAlign: "center" }}>Item Total</div>
                  <div style={{ ...COL, textAlign: "center" }}>Action</div>
                </div>
              )}

              {items.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af", fontSize: 15 }}>
                  Your cart is empty.
                </div>
              ) : (
                items.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    isMobile={isMobile}
                    onQtyChange={handleQtyChange}
                    onRemove={handleRemove}
                  />
                ))
              )}
            </div>

            {/* Right: summary */}
            <Summary subtotal={subtotal} isMobile={isMobile} />
          </div>
        </div>
      </div>
    </>
  );
}