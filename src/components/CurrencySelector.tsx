/**
 * CurrencySelector
 * ────────────────
 *  Small dropdown used in the Header (desktop) and mobile drawer.
 *  Reads from CurrencyContext, changes the app-wide currency instantly.
 *  Only one active currency at a time (stored in localStorage).
 *
 *  Visuals match the Header's Contact/Appointment pill buttons so it
 *  feels native to the bar. Hovering reveals the gold accent.
 */

import { useEffect, useRef, useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';

interface Props {
  compact?: boolean; // smaller variant for tight mobile drawers
}

export default function CurrencySelector({ compact = false }: Props) {
  const { currency, currencies, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const triggerFontSize = compact ? 13 : 15;

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block', fontFamily: 'inherit' }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#6b7280',
          padding: compact ? '6px 8px' : 0,
          fontSize: triggerFontSize,
          fontWeight: 500,
          fontFamily: 'inherit',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#E4AC14'}
        onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
      >
        <span aria-hidden="true" style={{ fontSize: triggerFontSize - 1 }}>{currency.symbol}</span>
        <span style={{ letterSpacing: 0.3 }}>{currency.code}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: 140,
            background: '#fff',
            border: '1px solid rgba(0,0,0,0.08)',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            padding: 6,
            margin: 0,
            listStyle: 'none',
            // Navbar is sticky with zIndex: 1000; Header is 50. We need to be above both.
            zIndex: 2000,
          }}
        >
          {currencies.map(c => {
            const active = c.code === currency.code;
            return (
              <li key={c.code}>
                <button
                  role="option"
                  aria-selected={active}
                  onClick={() => { setCurrency(c.code); setOpen(false); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                    padding: '8px 12px',
                    background: active ? 'rgba(228,172,20,0.12)' : 'transparent',
                    border: 'none',
                    borderRadius: 6,
                    cursor: 'pointer',
                    color: active ? '#E4AC14' : '#111827',
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                    textAlign: 'left',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => {
                    if (!active) e.currentTarget.style.background = '#f9fafb';
                  }}
                  onMouseLeave={e => {
                    if (!active) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ minWidth: 14, display: 'inline-block' }}>{c.symbol}</span>
                    <span>{c.code}</span>
                  </span>
                  {active && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
