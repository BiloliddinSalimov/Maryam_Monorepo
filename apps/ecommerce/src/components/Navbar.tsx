'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, Heart, Globe } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { useUIStore } from '@/store/useUIStore';
import Logo from "../../public/svg/Maryam_logo.svg"
import LogoDark from "../../public/svg/Maryam_logo_darc.svg"
import Image from 'next/image';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const openCart = useUIStore((state) => state.openCart);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const langs = ['en', 'uz', 'ru'];
    const nextLang = langs[(langs.indexOf(i18n.language) + 1) % langs.length];
    i18n.changeLanguage(nextLang);
  };

  return (
    <nav className={cn(
      'fixed top-0 left-0 w-full z-50 transition-all duration-500 py-10 px-8 flex justify-between items-center',
      // Bu yerda text rangini boshqaramiz:
      // Scroll bo'lmaganda text-white, scroll bo'lganda text-black (yoki brand-black)
      isScrolled 
        ? 'bg-brand-cream/90 backdrop-blur-md py-8 shadow-sm text-black' 
        : 'bg-transparent text-white',
    )}>
      <div className="hidden lg:flex gap-8 items-center">
        <Link href="/category/clothing" className="text-xs uppercase tracking-widest hover:opacity-50 transition-opacity">
          {t('nav.shop')}
        </Link>
        <Link href="/category/accessories" className="text-xs uppercase tracking-widest hover:opacity-50 transition-opacity">
          {t('nav.collections')}
        </Link>
        <Link href="/orders" className="text-xs uppercase tracking-widest hover:opacity-50 transition-opacity">
          Orders
        </Link>
      </div>

      <div className="lg:hidden w-10" />

      <div className="absolute left-1/2 -translate-x-1/2">
        <Link href="/">
         
          {isScrolled ? <Image src={Logo} alt="Logo"  width={100} height={100} /> : <Image src={LogoDark} alt="Logo"  width={70} height={70} />}
        </Link>
      </div>

      <div className="flex gap-3 md:gap-6 items-center">
        <button onClick={toggleLanguage} className="hidden sm:flex items-center gap-1 text-[10px] uppercase tracking-widest hover:opacity-50">
          <Globe size={14} />{i18n.language}
        </button>
        <Link href="/wishlist" className="hidden sm:block hover:opacity-50 transition-opacity">
          <Heart size={20} strokeWidth={1.5} />
        </Link>
        <button onClick={openCart} className="relative hover:opacity-50 transition-opacity p-2">
          <ShoppingBag size={20} strokeWidth={1.5}  className='lg:block hidden' />
          {cartItems.length > 0 && (
            <span className="absolute top-1 right-1 bg-brand-gold text-brand-black text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartItems.length}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};