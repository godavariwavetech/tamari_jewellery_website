import React, { useEffect } from 'react';
import type { AccountRole } from '../services/api';

const SF = "-apple-system,'SF Pro Display','SF Pro Text',BlinkMacSystemFont,sans-serif";
const GOLD = '#E4AC14';
const GOLD_DARK = '#c8900e';
const GOLD_L = '#fff8e8';

interface RolePickerPopupProps {
  isOpen: boolean;
  phone?: string;
  onPick: (role: AccountRole) => void;
  onCancel: () => void;
}

const UserIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GOLD_DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const BusinessIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GOLD_DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="3" y1="12" x2="21" y2="12" />
  </svg>
);

const RolePickerPopup: React.FC<RolePickerPopupProps> = ({ isOpen, phone, onPick, onCancel }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        fontFamily: SF,
        padding: 16,
        animation: 'tamiri-role-fade 0.15s ease',
      }}
    >
      <style>{`
        @keyframes tamiri-role-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tamiri-role-pop { from { transform: scale(0.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tamiri-role-title"
        style={{
          backgroundColor: '#fff',
          width: '100%',
          maxWidth: 480,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          animation: 'tamiri-role-pop 0.18s ease',
        }}
      >
        <div style={{ padding: '28px 24px 12px', textAlign: 'center' }}>
          <h2
            id="tamiri-role-title"
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#111827',
              margin: '0 0 8px',
              lineHeight: 1.3,
            }}
          >
            Continue as
          </h2>
          <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
            {phone
              ? `The number ${phone} is registered as both Individual and Business. Pick how you want to log in.`
              : 'This number is registered for both accounts. Pick how you want to log in.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '16px 24px 24px' }}>
          <button
            type="button"
            onClick={() => onPick('b2c')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              padding: '22px 14px',
              borderRadius: 12,
              border: `2px solid ${GOLD}`,
              background: '#fff',
              color: '#111827',
              cursor: 'pointer',
              transition: 'background 0.15s, transform 0.15s',
              fontFamily: SF,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = GOLD_L;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <UserIcon />
            <div style={{ fontSize: 15, fontWeight: 700 }}>Individual</div>
            <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.4 }}>Personal shopping, orders &amp; wishlist</div>
          </button>

          <button
            type="button"
            onClick={() => onPick('b2b')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 10,
              padding: '22px 14px',
              borderRadius: 12,
              border: `2px solid ${GOLD}`,
              background: '#fff',
              color: '#111827',
              cursor: 'pointer',
              transition: 'background 0.15s, transform 0.15s',
              fontFamily: SF,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = GOLD_L;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <BusinessIcon />
            <div style={{ fontSize: 15, fontWeight: 700 }}>Business</div>
            <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.4 }}>GST invoicing &amp; bulk orders</div>
          </button>
        </div>

        <div style={{ padding: '0 24px 20px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              textDecoration: 'underline',
              fontFamily: SF,
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RolePickerPopup;
