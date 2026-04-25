import { useState, useRef, useLayoutEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth';
import type { AccountRole } from '../services/api';
import backgroundImg from '../assets/login-background.jpg';
import logo from '../assets/logo-removebg.png';

const OTPVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mobileNumber: string = location.state?.mobileNumber || '';
  const role: AccountRole = (location.state?.role === 'b2b' ? 'b2b' : 'b2c') as AccountRole;

  const [otp, setOtp] = useState(new Array(4).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useLayoutEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redirect if no mobile number passed
  if (!mobileNumber) {
    navigate('/login');
    return null;
  }

  const maskedMobile = `******${mobileNumber.slice(-4)}`;
  const isMobile = windowWidth <= 1024;

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setError('Please enter the complete OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await authService.login(mobileNumber, otpString, role);

      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      overflow: 'hidden',
      fontFamily: "'Times New Roman', Times, serif"
    }}>
      {/* Left Side */}
      {!isMobile && (
        <div style={{
          flex: '0 0 40%',
          minWidth: '400px',
          height: '100vh',
          background: `url(${backgroundImg}) no-repeat center center`,
          backgroundSize: 'cover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(3px)'
          }} />
          <img src={logo} alt="Tamiri Jewellers" style={{ width: '320px', zIndex: 1 }} />
        </div>
      )}

      {/* Right Side */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '40px 24px' : '40px',
        background: '#fff',
        boxSizing: 'border-box'
      }}>
        <div style={{ width: '100%', maxWidth: '500px', boxSizing: 'border-box' }}>
          {isMobile && (
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <img src={logo} alt="Tamiri Jewellers" style={{ width: '200px' }} />
            </div>
          )}

          <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#1a1a1a', marginBottom: '12px' }}>
            Verify With OTP
          </h1>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '28px' }}>
            Sent to {maskedMobile}
          </p>

          {error && (
            <div style={{
              background: '#fee2e2',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '28px' }}>
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={data}
                onChange={e => handleOtpChange(e.target, index)}
                onKeyDown={e => handleKeyDown(e, index)}
                ref={el => { inputRefs.current[index] = el; }}
                style={{
                  width: '48px',
                  height: '48px',
                  textAlign: 'center',
                  fontSize: '20px',
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                }}
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={loading || otp.join('').length !== 4}
            style={{
              width: '100%',
              height: '48px',
              background: loading || otp.join('').length !== 4 ? '#ccc' : '#E4AC14',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 600,
              cursor: loading || otp.join('').length !== 6 ? 'not-allowed' : 'pointer',
              marginBottom: '20px'
            }}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>

          <p style={{ fontSize: '16px', color: '#888', textAlign: 'center' }}>
            By continuing, I agree to{' '}
            <Link to="/terms" style={{ color: '#E4AC14', textDecoration: 'underline' }}>Terms of Use</Link>
            {' '}& {' '}
            <Link to="/privacy" style={{ color: '#E4AC14', textDecoration: 'underline' }}>Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
