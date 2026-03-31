import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/Navbar';
import { CartDrawer } from '@/components/CartDrawer';
import { MobileBottomBar } from '@/components/MobileBottomBar';

export const metadata: Metadata = {
  title: 'MARYAM — Luxury Fashion',
  description: 'Redefining high fashion with a minimalist touch. Quality, elegance, and timeless design.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main className="min-h-screen bg-brand-cream pb-32 md:pb-0">
            <Navbar />
            <CartDrawer />
            <MobileBottomBar />
            {children}
            <footer className="py-24 px-8 border-t border-brand-black/10 bg-brand-beige/30">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="col-span-1 md:col-span-2">
                  <h2 className="text-3xl font-display tracking-[0.3em] mb-6 uppercase">MARYAM</h2>
                  <p className="text-xs text-brand-black/60 max-w-xs leading-relaxed uppercase tracking-wider">
                    Redefining high fashion with a minimalist touch. Quality, elegance, and timeless design.
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold mb-6">Customer Service</h4>
                  <ul className="flex flex-col gap-4 text-[10px] uppercase tracking-widest text-brand-black/60">
                    <li><a href="#" className="hover:text-brand-black transition-colors">Shipping &amp; Returns</a></li>
                    <li><a href="#" className="hover:text-brand-black transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-brand-black transition-colors">Terms &amp; Conditions</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest font-bold mb-6">Follow Us</h4>
                  <ul className="flex flex-col gap-4 text-[10px] uppercase tracking-widest text-brand-black/60">
                    <li><a href="#" className="hover:text-brand-black transition-colors">Instagram</a></li>
                    <li><a href="#" className="hover:text-brand-black transition-colors">Pinterest</a></li>
                    <li><a href="#" className="hover:text-brand-black transition-colors">TikTok</a></li>
                  </ul>
                </div>
              </div>
              <div className="max-w-7xl mx-auto mt-24 pt-8 border-t border-brand-black/5 flex justify-between items-center">
                <p className="text-[8px] uppercase tracking-widest text-brand-black/40">© 2026 MARYAM FASHION. ALL RIGHTS RESERVED.</p>
                <div className="flex gap-4">
                  <div className="w-6 h-4 bg-brand-black/10 rounded-sm" />
                  <div className="w-6 h-4 bg-brand-black/10 rounded-sm" />
                  <div className="w-6 h-4 bg-brand-black/10 rounded-sm" />
                </div>
              </div>
            </footer>
          </main>
        </Providers>
      </body>
    </html>
  );
}
