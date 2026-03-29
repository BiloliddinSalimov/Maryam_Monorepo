import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { ProductCard } from "../components/ProductCard";
import { ALL_PRODUCTS } from "../data/products";

export const CategoryPage = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryName]);

  const filteredProducts = ALL_PRODUCTS.filter(
    (p) => p.category.toLowerCase() === categoryName?.toLowerCase(),
  );

  return (
    <div className="pt-32 pb-24 px-8 max-w-7xl mx-auto min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-brand-black/40 mb-4 block">
          Collection
        </span>
        <h1 className="text-5xl md:text-7xl font-display uppercase tracking-tight">
          {categoryName}
        </h1>
      </motion.div>

      <div className="flex justify-between items-center mb-12 border-b border-brand-black/10 pb-6">
        <p className="text-[10px] uppercase tracking-widest text-brand-black/60">
          Showing {filteredProducts.length} results
        </p>
        <div className="flex gap-8 text-[10px] uppercase tracking-widest">
          <button className="hover:opacity-50 transition-opacity">
            Sort By
          </button>
          <button className="hover:opacity-50 transition-opacity">
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
        {filteredProducts.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-24 text-center">
          <p className="text-xs uppercase tracking-widest text-brand-black/40">
            No products found in this category.
          </p>
        </div>
      )}
    </div>
  );
};
