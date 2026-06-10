# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — `tsc -b` type-check, then Vite production build (build will fail on TS errors)
- `npm run lint` — ESLint over the whole project (flat config in `eslint.config.js`)
- `npm run preview` — preview the built bundle

There is no test runner configured.

## Environment

`VITE_BASE_URL` in `.env` points the frontend at the backend. `src/services/api.ts` falls back to `https://tamarijewellersapi.godavariwave.com/website_api` when unset. Local dev typically uses `http://localhost:2088/website_api`.

## Architecture

Single-page React 19 + TypeScript app built with Vite 8, styled with Tailwind v4 (via `@tailwindcss/postcss`) plus extensive inline `style={}` objects. Routing is client-side via `react-router-dom` v7.

**Entry / shell.** `src/main.tsx` → `src/App.tsx`. `App.tsx` owns the `BrowserRouter`, the full route table, and conditionally renders `Header` + `Navbar` + `Footer` (hidden on `/login`, `/signup`, `/otp`). All pages live under `src/pages/` and are wired directly in `App.tsx` — adding a page means editing that file.

**Data layer.** All HTTP traffic goes through the single `apiService` object in `src/services/api.ts`. Every method:
- POSTs JSON to a path under `BASE_URL` (most endpoints are POST even for reads)
- Normalizes the wire shape: products commonly arrive as `product_main_image` / `total_price` and are mapped to `product_image` / `price` for UI consumption
- Catches errors and returns hardcoded fallback data (categories, products, banners, videos) so the UI renders even when the backend is down — keep this pattern when adding new endpoints, and don't replace fallbacks with thrown errors without checking callers.

When modifying product-shaped responses, update both the TypeScript interface (`Product`, `ProductDetail`) and the mapping block; the UI assumes the normalized field names.

**Auth.** `src/services/auth.ts` exports an `authService` singleton. User + token are persisted in `localStorage` (`user`, `token` keys) and re-hydrated on construction. Login is phone + OTP: `Login.tsx` calls `checkUserStatus` → `getUserLoginOTP` → navigates to `/otp` with `mobileNumber` in router state → `OTPVerification.tsx` calls `customerLogin`. A demo OTP (`123456`) is hardcoded in `api.ts`'s fallback path. There is no route guard — pages that need a user call `authService.getCurrentUser()` directly.

**Cart/wishlist sync.** `src/utils/cartUtils.ts` defines a global `cartUpdate` `CustomEvent`. Any code that mutates the cart should call `dispatchCartUpdate()` (or use the `addToCartWithUpdate` / `removeFromCartWithUpdate` helpers) so the Navbar badge and other listeners refresh. Don't call `apiService.addToCart` directly from components if you want the badge to update.

**Pages using path aliases to Contact.** Several "customer services" routes (`/lifetime-exchange-policy`, `/terms-conditions`, etc.) intentionally render `Contact` as a placeholder — not a bug.

## TypeScript config notes

`tsconfig.app.json` enables `strict`, `noUnusedLocals`, `noUnusedParameters`, and `verbatimModuleSyntax`. Type-only imports must use `import type { ... }` — mixed imports will fail the build. `erasableSyntaxOnly` is on, so no enums or namespaces.
