import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CurrencyProvider } from './context/CurrencyContext'

// CurrencyProvider wraps the whole app so every component — cards,
// cart, wishlist, detail pages, header — can call `useCurrency().format(inr)`
// and get the correctly localized price. The provider fetches active
// currencies from /getcurrencies on mount and refetches every 10 min.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CurrencyProvider>
      <App />
    </CurrencyProvider>
  </StrictMode>,
)
