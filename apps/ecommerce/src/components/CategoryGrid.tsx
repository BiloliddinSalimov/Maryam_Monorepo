'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

export const CategoryGrid = () => {
  const { t } = useTranslation();

  const categories = [
    { title: t('categories.clothing'), image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop', path: '/category/clothing', gridClass: 'lg:col-span-2 lg:row-span-1' },
    { title: t('categories.bags'), image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1974&auto=format&fit=crop', path: '/category/bags', gridClass: 'lg:col-span-1 lg:row-span-1' },
    { title: t('categories.shoes'), image: 'https://mariam-col.com/cdn/shop/files/elegant-solid-color-abaya-for-muslimahs-ma036-348069.jpg?v=1746495095&width=1200', path: '/category/shoes', gridClass: 'lg:col-span-1 lg:row-span-1' },
    { title: t('categories.jewelry'), image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1974&auto=format&fit=crop', path: '/category/jewelry', gridClass: 'lg:col-span-1 lg:row-span-1' },
    { title: t('categories.outerwear'), image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=2071&auto=format&fit=crop', path: '/category/outerwear', gridClass: 'lg:col-span-1 lg:row-span-1' },
  ];

  return (
    <section className="py-24 px-8 max-w-screen-2xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-black/40 mb-2 block">Shop by Category</span>
          <h2 className="text-5xl font-display uppercase tracking-tight">The <span className="italic">Collections</span></h2>
        </div>
        <Link href="/category/clothing" className="text-[11px] uppercase tracking-widest border-b border-black pb-1 hover:opacity-50 transition-all">
          View all categories
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 h-auto lg:h-[900px]">
        {categories.map((cat, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className={`${cat.gridClass} group relative overflow-hidden bg-neutral-100`}>
            <Link href={cat.path} className="block h-full w-full">
              <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-500" />
              <div className="absolute top-8 left-8">
                <h3 className="text-white text-xl md:text-2xl font-display uppercase tracking-[0.1em] drop-shadow-sm">{cat.title}</h3>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
