import React from "react";
import { motion } from "motion/react";

export const PromoBanner = ({ image }: { image: string }) => {
  return (
    <section className="relative h-[60vh] w-full overflow-hidden flex items-center px-8 md:px-24 mt-24">
      <div className="absolute inset-0">
        <img
          src={image}
          alt="Promo Banner"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-brand-black/30" />
      </div>

      <div className="relative z-10 max-w-2xl text-white">
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-[10px] uppercase tracking-[0.4em] mb-6 block"
        >
          Limited Edition
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-display mb-8 leading-tight"
        >
          The Art of <br /> <span className="italic">Modern Tailoring</span>
        </motion.h2>
        <motion.button
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="px-8 py-4 bg-white text-brand-black uppercase text-[10px] tracking-widest hover:bg-brand-black hover:text-white transition-all duration-300"
        >
          Discover The Collection
        </motion.button>
      </div>
    </section>
  );
};
