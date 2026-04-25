import React, { useEffect } from 'react';

const SF = "-apple-system,'SF Pro Display','SF Pro Text',BlinkMacSystemFont,sans-serif";
const GOLD = '#E4AC14';
const GOLD_DARK = '#c8900e';
const GOLD_L = '#fff8e8';
const RED = '#dc2626';
const RED_DARK = '#b91c1c';
const RED_L = '#fee2e2';
const GREEN = '#16a34a';
const GREEN_L = '#dcfce7';

export type ConfirmVariant = 'default' | 'danger' | 'success' | 'info';

interface ConfirmPopupProps {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
  onConfirm: () => void;
  onCancel: () => void;
  hideCancel?: boolean;
  loading?: boolean;
}

const variantStyles: Record<ConfirmVariant, { accent: string; accentDark: string; tint: string; icon: React.ReactNode }> = {
  default: {
    accent: GOLD,
    accentDark: GOLD_DARK,
    tint: GOLD_L,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  danger: {
    accent: RED,
    accentDark: RED_DARK,
    tint: RED_L,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  success: {
    accent: GREEN,
    accentDark: '#15803d',
    tint: GREEN_L,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  info: {
    accent: GOLD,
    accentDark: GOLD_DARK,
    tint: GOLD_L,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
};

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel,
  hideCancel = false,
  loading = false,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
      if (e.key === 'Enter' && !loading) onConfirm();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, loading, onCancel, onConfirm]);

  if (!isOpen) return null;

  const v = variantStyles[variant];

  return (
    <div
      onClick={() => !loading && onCancel()}
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
        padding: '16px',
        animation: 'tamiri-fade-in 0.15s ease',
      }}
    >
      <style>{`
        @keyframes tamiri-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tamiri-pop-in { from { transform: scale(0.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tamiri-confirm-title"
        style={{
          backgroundColor: '#fff',
          width: '100%',
          maxWidth: 420,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          animation: 'tamiri-pop-in 0.18s ease',
        }}
      >
        <div style={{ padding: '28px 24px 20px', textAlign: 'center' }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: v.tint,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            {v.icon}
          </div>

          <h2
            id="tamiri-confirm-title"
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#111827',
              margin: '0 0 8px',
              lineHeight: 1.3,
            }}
          >
            {title}
          </h2>

          {message && (
            <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
              {message}
            </p>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            gap: 10,
            padding: '0 24px 24px',
            flexDirection: hideCancel ? 'column' : 'row',
          }}
        >
          {!hideCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px 0',
                borderRadius: 10,
                border: '1px solid #e5e7eb',
                background: '#fff',
                color: '#374151',
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1,
                fontFamily: SF,
                transition: 'background 0.15s, border-color 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = '#f9fafb';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#fff';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px 0',
              borderRadius: 10,
              border: 'none',
              background: v.accent,
              color: '#fff',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 0.3,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              fontFamily: SF,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.background = v.accentDark;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = v.accent;
            }}
          >
            {loading ? 'Please wait…' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
