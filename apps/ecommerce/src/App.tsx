import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { WishlistPage } from './pages/WishlistPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { CartDrawer } from './components/CartDrawer';
import { MobileBottomBar } from './components/MobileBottomBar';
import './i18n/config';

export default function App() {
  return (
    <Router>
      <main className="min-h-screen bg-brand-cream pb-32 md:pb-0">
        <Navbar />
        <CartDrawer />
        <MobileBottomBar />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>

        <footer className="py-24 px-8 border-t border-brand-black/10 bg-brand-beige/30">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2">
              <h1 className="text-3xl font-display tracking-[0.3em] mb-6 uppercase">MARYAM</h1>
              <p className="text-xs text-brand-black/60 max-w-xs leading-relaxed uppercase tracking-wider">
                Redefining high fashion with a minimalist touch. Quality, elegance, and timeless design.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-6">Customer Service</h4>
              <ul className="flex flex-col gap-4 text-[10px] uppercase tracking-widest text-brand-black/60">
                <li><a href="#" className="hover:text-brand-black transition-colors">Shipping & Returns</a></li>
                <li><a href="#" className="hover:text-brand-black transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-brand-black transition-colors">Terms & Conditions</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] uppercase tracking-widest font-bold mb-6">Follow Us</h4>
              <ul className="flex flex-col gap-4 text-[10px] uppercase tracking-widest text-brand-black/60">
                <li><a href="#" className="hover:text-brand-black transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-brand-black transition-colors">Pinterest</a></li>
                <li><a href="#" className="hover:text-brand-black transition-colors">TikTok</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-brand-black/5 flex justify-between items-center">
            <p className="text-[8px] uppercase tracking-widest text-brand-black/40">© 2026 MARYAM FASHION. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-4">
              <div className="w-6 h-4 bg-brand-black/10 rounded-sm" />
              <div className="w-6 h-4 bg-brand-black/10 rounded-sm" />
              <div className="w-6 h-4 bg-brand-black/10 rounded-sm" />
            </div>
          </div>
        </footer>
      </main>
    </Router>
  );
}
