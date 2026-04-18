import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { authService } from '../services/auth';
import product from "../assets/product-image.png";
const X = ({ size = 24, color = 'currentColor', strokeWidth = 2, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ShoppingCart = ({ size = 24, color = 'currentColor', strokeWidth = 2, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

interface WishlistItem {
  id: number;
  product_id: number;
  product_name: string;
  price: number;
  product_image: string;
  wishlist_item_id: number;
}

const Wishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const fetchWishlistItems = async () => {
    const user = authService.getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.getWishlist(user.id);
      if (response.success && response.data) {
        const wishlistItems: WishlistItem[] = response.data.map((item: any) => ({
          id: item.product_id,
          product_id: item.product_id,
          product_name: item.product_name,
          price: item.price || item.total_price,
          product_image: item.product_image,
          wishlist_item_id: item.id,
        }));
        setItems(wishlistItems);
      }
    } catch (err) {
      setError('Failed to load wishlist items');
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id: number) => {
    const user = authService.getCurrentUser();
    if (!user) return;

    try {
      const item = items.find(i => i.id === id);
      if (!item) return;

      // Update locally first
      setItems((prev) => prev.filter((item) => item.id !== id));
      
      // Then remove from server
      await apiService.deleteWishlistItem(user.id, item.wishlist_item_id);
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      // Revert on error
      fetchWishlistItems();
    }
  };

  const addToCart = async (item: WishlistItem) => {
    const user = authService.getCurrentUser();
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      await apiService.addToCart(user.id, item.product_id, 1);
      alert('Item added to cart successfully!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f5f5f3', minHeight: '100vh', fontFamily: "'Cormorant Garamond', Georgia, serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#666' }}>Loading wishlist...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#f5f5f3', minHeight: '100vh', fontFamily: "'Cormorant Garamond', Georgia, serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#e74c3c' }}>{error}</div>
      </div>
    );
  }

  if (!authService.isAuthenticated()) {
    return (
      <div style={{ backgroundColor: '#f5f5f3', minHeight: '100vh', fontFamily: "'Cormorant Garamond', Georgia, serif", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <p>Please login to view your wishlist</p>
          <button 
            onClick={() => window.location.href = '/login'}
            style={{
              background: '#c9960c', color: '#fff', border: 'none', borderRadius: 8,
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
    <div
      style={{ backgroundColor: '#f5f5f3', minHeight: '100vh', fontFamily: "'Cormorant Garamond', Georgia, serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Jost:wght@300;400;500&display=swap');

        .wishlist-card {
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          transition: box-shadow 0.25s ease, transform 0.25s ease;
        }
        .wishlist-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
          transform: translateY(-3px);
        }
        .remove-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 1.5px solid #d1d1d1;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          z-index: 2;
        }
        .remove-btn:hover {
          background: #fee2e2;
          border-color: #f87171;
        }
        .img-wrap {
          background: #f5f5f3;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px 20px 20px;
          height: 220px;
        }
        .img-wrap img {
          max-height: 160px;
          max-width: 100%;
          object-fit: contain;
        }
        .card-body {
          padding: 16px 16px 18px;
        }
        .card-name {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 15px;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 1.4;
          margin-bottom: 10px;
          text-align: center;
        }
        .price-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .price-sale {
          font-family: 'Jost', sans-serif;
          font-size: 15px;
          font-weight: 500;
          color: #1a1a1a;
        }
        .price-original {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: #aaa;
          text-decoration: line-through;
        }
        .add-cart-btn {
          width: 100%;
          background: #c9960c;
          color: #fff;
          border: none;
          border-radius: 6px;
          padding: 11px 0;
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s;
        }
        .add-cart-btn:hover {
          background: #b8850a;
        }
        .grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 22px;
        }
        @media (max-width: 1100px) {
          .grid-4 { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .grid-4 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .grid-4 { grid-template-columns: 1fr; }
        }
        .page-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 34px;
          font-weight: 700;
          color: #1a1a1a;
          text-align: center;
          margin-bottom: 36px;
          letter-spacing: 0.01em;
        }
      `}</style>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
        <h1 className="page-title">My Wishlist</h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', fontFamily: "'Jost', sans-serif", fontSize: 16, paddingTop: 60 }}>
            Your wishlist is empty.
          </div>
        ) : (
          <div className="grid-4">
            {items.map((item) => (
              <div className="wishlist-card" key={item.id}>
                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove item"
                >
                  <X size={14} color="#555" strokeWidth={2.5} />
                </button>

                <div className="img-wrap">
                  <img src={item.product_image || product} alt={item.product_name} />
                </div>

                <div className="card-body">
                  <p className="card-name">{item.product_name}</p>

                  <div className="price-row">
                    <span className="price-sale">₹{item.price.toLocaleString('en-IN')}</span>
                  </div>

                  <button className="add-cart-btn" onClick={() => addToCart(item)}>
                    <ShoppingCart size={15} strokeWidth={2} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;