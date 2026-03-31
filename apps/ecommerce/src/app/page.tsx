'use client';

import { HeroSection } from '@/components/HeroSection';
import { PromoBanner } from '@/components/PromoBanner';
import { CategoryGrid } from '@/components/CategoryGrid';
import { ProductCard } from '@/components/ProductCard';
import { NewsletterBanner } from '@/components/NewsletterBanner';
import { FEATURED_PRODUCTS } from '@/data/products';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <PromoBanner image="https://www.lux-mag.com/wp-content/uploads/2023/11/Untitled-1-copy-1160x770.jpg" />
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-display mb-2">Featured Products</h2>
            <p className="text-xs uppercase tracking-[0.3em] text-brand-black/60">Selected for you</p>
          </div>
          <button className="text-[10px] uppercase tracking-widest border-b border-brand-black pb-1 hover:opacity-50 transition-opacity">
            View All
          </button>
        </div>
        <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:gap-8 lg:overflow-visible lg:pb-0 scrollbar-hide">
          {FEATURED_PRODUCTS.map((product) => (
            <div key={product.id} className="min-w-64 snap-start lg:min-w-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
      <PromoBanner image="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2070&auto=format&fit=crop" />
      <NewsletterBanner />
    </>
  );
}
