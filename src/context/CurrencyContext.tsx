/**
 * CurrencyContext
 * ───────────────
 *  Single source of truth for the currency the user is browsing in.
 *
 *  All product prices in the database are stored in INR. Every component
 *  that renders a price calls `format(priceInINR)` — the context handles
 *  conversion using the latest INR→foreign rate and formats according to
 *  the currency's locale + decimals.
 *
 *  Pieces exposed by `useCurrency()`:
 *    currency        — current Currency object ({ code, symbol, ... })
 *    currencies      — list from /getcurrencies (active rows only)
 *    setCurrency     — change the active currency (also persists to localStorage)
 *    format(amtINR)  — returns formatted string, e.g. "₹89,999" or "$1,080.00"
 *    convert(amtINR) — returns the numeric foreign amount (no symbol)
 *    isLoaded        — true once the rate list has been fetched at least once
 *
 *  Rate lifecycle:
 *    - On mount, fetches /getcurrencies (backend returns INR + USD).
 *    - Also refetches every 10 min so long-lived tabs pick up rate changes
 *      pushed by the hourly cron.
 *    - User's chosen currency code is stored in localStorage.currency.
 *
 *  GST handling note:
 *    - Indian buyers (INR) see prices inclusive of 3% GST (same as today).
 *    - International buyers (USD) shouldn't pay Indian GST, so USD prices
 *      are rendered PRE-GST. The context exposes an `applyGstStrip` flag
 *      for components that know their INR input already includes GST.
 */

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { apiService } from '../services/api';

export interface Currency {
  code: string;
  symbol: string;
  rate_from_inr: number; // 1 INR -> X of this currency (INR row is 1)
  decimals: number;
  locale: string;
}

interface CurrencyContextValue {
  currency: Currency;
  currencies: Currency[];
  setCurrency: (code: string) => void;
  convert: (amountInINR: number, opts?: { inputIncludesGst?: boolean }) => number;
  format: (amountInINR: number, opts?: { inputIncludesGst?: boolean }) => string;
  isLoaded: boolean;
  /** True if the current currency is not INR. Useful for rendering notes like "excludes Indian GST". */
  isForeign: boolean;
}

const FALLBACK_INR: Currency = { code: 'INR', symbol: '₹', rate_from_inr: 1, decimals: 0, locale: 'en-IN' };
const INDIAN_GST = 0.03; // 3% — must match backend price calculations

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currencies, setCurrencies] = useState<Currency[]>([FALLBACK_INR]);
  const [currencyCode, setCurrencyCode] = useState<string>(() => {
    if (typeof window === 'undefined') return 'INR';
    return localStorage.getItem('currency') || 'INR';
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Fetch currencies on mount, then every 10 minutes
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const list = await apiService.getCurrencies();
      if (cancelled) return;
      if (list.length > 0) {
        setCurrencies(list);
        setIsLoaded(true);
      }
    };
    load();
    const id = window.setInterval(load, 10 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  // Resolve the active currency; fall back to INR if the stored code was disabled
  const currency = useMemo<Currency>(() => {
    return currencies.find(c => c.code === currencyCode)
      || currencies.find(c => c.code === 'INR')
      || FALLBACK_INR;
  }, [currencies, currencyCode]);

  const setCurrency = (code: string) => {
    setCurrencyCode(code);
    try { localStorage.setItem('currency', code); } catch {}
  };

  // Convert INR amount to active currency.
  //   - If input already has GST baked in and we're showing a foreign
  //     currency (international buyer), strip the GST first.
  const convert = (amountInINR: number, opts?: { inputIncludesGst?: boolean }) => {
    let inr = Number(amountInINR) || 0;
    if (opts?.inputIncludesGst && currency.code !== 'INR') {
      inr = inr / (1 + INDIAN_GST);
    }
    return inr * currency.rate_from_inr;
  };

  // Format for display: "₹89,999" / "$1,080.00"
  const format = (amountInINR: number, opts?: { inputIncludesGst?: boolean }) => {
    const converted = convert(amountInINR, opts);
    try {
      return new Intl.NumberFormat(currency.locale, {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits: currency.decimals,
        maximumFractionDigits: currency.decimals,
      }).format(converted);
    } catch {
      // Legacy browsers / unknown locale — fall back to symbol + plain number
      return `${currency.symbol}${converted.toLocaleString(currency.locale, {
        minimumFractionDigits: currency.decimals,
        maximumFractionDigits: currency.decimals,
      })}`;
    }
  };

  const value: CurrencyContextValue = {
    currency,
    currencies,
    setCurrency,
    convert,
    format,
    isLoaded,
    isForeign: currency.code !== 'INR',
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // Soft fallback so components don't crash if the provider was skipped in a test
    return {
      currency: FALLBACK_INR,
      currencies: [FALLBACK_INR],
      setCurrency: () => {},
      convert: (n) => n,
      format: (n) => `₹${Math.round(n).toLocaleString('en-IN')}`,
      isLoaded: false,
      isForeign: false,
    };
  }
  return ctx;
}
