# Tamiri Jewellers - Frontend Project

A complete B2B + B2C Jewellery Website built with React, Vite, TypeScript, and Tailwind CSS.

## 🚀 Tech Stack

- **React** - UI Library
- **Vite** - Build tool & dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.tsx      # Top bar with contact, search, cart
│   ├── Navbar.tsx      # Main navigation menu
│   └── Footer.tsx      # Site footer
│
├── pages/              # Page components (one file per page)
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── OTP.tsx
│   ├── BusinessRegister.tsx
│   ├── CustomerRegister.tsx
│   ├── ProductList.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Wishlist.tsx
│   ├── Profile.tsx
│   ├── Orders.tsx
│   ├── Contact.tsx
│   ├── Appointment.tsx
│   ├── GoldRate.tsx
│   ├── KnowJewellery.tsx
│   └── About.tsx
│
├── App.tsx            # Main app with routing
└── main.tsx           # Entry point
```

## 🎯 Features

### Pages Implemented
✅ Home - Hero section, categories, trending products, testimonials
✅ Login - B2B/B2C login options
✅ OTP Verification
✅ Business Registration (B2B)
✅ Customer Registration (B2C)
✅ Product Listing with filters
✅ Product Detail page
✅ Shopping Cart
✅ Wishlist
✅ User Profile
✅ Orders tracking
✅ Contact form
✅ Appointment booking
✅ Gold/Silver rates display
✅ Jewellery education content
✅ About page

### Global Components
✅ Header - Contact info, search bar, quick links
✅ Navbar - Logo, navigation menu, login button
✅ Footer - Company info, services, contact details

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## 🎨 Design Notes

- Uses Tailwind CSS utility classes exclusively (no custom CSS files)
- Each page is contained in a single file for simplicity
- Responsive design with mobile-first approach
- Clean, minimal UI ready for customization
- Dummy data used throughout for demonstration

## 📝 Key Routes

- `/` - Home page
- `/login` - Login page
- `/products` - Product listing
- `/product/:id` - Product details
- `/cart` - Shopping cart
- `/wishlist` - Saved items
- `/profile` - User profile
- `/orders` - Order history
- `/gold-rate` - Current gold/silver rates
- `/contact` - Contact form
- `/appointment` - Book appointment
- `/know-jewellery` - Educational content
- `/about` - About company

## 🔧 Configuration Files

- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS plugins (Tailwind + Autoprefixer)
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration

## 📦 Dependencies

- react-router-dom - Routing
- tailwindcss - Styling
- @tailwindcss/postcss - Tailwind PostCSS plugin
- autoprefixer - CSS vendor prefixes
- postcss - CSS processing

## 🎯 Next Steps

This is a base structure with sample UI. To customize:

1. Replace emoji icons with actual images/icons
2. Update color scheme in tailwind.config.js
3. Add real product images
4. Implement backend API integration
5. Add state management (Redux/Zustand) if needed
6. Enhance forms with validation
7. Add authentication logic
8. Implement shopping cart functionality
9. Connect payment gateway
10. Make pixel-perfect adjustments based on Figma designs

## 💡 Tips

- All styling uses Tailwind classes directly in components
- No separate CSS files are used
- Forms use controlled components with dummy handlers
- Navigation uses React Router's Link component
- Responsive breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

---

**Built for Tamiri Jewellers** ✨
