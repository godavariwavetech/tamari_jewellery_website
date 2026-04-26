import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import { authService } from '../services/auth';
import { useCurrency } from '../context/CurrencyContext';
import { dispatchCartUpdate, dispatchWishlistUpdate, WISHLIST_UPDATE_EVENT } from '../utils/cartUtils';
import fallbackImg from "../assets/product-image.png";

const SF = "-apple-system,'SF Pro Display','SF Pro Text',BlinkMacSystemFont,sans-serif";
const GOLD = "#E4AC14";

const X = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

interface WishlistItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  price: number;
  wishlist_item_id: number;
}

const Wishlist = () => {
  const navigate = useNavigate();
  const { format } = useCurrency(); // INR → active currency (INR/USD)
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; kind: 'ok' | 'err' } | null>(null);
  const [busyCart, setBusyCart] = useState<number | null>(null);

  const showToast = (text: string, kind: 'ok' | 'err') => {
    setToast({ text, kind });
    setTimeout(() => setToast(null), 2200);
  };

  useEffect(() => {
    fetchWishlistItems();
    const refresh = () => fetchWishlistItems();
    window.addEventListener(WISHLIST_UPDATE_EVENT, refresh);
    return () => window.removeEventListener(WISHLIST_UPDATE_EVENT, refresh);
  }, []);

  const fetchWishlistItems = async () => {
    const user = authService.getCurrentUser();
    if (!user) { setLoading(false); return; }

    try {
      setLoading(true);
      const response = await apiService.getWishlist(user.id, user.role);
      if (response.success && response.data) {
        const list: WishlistItem[] = response.data.map((item: any) => ({
          id: item.product_id,
          product_id: item.product_id,
          product_name: item.product_name,
          product_image: item.product_image,
          price: item.price || item.total_price || 0,
          wishlist_item_id: item.wishlist_id ?? item.id,
        }));
        setItems(list);
      } else {
        setItems([]);
      }
    } catch (err) {
      setError('Failed to load wishlist items');
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (item: WishlistItem) => {
    const user = authService.getCurrentUser();
    if (!user) return;
    const previous = items;
    setItems(prev => prev.filter(i => i.id !== item.id));
    const res = await apiService.deleteWishlistItem(user.id, item.wishlist_item_id);
    if (res.success) {
      dispatchWishlistUpdate();
    } else {
      setItems(previous);
      showToast('Failed to remove from wishlist', 'err');
    }
  };

  const addToCart = async (item: WishlistItem) => {
    const user = authService.getCurrentUser();
    if (!user) { navigate('/login'); return; }
    setBusyCart(item.id);
    const res = await apiService.addToCart(user.id, item.product_id, 1, 0, user.role);
    if (res.success) {
      dispatchCartUpdate();
      showToast('Added to cart', 'ok');
    } else if (res.alreadyExists) {
      showToast(res.message || 'Already in your cart', 'err');
    } else {
      showToast(res.message || 'Failed to add to cart', 'err');
    }
    setBusyCart(null);
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f9f9f7', minHeight: '100vh', fontFamily: SF, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#666' }}>Loading wishlist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#f9f9f7', minHeight: '100vh', fontFamily: SF, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#e74c3c' }}>{error}</div>
      </div>
    );
  }

  if (!authService.isAuthenticated()) {
    return (
      <div style={{ backgroundColor: '#f9f9f7', minHeight: '100vh', fontFamily: SF, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <p>Please login to view your wishlist</p>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: GOLD, color: '#fff', border: 'none', borderRadius: 8,
              padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 12
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f9f9f7', minHeight: '100vh', fontFamily: SF }}>
      <style>{`
        .wl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 18px;
        }
        @media (max-width: 480px) { .wl-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
      `}</style>

      {toast && (
        <div style={{
          position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
          padding: '10px 18px', borderRadius: 8, fontSize: 14, fontWeight: 600,
          background: toast.kind === 'ok' ? '#dcfce7' : '#fee2e2',
          color: toast.kind === 'ok' ? '#166534' : '#991b1b',
          boxShadow: '0 4px 14px rgba(0,0,0,0.12)', zIndex: 1000,
        }}>
          {toast.text}
        </div>
      )}

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{
          fontFamily: SF, fontSize: 28, fontWeight: 700, color: '#111827',
          textAlign: 'center', margin: '0 0 36px', letterSpacing: -0.3,
        }}>
          My Wishlist
        </h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#6b7280', fontSize: 15, paddingTop: 60 }}>
            Your wishlist is empty.
          </div>
        ) : (
          <div className="wl-grid">
            {items.map(item => {
              // Real MRP from product.actual_price — no fake 12% markup.
              const mrp = Number((item as any).actual_price || 0) > Number(item.price || 0)
                ? Number((item as any).actual_price)
                : 0;
              return (
                <div key={item.id} style={{
                  background: '#fff',
                  borderRadius: 14,
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 6px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                  {/* × Remove button */}
                  <button
                    onClick={() => removeItem(item)}
                    aria-label="Remove from wishlist"
                    style={{
                      position: 'absolute', top: 12, right: 12,
                      width: 28, height: 28, borderRadius: '50%',
                      background: '#fff', border: '1.5px solid #d1d5db',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', zIndex: 2,
                      transition: 'background 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.borderColor = '#f87171'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#d1d5db'; }}
                  >
                    <X size={14} />
                  </button>

                  {/* Image — full-bleed, click goes to detail page */}
                  <Link to={`/product/${item.product_id}`} style={{ display: 'block', textDecoration: 'none' }}>
                    <div style={{
                      position: 'relative',
                      aspectRatio: '1/1',
                      backgroundColor: '#eef0f3',
                      overflow: 'hidden',
                    }}>
                      <img
                        src={item.product_image || fallbackImg}
                        alt={item.product_name}
                        loading="lazy"
                        decoding="async"
                        style={{
                          position: 'absolute', inset: 0,
                          width: '100%', height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div style={{ padding: '12px 12px 14px', display: 'flex', flexDirection: 'column', alignItems: 'stretch', flex: 1 }}>
                    <p style={{
                      fontFamily: SF, fontSize: 13, fontWeight: 700, color: '#111827',
                      margin: '0 0 6px', lineHeight: 1.35, textAlign: 'left',
                      textTransform: 'capitalize',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                      overflow: 'hidden', minHeight: '2.7em',
                    }}>
                      {item.product_name}
                    </p>

                    {/* Prices stored in INR; format() converts + formats to active currency */}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                        {format(item.price, { inputIncludesGst: true })}
                      </span>
                      {mrp > 0 && (
                        <span style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'line-through' }}>
                          {format(mrp, { inputIncludesGst: true })}
                        </span>
                      )}
                    </div>

                    {/* Full-width ADD TO CART */}
                    <button
                      onClick={() => addToCart(item)}
                      disabled={busyCart === item.id}
                      style={{
                        width: '100%', marginTop: 'auto',
                        background: GOLD, color: '#fff',
                        border: 'none', borderRadius: 8,
                        padding: '9px 0',
                        fontSize: 11.5, fontWeight: 700, letterSpacing: 0.8,
                        textTransform: 'uppercase', cursor: busyCart === item.id ? 'wait' : 'pointer',
                        opacity: busyCart === item.id ? 0.7 : 1,
                        fontFamily: SF,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { if (busyCart !== item.id) e.currentTarget.style.background = '#c8900e'; }}
                      onMouseLeave={e => e.currentTarget.style.background = GOLD}
                    >
                      {busyCart === item.id ? 'Adding…' : 'ADD TO CART'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
