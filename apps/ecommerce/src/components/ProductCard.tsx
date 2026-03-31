'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart } from 'lucide-react';
import { Product, useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import React from 'react';

export interface ProductCardProps {
  product: Product;
}

const ProductCardBase: React.FC<ProductCardProps> = ({ product }) => {
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, hasItem } = useWishlistStore();
  const isWishlisted = hasItem(product.id);

  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-beige mb-4">
        <Link href={`/product/${product.id}`}>
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
          <div className="lg:hidden absolute inset-0 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm text-brand-black px-4 py-2 rounded-full text-[8px] uppercase tracking-widest font-bold shadow-sm">
              View Detail
            </div>
          </div>
        </Link>
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
          <button onClick={() => toggleItem(product)} className={`p-2 rounded-full shadow-sm transition-colors ${isWishlisted ? 'bg-brand-black text-white' : 'bg-white text-brand-black hover:bg-brand-black hover:text-white'}`}>
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <button onClick={() => addItem(product)} className="p-2 bg-white text-brand-black rounded-full shadow-sm hover:bg-brand-black hover:text-white transition-colors">
            <ShoppingBag size={18} />
          </button>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <h4 className="text-xs uppercase tracking-widest font-medium mb-1">{product.name}</h4>
          <p className="text-[10px] text-brand-black/60 uppercase tracking-widest">{product.category}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="text-xs font-medium">${product.price}</p>
          <button onClick={(e) => { e.preventDefault(); addItem(product); }} className="lg:hidden px-4 py-1.5 bg-brand-gold text-brand-black text-[9px] uppercase tracking-widest font-bold rounded-full active:scale-95 transition-transform shadow-sm">
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export const ProductCard = React.memo(ProductCardBase);
