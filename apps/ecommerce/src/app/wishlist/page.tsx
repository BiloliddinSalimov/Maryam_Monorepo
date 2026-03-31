'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';

export default function WishlistPage() {
  const { items, toggleItem } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="pt-40 pb-24 px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-20">
        <span className="text-[10px] uppercase tracking-[0.4em] text-brand-black/40 mb-4 block">Personal Collection</span>
        <h1 className="text-5xl font-display mb-6 tracking-tight uppercase">Your <span className="italic text-brand-gold">Wishlist</span></h1>
        <p className="text-xs uppercase tracking-widest text-brand-black/40 max-w-md mx-auto leading-relaxed">
          A curated selection of your most desired pieces. Timeless elegance, reserved for you.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-brand-beige rounded-full flex items-center justify-center mx-auto mb-8">
            <Heart size={32} className="text-brand-black/10" />
          </div>
          <p className="text-[10px] uppercase tracking-widest text-brand-black/40 mb-8">Your wishlist is currently empty</p>
          <Link href="/" className="px-12 py-5 bg-brand-black text-white text-[10px] uppercase tracking-[0.3em] font-medium inline-flex items-center gap-3 hover:bg-brand-black/90 transition-all group">
            Explore Collections
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {items.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }} className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-brand-beige mb-6">
                <Link href={`/product/${product.id}`}>
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" referrerPolicy="no-referrer" />
                </Link>
                <div className="absolute top-4 right-4">
                  <button onClick={() => toggleItem(product)} className="p-2 bg-white text-brand-black rounded-full shadow-sm hover:bg-brand-black hover:text-white transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 w-full p-6 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-500">
                  <button onClick={() => addItem(product)} className="w-full py-4 bg-white text-brand-black text-[10px] uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 hover:bg-brand-black hover:text-white transition-colors">
                    <ShoppingBag size={14} /> Add to Bag
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest font-bold mb-1">{product.name}</h3>
                  <p className="text-xs font-medium">${product.price}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
