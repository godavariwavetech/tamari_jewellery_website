import React, { useState } from 'react';
import { apiService } from '../services/api';

interface AppointmentPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentPopup: React.FC<AppointmentPopupProps> = ({ isOpen, onClose }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[A-Za-z ]*$/.test(value)) {
      setName(value);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setMobileNumber(value);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9@._%+-]*$/.test(value)) {
      setEmail(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData(e.currentTarget);
      const appointmentData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        mobile_number: formData.get('mobile_number') as string,
        date: formData.get('date') as string,
        time: formData.get('time') as string,
        about_appoint: formData.get('about_appoint') as string,
        purity: formData.get('purity') as string,
        dimond_type: formData.get('dimond_type') as string,
        jew_cate: formData.get('jew_cate') as string,
        purpose: formData.get('purpose') as string,
        subject: formData.get('subject') as string
      };
      
      await apiService.submitAppointment(appointmentData);
      setIsSuccess(true);
      
      // Clear inputs
      setName("");
      setEmail("");
      setMobileNumber("");
      e.currentTarget.reset();
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment. Please try again.');
      console.error('Appointment Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError(null);
    setLoading(false);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      fontFamily: "-apple-system,BlinkMacSystemFont,'SF Pro Display',sans-serif",
    }}>
      <div style={{
        backgroundColor: '#fff',
        width: 'calc(100% - 32px)',
        maxWidth: '500px',
        maxHeight: '90vh',
        borderRadius: '16px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        margin: '16px',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #eee',
        }}>
          <div style={{ width: '36px' }}></div>
          <h2 style={{
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            fontFamily: "Georgia, serif",
            margin: 0,
          }}>Book an Appointment</h2>
          <button 
            onClick={handleClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="hide-scrollbar" style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          {!isSuccess ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Error Message */}
              {error && (
                <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '8px', fontSize: '13px' }}>
                  {error}
                </div>
              )}
              
              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#4b5563', marginBottom: '6px', display: 'block' }}>
                  Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input required name="name" type="text" value={name} onChange={handleNameChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                {name && name.trim().length === 0 && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>Name cannot be empty</span>}
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#4b5563', marginBottom: '6px', display: 'block' }}>
                  Email
                </label>
                <input name="email" type="email" value={email} onChange={handleEmailChange} pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                {email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>Please enter a valid email address</span>}
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#4b5563', marginBottom: '2px', display: 'block' }}>
                  Mobile Number <span style={{ color: 'red' }}>*</span>
                </label>
                <span style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px', display: 'block' }}>enter a phone number linked with WhatsApp.</span>
                <input required name="mobile_number" type="tel" value={mobileNumber} onChange={handlePhoneChange} minLength={10} maxLength={15} pattern="\d{10,15}" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                {mobileNumber && mobileNumber.length < 10 && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>Mobile number must be at least 10 digits</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#4b5563', marginBottom: '6px', display: 'block' }}>
                    Date <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input required name="date" type="date" min={new Date().toISOString().split('T')[0]} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#4b5563', marginBottom: '6px', display: 'block' }}>
                    Time <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input required name="time" type="time" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#4b5563', marginBottom: '6px', display: 'block' }}>
                  Appointment About <span style={{ color: 'red' }}>*</span>
                </label>
                <select required name="about_appoint" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', background: '#fff' }}>
                  <option>Gold Jewellery</option>
                  <option>Diamond Jewellery</option>
                  <option>Silver Articles</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#4b5563', marginBottom: '6px', display: 'block' }}>
                    Purity <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select required name="purity" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', background: '#fff' }}>
                    <option>18 k</option>
                    <option>22 k</option>
                    <option>24 k</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '14px', fontWeight: 600, color: '#4b5563', marginBottom: '6px', display: 'block' }}>
                    Diamond Type <span style={{ color: 'red' }}>*</span>
                  </label>
                  <select required name="dimond_type" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', background: '#fff' }}>
                    <option>Lab Grown</option>
                    <option>Natural</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#4b5563', marginBottom: '6px', display: 'block' }}>
                  Select Jewellery Category <span style={{ color: 'red' }}>*</span>
                </label>
                <select required name="jew_cate" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', background: '#fff' }}>
                  <option>Rings</option>
                  <option>Necklaces</option>
                  <option>Earrings</option>
                  <option>Bangles</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#4b5563', marginBottom: '6px', display: 'block' }}>
                  Select Purpose <span style={{ color: 'red' }}>*</span>
                </label>
                <select required name="purpose" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', background: '#fff' }}>
                  <option>Engagement</option>
                  <option>Wedding</option>
                  <option>Gift</option>
                  <option>Casual Wear</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#4b5563', marginBottom: '6px', display: 'block' }}>
                  Subject <span style={{ color: 'red' }}>*</span>
                </label>
                <input required name="subject" type="text" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
              </div>

              <button 
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#ccc' : '#e6a817',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '14px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: '10px',
                  boxShadow: '0 4px 6px rgba(230, 168, 23, 0.2)'
                }}
              >
                {loading ? 'Booking...' : 'Book an Appointment'}
              </button>
            </form>
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 0',
              animation: 'fadeIn 0.5s ease-in-out'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#e6a817',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '8px' }}>Success!</h3>
              <p style={{ fontSize: '16px', color: '#4b5563', textAlign: 'center' }}>
                Your appointment has been booked successfully.<br />
                We will contact you shortly.
              </p>
              <button 
                onClick={handleClose}
                style={{
                  marginTop: '32px',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: '1px solid #e6a817',
                  color: '#e6a817',
                  background: 'none',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default AppointmentPopup;
