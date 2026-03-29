import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { ShoppingBag, Heart, ArrowLeft, ChevronRight, Star } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import { ALL_PRODUCTS } from '../data/products';

export const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>();
  const { t } = useTranslation();
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, hasItem } = useWishlistStore();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const product = ALL_PRODUCTS.find((p) => p.id === productId);
  const isWishlisted = product ? hasItem(product.id) : false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  if (!product) {
    return (
      <div className="pt-40 pb-24 px-8 text-center min-h-screen">
        <h2 className="text-2xl font-display mb-4">Product Not Found</h2>
        <Link to="/" className="text-xs uppercase tracking-widest border-b border-brand-black pb-1">Return Home</Link>
      </div>
    );
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  return (
    <div className="pt-32 pb-24 px-8 max-w-7xl mx-auto min-h-screen">
      <Link to={`/category/${product.category.toLowerCase()}`} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-brand-black/40 mb-12 hover:text-brand-black transition-colors group">
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Back to {product.category}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <div className="aspect-3/4 overflow-hidden bg-brand-beige">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="aspect-3/4 overflow-hidden bg-brand-beige">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover opacity-80"
                  referrerPolicy="no-referrer"
                />
             </div>
             <div className="aspect-3/4 overflow-hidden bg-brand-beige">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
             </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:sticky lg:top-40 h-fit"
        >
          <div className="mb-8">
            <span className="text-[10px] uppercase tracking-[0.4em] text-brand-black/40 mb-4 block">{product.category}</span>
            <h1 className="text-4xl md:text-5xl font-display mb-4 tracking-tight uppercase">{product.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <p className="text-2xl font-medium">${product.price}</p>
              <div className="flex items-center gap-1 text-brand-gold">
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="currentColor" />
                <Star size={14} fill="none" />
                <span className="text-[10px] text-brand-black/40 ml-2">(12 Reviews)</span>
              </div>
            </div>
            <p className="text-xs text-brand-black/60 leading-relaxed uppercase tracking-wider mb-8">
              A masterpiece of modern design, crafted from the finest materials to ensure both elegance and comfort. This piece embodies the essence of the MARYAM aesthetic.
            </p>
          </div>

          <div className="mb-12">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-[10px] uppercase tracking-widest font-bold">Select Size</h4>
              <button className="text-[8px] uppercase tracking-widest border-b border-brand-black/20 pb-0.5 hover:border-brand-black transition-colors">Size Guide</button>
            </div>
            <div className="flex gap-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 flex items-center justify-center text-[10px] border transition-all duration-300 ${
                    selectedSize === size
                      ? 'bg-brand-black text-white border-brand-black'
                      : 'bg-transparent border-brand-black/10 hover:border-brand-black'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => addItem(product)}
              className="w-full py-5 bg-brand-black text-white text-[10px] uppercase tracking-[0.3em] font-medium flex items-center justify-center gap-3 hover:bg-brand-black/90 transition-all group"
            >
              <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
              Add to Bag
            </button>
            <button
              onClick={() => toggleItem(product)}
              className={`w-full py-5 border text-[10px] uppercase tracking-[0.3em] font-medium flex items-center justify-center gap-3 transition-all ${
                isWishlisted
                  ? 'bg-brand-black text-white border-brand-black'
                  : 'bg-transparent border-brand-black/10 hover:border-brand-black'
              }`}
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
              {isWishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
            </button>
          </div>

          <div className="mt-12 pt-12 border-t border-brand-black/10 space-y-6">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-brand-beige flex items-center justify-center">
                 <ChevronRight size={16} />
               </div>
               <div>
                 <h5 className="text-[10px] uppercase tracking-widest font-bold">Free Express Shipping</h5>
                 <p className="text-[8px] uppercase tracking-widest text-brand-black/40">On orders over $500</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-brand-beige flex items-center justify-center">
                 <ChevronRight size={16} />
               </div>
               <div>
                 <h5 className="text-[10px] uppercase tracking-widest font-bold">Premium Packaging</h5>
                 <p className="text-[8px] uppercase tracking-widest text-brand-black/40">Signature MARYAM box included</p>
               </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Products Section */}
      <div className="mt-32">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-brand-black/40 mb-4 block">Complete the look</span>
            <h2 className="text-4xl font-display">Related <span className="italic">Items</span></h2>
          </div>
          <Link to={`/category/${product.category.toLowerCase()}`} className="text-[10px] uppercase tracking-widest border-b border-brand-black pb-1 hover:text-brand-gold hover:border-brand-gold transition-colors">
            View All
          </Link>
        </div>
        <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:pb-0 scrollbar-hide">
          {ALL_PRODUCTS
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
            .map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="min-w-60 snap-start lg:min-w-0 group"
              >
                <Link to={`/product/${p.id}`}>
                  <div className="relative aspect-3/4 overflow-hidden bg-brand-beige mb-4">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="text-[10px] uppercase tracking-widest font-medium mb-1">{p.name}</h4>
                  <p className="text-xs font-medium">${p.price}</p>
                </Link>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
};
