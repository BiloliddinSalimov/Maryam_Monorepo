'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Package, Clock, CheckCircle2, MapPin } from 'lucide-react';
import { useOrderStore } from '@/store/useOrderStore';

export default function OrdersPage() {
  const { orders } = useOrderStore();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="pt-40 pb-24 px-8 max-w-7xl mx-auto min-h-screen">
      <div className="text-center mb-20">
        <span className="text-[10px] uppercase tracking-[0.4em] text-brand-black/40 mb-4 block">Request History</span>
        <h1 className="text-5xl font-display mb-6 tracking-tight uppercase">Your <span className="italic text-brand-gold">Requests</span></h1>
        <p className="text-xs uppercase tracking-widest text-brand-black/40 max-w-md mx-auto leading-relaxed">
          Track your order requests and view your history.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-brand-beige rounded-full flex items-center justify-center mx-auto mb-8">
            <Package size={32} className="text-brand-black/10" />
          </div>
          <p className="text-[10px] uppercase tracking-widest text-brand-black/40 mb-8">You haven&apos;t sent any requests yet</p>
          <Link href="/" className="px-12 py-5 bg-brand-black text-white text-[10px] uppercase tracking-[0.3em] font-medium inline-flex items-center gap-3 hover:bg-brand-black/90 transition-all group">
            Start Shopping <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {orders.map((order, i) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.1 }} className="border border-brand-black/5 bg-white p-8 md:p-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12 pb-8 border-b border-brand-black/5">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-widest font-bold">Request #{order.id}</span>
                    <span className="px-3 py-1 bg-brand-beige text-[8px] uppercase tracking-widest font-bold rounded-full flex items-center gap-1.5">
                      <Clock size={10} /> {order.status}
                    </span>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-brand-black/40">Sent on {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest text-brand-black/40 mb-1">Total Amount</p>
                  <p className="text-xl font-bold">${order.total}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4">Items</h4>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-6 items-center">
                      <div className="w-16 aspect-[3/4] bg-brand-beige overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-[10px] uppercase tracking-widest font-bold mb-1">{item.name}</h5>
                        <p className="text-[8px] uppercase tracking-widest text-brand-black/40">{item.category}</p>
                      </div>
                      <p className="text-xs font-medium">${item.price}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-8">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4">Delivery Location</h4>
                    <div className="text-[10px] uppercase tracking-widest text-brand-black/60 leading-relaxed space-y-1">
                      <p className="font-bold text-brand-black">{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.address}</p>
                      <p>{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                      <p>{order.shippingAddress.email}</p>
                      {order.shippingAddress.coordinates && (
                        <p className="text-brand-gold mt-2 flex items-center gap-2">
                          <MapPin size={12} /> GPS: {order.shippingAddress.coordinates.lat.toFixed(4)}, {order.shippingAddress.coordinates.lng.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="pt-8 border-t border-brand-black/5">
                    <div className="flex items-center gap-3 text-brand-black/40">
                      <CheckCircle2 size={16} />
                      <span className="text-[10px] uppercase tracking-widest font-bold">Secure Delivery Guaranteed</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
