import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useUIStore } from '../store/useUIStore';

export const CartDrawer = () => {
  const { isCartOpen, closeCart } = useUIStore();
  const { items, removeItem, addItem, decreaseQuantity, clearCart, total } = useCartStore();

  const cartTotal = total();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-brand-cream z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-brand-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <h2 className="text-xs uppercase tracking-[0.3em] font-bold">Shopping Bag ({items.length})</h2>
              </div>
              <button onClick={closeCart} className="p-2 hover:bg-brand-black/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-brand-beige rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={24} className="text-brand-black/20" />
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-brand-black/40">Your bag is empty</p>
                  <button
                    onClick={closeCart}
                    className="mt-6 text-[10px] uppercase tracking-widest border-b border-brand-black pb-1 hover:text-brand-gold hover:border-brand-gold transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-6">
                    <div className="w-24 aspect-[3/4] bg-brand-beige overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-[10px] uppercase tracking-widest font-bold">{item.name}</h3>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-brand-black/40 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <p className="text-[8px] uppercase tracking-widest text-brand-black/40 mb-4">{item.category}</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border border-brand-black/10">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="p-2 hover:bg-brand-black/5 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-[10px] px-2 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => addItem(item)}
                            className="p-2 hover:bg-brand-black/5 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="text-xs font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 bg-white border-t border-brand-black/5 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-brand-black/40">
                    <span>Subtotal</span>
                    <span>${cartTotal}</span>
                  </div>
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-brand-black/40">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold pt-4 border-t border-brand-black/5">
                    <span className="uppercase tracking-widest">Total</span>
                    <span>${cartTotal}</span>
                  </div>
                </div>
                
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="w-full py-5 bg-brand-black text-white text-[10px] uppercase tracking-[0.3em] font-medium flex items-center justify-center gap-3 hover:bg-brand-black/90 transition-all group"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <button
                  onClick={clearCart}
                  className="w-full text-[8px] uppercase tracking-widest text-brand-black/40 hover:text-brand-black transition-colors"
                >
                  Clear Bag
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
