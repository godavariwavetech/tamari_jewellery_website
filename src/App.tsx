import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopOnNavigation from './components/ScrollToTopOnNavigation';
import Home from './pages/Home';
import Login from './pages/Login';



import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Contact from './pages/Contact';
import Appointment from './pages/Appointment';
import GoldRate from './pages/GoldRate';
import KnowYourJewellery from './pages/KnowYourJewellery';
import JewelleryBuyingGuide from './pages/JewelleryBuyingGuide';
import FourCsOfDiamonds from './pages/FourCsOfDiamonds';
import LabVsNaturalDiamonds from './pages/LabVsNaturalDiamonds';
import JewelleryCare from './pages/JewelleryCare';
import CertificationGuide from './pages/CertificationGuide';
import FAQs from './pages/FAQs';
import About from './pages/About';

import Signup from './pages/Signup';
import OTPVerification from './pages/OTPVerification';

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const AppContent = () => {
  const location = useLocation();
  const showHeaderFooter = !['/login', '/signup', '/otp'].includes(location.pathname);
  
  const [, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
    }}>
      {showHeaderFooter && (
        <>
          <Header />
          <Navbar />
        </>
      )}
      <ScrollToTop />
      <main style={{
        width: "100%",
      }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<OTPVerification />} />
          
          
          <Route path="/products" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/gold-rate" element={<GoldRate />} />
          <Route path="/know-your-jewellery" element={<KnowYourJewellery />} />
          <Route path="/about" element={<About />} />
          
          {/* Know Your Jewellery Dropdown Routes */}
          <Route path="/jewellery-buying-guide" element={<JewelleryBuyingGuide />} />
          <Route path="/4-cs-of-diamonds" element={<FourCsOfDiamonds />} />
          <Route path="/lab-vs-natural-diamonds" element={<LabVsNaturalDiamonds />} />
          <Route path="/jewellery-care" element={<JewelleryCare />} />
          <Route path="/certification-guide" element={<CertificationGuide />} />
          <Route path="/faqs" element={<FAQs />} />
          
          {/* Customer Services Dropdown Routes */}
          <Route path="/lifetime-exchange-policy" element={<Contact />} />
          <Route path="/buyback-refund-policy" element={<Contact />} />
          <Route path="/cancellation-policy" element={<Contact />} />
          <Route path="/terms-conditions" element={<Contact />} />
          <Route path="/payment-options" element={<Contact />} />
        </Routes>
      </main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTopOnNavigation />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
