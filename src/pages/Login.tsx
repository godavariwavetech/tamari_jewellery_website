import { useState, useRef, useLayoutEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import backgroundImg from '../assets/login-background.jpg';
import logo from '../assets/logo-removebg.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('enter-mobile'); // 'enter-mobile' | 'verify-otp'
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useLayoutEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // First check user status
      const statusResponse = await apiService.checkUserStatus(mobileNumber);
      
      if (!statusResponse.success) {
        setError(statusResponse.message || 'Failed to check user status');
        return;
      }
      
      // Handle different user statuses
      switch (statusResponse.status) {
        case 'not_registered':
          setError('User not found. Please signup first.');
          setTimeout(() => navigate('/signup'), 2000);
          return;
          
        case 'pending':
          setError('Your signup request is pending admin approval. Please wait for approval.');
          return;
          
        case 'registered':
          // User is approved, proceed with OTP
          const otpResponse = await apiService.getUserLoginOTP(mobileNumber);
          
          if (otpResponse.success) {
            setStep('verify-otp');
          } else {
            setError(otpResponse.message || 'Failed to send OTP');
          }
          break;
          
        default:
          setError('Unknown user status. Please contact support.');
          return;
      }
    } catch (err) {
      setError('Failed to process login. Please try again.');
      console.error('Error in login process:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await apiService.customerLogin(mobileNumber, otpString);
      
      if (response.success) {
        // Store user data in localStorage
        if (response.user_id) {
          localStorage.setItem('userId', response.user_id.toString());
        }
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }
        
        // Navigate to home page
        navigate('/');
      } else {
        setError(response.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
      console.error('Error verifying OTP:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.nextSibling && element.value) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isMobile = windowWidth <= 1024;

  const maskedMobile = `******${mobileNumber.slice(-4)}`;

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      overflow: 'hidden',
      fontFamily: "'Times New Roman', Times, serif"
    }}>
      {/* Left Side - Logo and Background */}
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

      {/* Right Side - Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '40px 24px' : '40px',
        background: '#fff',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '500px',
          boxSizing: 'border-box'
        }}>
          {isMobile && (
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <img src={logo} alt="Tamiri Jewellers" style={{ width: '200px' }} />
            </div>
          )}

          {step === 'enter-mobile' && (
            <>
              <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#1a1a1a', marginBottom: '12px' }}>Welcome to Tamiri Jewellers</h1>
              <p style={{ fontSize: '18px', color: '#666', marginBottom: '28px' }}>Enter Mobile Number</p>
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
              <form onSubmit={handleMobileSubmit}>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter Mobile Number"
                  maxLength={10}
                  style={{
                    width: '100%',
                    height: '58px',
                    padding: '0 16px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    boxSizing: 'border-box',
                  }}
                />
                <p style={{ fontSize: '16px', color: '#888', marginBottom: '28px', textAlign: 'center' }}>
                  By continuing, I agree to <Link to="/terms" style={{ color: '#E4AC14', textDecoration: 'underline' }}>Terms of Use</Link> & <Link to="/privacy" style={{ color: '#E4AC14', textDecoration: 'underline' }}>Privacy Policy</Link>
                </p>
                <button 
                  type="submit" 
                  disabled={loading || mobileNumber.length < 10}
                  style={{
                    width: '100%',
                    height: '48px',
                    background: loading || mobileNumber.length < 10 ? '#ccc' : '#E4AC14',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: 600,
                    cursor: loading || mobileNumber.length < 10 ? 'not-allowed' : 'pointer',
                    marginBottom: '20px'
                  }}
                >
                  {loading ? 'Checking...' : 'Continue'}
                </button>
                
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ color: '#E4AC14', textDecoration: 'underline', fontWeight: 600 }}>
                      Sign up here
                    </Link>
                  </p>
                </div>
              </form>
            </>
          )}

          {step === 'verify-otp' && (
            <>
              <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#1a1a1a', marginBottom: '12px' }}>Verify With OTP</h1>
              <p style={{ fontSize: '18px', color: '#666', marginBottom: '28px' }}>Sent to {maskedMobile}</p>
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
                onClick={handleOtpSubmit}
                disabled={loading || otp.join('').length !== 6}
                style={{
                  width: '100%',
                  height: '48px',
                  background: loading || otp.join('').length !== 6 ? '#ccc' : '#E4AC14',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: loading || otp.join('').length !== 6 ? 'not-allowed' : 'pointer',
                  marginBottom: '20px'
                }}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
              <p style={{ fontSize: '16px', color: '#888', textAlign: 'center' }}>
                By continuing, I agree to <Link to="/terms" style={{ color: '#E4AC14', textDecoration: 'underline' }}>Terms of Use</Link> & <Link to="/privacy" style={{ color: '#E4AC14', textDecoration: 'underline' }}>Privacy Policy</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
