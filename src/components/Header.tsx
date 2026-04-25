import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ContactUsPopup from './ContactUsPopup';
import AppointmentPopup from './AppointmentPopup';
import CurrencySelector from './CurrencySelector';
import { authService } from '../services/auth';
import { CART_UPDATE_EVENT, getCurrentCartCount } from '../utils/cartUtils';
import headerBg from '../assets/header-bg.jpeg';
import Contact from '../assets/contact.png';
import Appoint from '../assets/Appoint.png'
import ProfileIcon from "../assets/profile.png"
import CartIcoin from "../assets/cart.png"
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

const SF = "-apple-system,'SF Pro Display','SF Pro Text',BlinkMacSystemFont,sans-serif";

const Header = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(authService.getCurrentUser());
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 1024; // Use 1024px for standard tablet/desktop transition
console.log(user,"userrrrrrrrrrrr")
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

  // Logout moved to Profile page sidebar
  // const handleLogout = () => {
  //   authService.logout();
  //   setUser(null);
  //   setCartCount(0);
  // };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear search input after navigation
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // Responsive values based on screen width
  const gapSize = width < 1280 ? '16px' : '32px';
  const marginSize = width < 1280 ? '0 15px' : '0 32px';

  return (
    <>
      {/* Desktop Header Only - Mobile view handled by Navbar */}
      {!isMobile && (
        <div 
          style={{ 
            position: 'relative', 
            zIndex: 1500, // above sticky Navbar (1000) so dropdowns (CurrencySelector) don't hide behind it 
            background: `url(${headerBg}) no-repeat center center`,
            backgroundSize: 'cover',
            fontFamily: SF,
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}
        >
          <div style={{ maxWidth: '1700px', margin: '0 auto', padding: width < 1280 ? '10px 16px' : '0px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', height:"80px" }}>
                  <img
                    src="/tamiri-logo.png"
                    alt="TAMIRI"
                  />
                </Link>
              </div>

              {/* Center Section - Contact and Appointment */}
              <div style={{ display: 'flex', alignItems: 'center', gap: gapSize, flexShrink: 0 }}>
                <button 
                  onClick={() => setIsContactOpen(true)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    color: '#6b7280', 
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.2s' 
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#E4AC14'}
                  onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                >
                  {/* <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg> */}
                  <img src={Contact} style={{width:"20px", height:"20px"}}></img>
                  <span style={{ fontSize: '15px', fontWeight: '500', fontFamily: 'inherit' }}>Contact us</span>
                </button>
                
                <button 
                  onClick={() => setIsAppointmentOpen(true)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    color: '#6b7280', 
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'all 0.2s' 
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#E4AC14'}
                  onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
                >
                  {/* <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 7V3M16 7V3M7 11H17M5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg> */}
                  <img src={Appoint} style={{width:"20px", height:"20px"}}></img>
                  <span style={{ fontSize: '15px', fontWeight: '500', fontFamily: 'inherit' }}>Appointment</span>
                </button>

                {/* Currency selector (INR / USD) — drives every price on the site via CurrencyContext */}
                <CurrencySelector />
              </div>

              {/* Search Bar */}
              <div style={{ flex: 1, maxWidth: '500px', margin: marginSize, transition: 'all 0.3s' }}>
                <form onSubmit={handleSearch} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    position: 'absolute',
                    left: '15px',
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    pointerEvents: 'none'
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search Your favourite Jewellery..."
                    style={{
                      width: '100%',
                      padding: '10px 15px 10px 45px',
                      borderRadius: '9999px',
                      border: '1px solid #d1d5db',
                      outline: 'none',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.2s, box-shadow 0.2s'
                    }}
                    onFocus={e => {
                      e.currentTarget.style.borderColor = '#E4AC14';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(228, 172, 20, 0.1)';
                    }}
                    onBlur={e => {
                      e.currentTarget.style.borderColor = '#d1d5db';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                    }}
                  />
                </form>
              </div>

              {/* Right Section - Icons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: width < 1280 ? '8px' : '16px', flexShrink: 0 }}>
                {/* User Authentication */}
                {user ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link to="/profile" style={{ 
                      padding: '8px', 
                      borderRadius: '9999px', 
                      transition: 'all 0.2s', 
                      color: '#E4AC14', 
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(228, 172, 20, 0.1)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* <svg width="25" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg> */}
                      <img src={ProfileIcon} style={{width:"20px", height:"20px"}}></img>
                      {width >= 1280 && (
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                          {user.name || ''}
                        </span>
                      )}
                    </Link>
                    
                    {/* Logout moved to Profile page sidebar
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
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#E4AC14';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#E4AC14';
                      }}
                    >
                      Logout
                    </button>
                    */}
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link to="/login" style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #E4AC14',
                      background: 'transparent',
                      color: '#E4AC14',
                      fontSize: '12px',
                      fontWeight: '500',
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#E4AC14';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#E4AC14';
                      }}
                    >
                      Login
                    </Link>
                    
                    <Link to="/signup" style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      background: '#E4AC14',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '500',
                      textDecoration: 'none',
                      transition: 'all 0.2s'
                    }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#d4941a'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = '#E4AC14'}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
                
                {/* Cart with Count Badge */}
                <Link to="/cart" style={{ 
                  padding: '8px', 
                  borderRadius: '9999px', 
                  transition: 'all 0.2s', 
                  color: '#E4AC14', 
                  textDecoration: 'none',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(228, 172, 20, 0.1)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {/* <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.3 15.7 4.6 16.5 5.1 16.5H17M17 13V17C17 17.5304 17.2107 18.0391 17.5858 18.4142C17.9609 18.7893 18.4696 19 19 19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V13M9 19.5C9.82843 19.5 10.5 20.1716 10.5 21C10.5 21.8284 9.82843 22.5 9 22.5C8.17157 22.5 7.5 21.8284 7.5 21C7.5 20.1716 8.17157 19.5 9 19.5ZM20 19.5C20.8284 19.5 21.5 20.1716 21.5 21C21.5 21.8284 20.8284 22.5 20 22.5C19.1716 22.5 18.5 21.8284 18.5 21C18.5 20.1716 19.1716 19.5 20 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg> */}
                  <img src={CartIcoin} style={{width:"20px", height:"20px"}}></img>
                  {cartCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      backgroundColor: '#ff4444',
                      color: 'white',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      fontSize: '10px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '18px'
                    }}>
                      {cartCount > 99 ? '99+' : cartCount}
                    </span>
                  )}
                </Link>
                
                <Link to="/wishlist" style={{ padding: '8px', borderRadius: '9999px', transition: 'all 0.2s', color: '#E4AC14', textDecoration: 'none' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(228, 172, 20, 0.1)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L4.22 13.45L12 21.23L19.78 13.45L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7563 5.72723 21.351 5.1208 20.84 4.61V4.61Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Popups rendered outside the sticky header to avoid stacking context issues */}
      <ContactUsPopup isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <AppointmentPopup isOpen={isAppointmentOpen} onClose={() => setIsAppointmentOpen(false)} />
    </>
  );
};

export default Header;
