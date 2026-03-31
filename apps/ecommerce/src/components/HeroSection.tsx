'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <img
          src="https://www.marthastewart.com/thmb/NDl4VVAvQZgsFTsfqsyYrh4MVHk=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/smart-ways-to-elevate-closet-accessories-1023-1dbddc68f0834ec5b53001102769d8f6.jpg"
          alt="High Fashion"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      <div className="relative z-10 text-center text-white">
        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="text-xs uppercase tracking-[0.5em] mb-4">
          {t('hero.subtitle')}
        </motion.p>
        <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }} className="text-6xl md:text-8xl font-display mb-8 tracking-tight">
          {t('hero.title')}
        </motion.h1>
        <motion.button initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1, duration: 0.8 }} whileHover={{ scale: 1.05 }} className="px-10 py-4 border border-white text-white uppercase text-[10px] tracking-widest hover:bg-white hover:text-brand-black transition-all duration-300">
          {t('hero.cta')}
        </motion.button>
      </div>
    </section>
  );
};
