import React, { useState } from 'react';

interface ContactUsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactUsPopup: React.FC<ContactUsPopupProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

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
      setPhone(value);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z0-9@._%+-]*$/.test(value)) {
      setEmail(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    
    // Clear controlled inputs
    setName("");
    setEmail("");
    setPhone("");
    
    // Clear uncontrolled inputs (select, textarea)
    (e.target as HTMLFormElement).reset();
  };

  const handleClose = () => {
    setIsSuccess(false);
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
          }}>Contact Us</h2>
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
              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#4b5563', marginBottom: '6px', display: 'block' }}>
                  Name <span style={{ color: 'red' }}>*</span>
                </label>
                <input required type="text" value={name} onChange={handleNameChange} style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                {name && name.trim().length === 0 && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>Name cannot be empty</span>}
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#4b5563', marginBottom: '6px', display: 'block' }}>
                  Email
                </label>
                <input type="email" value={email} onChange={handleEmailChange} pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                {email && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>Please enter a valid email address</span>}
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#4b5563', marginBottom: '2px', display: 'block' }}>
                  Mobile Number <span style={{ color: 'red' }}>*</span>
                </label>
                <span style={{ fontSize: '11px', color: '#6b7280', marginBottom: '6px', display: 'block' }}>enter a phone number linked with WhatsApp.</span>
                <input required type="tel" value={phone} onChange={handlePhoneChange} minLength={10} maxLength={15} pattern="\d{10,15}" style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                {phone && phone.length < 10 && <span style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>Mobile number must be at least 10 digits</span>}
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#4b5563', marginBottom: '6px', display: 'block' }}>
                  Enquiry Type <span style={{ color: 'red' }}>*</span>
                </label>
                <select required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', background: '#fff' }}>
                  <option>Feedback</option>
                  <option>Product Enquiry</option>
                  <option>Customization</option>
                  <option>Order Status</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '14px', fontWeight: 600, color: '#4b5563', marginBottom: '6px', display: 'block' }}>
                  Subject <span style={{ color: 'red' }}>*</span>
                </label>
                <textarea required style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', minHeight: '120px', resize: 'vertical' }}></textarea>
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: '#e6a817',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '14px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginTop: '10px',
                  boxShadow: '0 4px 6px rgba(230, 168, 23, 0.2)'
                }}
              >
                Send
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
                Your enquiry has been sent successfully.<br />
                We will get back to you soon.
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

export default ContactUsPopup;
