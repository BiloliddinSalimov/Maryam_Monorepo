import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useUIStore } from '../store/useUIStore';
import { cn } from '../lib/utils';

export const MobileBottomBar = () => {
  const cartItems = useCartStore((state) => state.items);
  const openCart = useUIStore((state) => state.openCart);

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[85%] max-w-[360px] z-50">
      <div className="bg-brand-cream/90 backdrop-blur-xl border border-brand-black/10 rounded-full px-6 py-3 flex justify-between items-center shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <NavLink 
          to="/" 
          className={({ isActive }) => cn(
            "relative flex flex-col items-center transition-all duration-500",
            isActive ? "text-brand-black scale-110" : "text-brand-black/30 hover:text-brand-black/50"
          )}
        >
          {({ isActive }) => (
            <>
              <Home size={18} strokeWidth={isActive ? 2.5 : 1.5} />
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-2 w-1 h-1 bg-brand-black rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </>
          )}
        </NavLink>

        <NavLink 
          to="/category/clothing" 
          className={({ isActive }) => cn(
            "relative flex flex-col items-center transition-all duration-500",
            isActive ? "text-brand-black scale-110" : "text-brand-black/30 hover:text-brand-black/50"
          )}
        >
          {({ isActive }) => (
            <>
              <Search size={18} strokeWidth={isActive ? 2.5 : 1.5} />
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-2 w-1 h-1 bg-brand-black rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </>
          )}
        </NavLink>

        <button 
          onClick={openCart}
          className="relative flex flex-col items-center group"
        >
          <div className="bg-brand-black text-brand-cream p-2.5 rounded-full shadow-md transform group-active:scale-90 transition-all duration-300">
            <ShoppingBag size={18} strokeWidth={2} />
          </div>
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-black text-[7px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-brand-cream shadow-sm">
              {cartItems.length}
            </span>
          )}
        </button>

        <NavLink 
          to="/wishlist" 
          className={({ isActive }) => cn(
            "relative flex flex-col items-center transition-all duration-500",
            isActive ? "text-brand-black scale-110" : "text-brand-black/30 hover:text-brand-black/50"
          )}
        >
          {({ isActive }) => (
            <>
              <Heart size={18} strokeWidth={isActive ? 2.5 : 1.5} />
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-2 w-1 h-1 bg-brand-black rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </>
          )}
        </NavLink>

        <NavLink 
          to="/orders" 
          className={({ isActive }) => cn(
            "relative flex flex-col items-center transition-all duration-500",
            isActive ? "text-brand-black scale-110" : "text-brand-black/30 hover:text-brand-black/50"
          )}
        >
          {({ isActive }) => (
            <>
              <User size={18} strokeWidth={isActive ? 2.5 : 1.5} />
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-2 w-1 h-1 bg-brand-black rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
};
