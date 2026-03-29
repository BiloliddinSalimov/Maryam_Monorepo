import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, CheckCircle2, MapPin, Truck, ShieldCheck, Send, AlertCircle } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useOrderStore, Order } from '../store/useOrderStore';
import MapPicker from '../components/MapPicker';

const generateOrderId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `REQ-${crypto.randomUUID().replace(/-/g, '').substring(0, 9).toUpperCase()}`;
  }
  return `REQ-${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCartStore();
  const addOrder = useOrderStore((state) => state.addOrder);
  const cartTotal = total();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    window.scrollTo(0, 0);
    return () => setIsMounted(false);
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    country: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<typeof formData>>({});
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (isMounted && items.length === 0 && !isSuccess) {
      navigate('/');
    }
  }, [items, navigate, isSuccess, isMounted]);

  const handleSetCoordinates = useCallback((coords: { lat: number; lng: number }) => {
    setCoordinates(coords);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof typeof formData]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }, [formErrors]);

  const validateForm = (): boolean => {
    const errors: Partial<typeof formData> = {};

    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!EMAIL_REGEX.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.address.trim()) errors.address = 'Address is required';
    if (!formData.city.trim()) errors.city = 'City is required';
    if (!formData.country.trim()) errors.country = 'Country is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newOrderId = generateOrderId();

      const newOrder: Order = {
        id: newOrderId,
        items: [...items],
        total: cartTotal,
        date: new Date().toLocaleDateString(),
        status: 'Processing',
        shippingAddress: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          country: formData.country.trim(),
          coordinates: coordinates || undefined,
        },
      };

      addOrder(newOrder);
      clearCart();
      setOrderId(newOrderId);
      setIsSuccess(true);
    } catch {
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-40 pb-24 px-8 max-w-2xl mx-auto text-center min-h-screen">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="w-24 h-24 bg-brand-beige rounded-full flex items-center justify-center mb-8">
            <CheckCircle2 size={48} className="text-brand-black" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.4em] text-brand-black/40 mb-4 block">Request Sent</span>
          <h1 className="text-5xl font-display mb-6 uppercase tracking-tight">Thank <span className="italic text-brand-gold">You</span></h1>
          <p className="text-xs uppercase tracking-widest text-brand-black/60 mb-12 leading-relaxed">
            Your order request has been sent successfully. Our team will contact you shortly to confirm the details.
          </p>
          <div className="w-full p-8 border border-brand-black/5 bg-brand-beige/20 mb-12 text-left">
            <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4">Request Summary</h4>
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-brand-black/60 mb-2">
              <span>Request ID</span>
              <span className="font-bold text-brand-black">#{orderId}</span>
            </div>
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-brand-black/60 mb-2">
              <span>Name</span>
              <span className="font-bold text-brand-black">{formData.fullName}</span>
            </div>
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-brand-black/60">
              <span>Status</span>
              <span className="font-bold text-brand-black">Awaiting Confirmation</span>
            </div>
          </div>
          <Link
            to="/"
            className="px-12 py-5 bg-brand-black text-white text-[10px] uppercase tracking-[0.3em] font-medium inline-flex items-center gap-3 hover:bg-brand-black/90 transition-all group"
          >
            Continue Browsing
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-40 pb-24 px-8 max-w-7xl mx-auto min-h-screen">
      <div className="mb-16">
        <Link to="/" className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-brand-black/40 mb-8 hover:text-brand-black transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Shopping
        </Link>
        <h1 className="text-5xl font-display uppercase tracking-tight">Order <span className="italic">Request</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-12">
          <form onSubmit={handleSubmit} noValidate className="space-y-12">
            {/* Shipping Info */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-brand-black text-white flex items-center justify-center text-[10px] font-bold">1</div>
                <h2 className="text-xs uppercase tracking-[0.3em] font-bold">Contact Details</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-brand-black/40 font-bold">Full Name</label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={`w-full bg-transparent border-b py-3 text-[10px] tracking-widest uppercase focus:outline-none transition-colors ${formErrors.fullName ? 'border-red-400' : 'border-brand-black/10 focus:border-brand-black'}`}
                  />
                  {formErrors.fullName && (
                    <p className="text-[9px] text-red-500 uppercase tracking-widest flex items-center gap-1">
                      <AlertCircle size={10} />{formErrors.fullName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-brand-black/40 font-bold">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-transparent border-b py-3 text-[10px] tracking-widest uppercase focus:outline-none transition-colors ${formErrors.email ? 'border-red-400' : 'border-brand-black/10 focus:border-brand-black'}`}
                  />
                  {formErrors.email && (
                    <p className="text-[9px] text-red-500 uppercase tracking-widest flex items-center gap-1">
                      <AlertCircle size={10} />{formErrors.email}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Map Section */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-full bg-brand-black text-white flex items-center justify-center text-[10px] font-bold">2</div>
                <h2 className="text-xs uppercase tracking-[0.3em] font-bold">Delivery Location</h2>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-brand-black/40 mb-6">Select your exact location on the map for precise delivery.</p>
              <div className="h-100 w-full bg-brand-beige border border-brand-black/5 relative z-10 overflow-hidden">
                <MapPicker onLocationSelect={handleSetCoordinates} />
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-brand-black/40 font-bold">Street Address / Landmark</label>
                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`w-full bg-transparent border-b py-3 text-[10px] tracking-widest uppercase focus:outline-none transition-colors ${formErrors.address ? 'border-red-400' : 'border-brand-black/10 focus:border-brand-black'}`}
                  />
                  {formErrors.address && (
                    <p className="text-[9px] text-red-500 uppercase tracking-widest flex items-center gap-1">
                      <AlertCircle size={10} />{formErrors.address}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-brand-black/40 font-bold">City</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full bg-transparent border-b py-3 text-[10px] tracking-widest uppercase focus:outline-none transition-colors ${formErrors.city ? 'border-red-400' : 'border-brand-black/10 focus:border-brand-black'}`}
                  />
                  {formErrors.city && (
                    <p className="text-[9px] text-red-500 uppercase tracking-widest flex items-center gap-1">
                      <AlertCircle size={10} />{formErrors.city}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-brand-black/40 font-bold">Country</label>
                  <input
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className={`w-full bg-transparent border-b py-3 text-[10px] tracking-widest uppercase focus:outline-none transition-colors ${formErrors.country ? 'border-red-400' : 'border-brand-black/10 focus:border-brand-black'}`}
                  />
                  {formErrors.country && (
                    <p className="text-[9px] text-red-500 uppercase tracking-widest flex items-center gap-1">
                      <AlertCircle size={10} />{formErrors.country}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {submitError && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 text-red-600">
                <AlertCircle size={16} />
                <p className="text-[10px] uppercase tracking-widest">{submitError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-6 bg-brand-black text-white text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-brand-black/90 transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Sending Request...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Order Request — ${cartTotal}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Summary Section */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-40 space-y-8">
            <div className="p-8 border border-brand-black/5 bg-brand-beige/10">
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold mb-8 flex items-center gap-2">
                <ShoppingBag size={16} />
                Request Summary
              </h3>
              <div className="space-y-6 mb-8 max-h-60 overflow-y-auto pr-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 aspect-3/4 bg-brand-beige overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[10px] uppercase tracking-widest font-bold mb-1 truncate">{item.name}</h4>
                      <p className="text-[8px] uppercase tracking-widest text-brand-black/40">${item.price} × {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 pt-8 border-t border-brand-black/5">
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-brand-black/40">
                  <span>Subtotal</span>
                  <span>${cartTotal}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase tracking-widest text-brand-black/40">
                  <span>Shipping</span>
                  <span className="text-brand-gold">Free</span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-4 border-t border-brand-black/5">
                  <span className="uppercase tracking-widest">Total</span>
                  <span>${cartTotal}</span>
                </div>
              </div>
            </div>

            <div className="p-8 border border-brand-black/5 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Truck size={20} className="text-brand-black/40" />
                <div>
                  <h5 className="text-[10px] uppercase tracking-widest font-bold">Express Delivery</h5>
                  <p className="text-[8px] uppercase tracking-widest text-brand-black/40">3-5 Business Days</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ShieldCheck size={20} className="text-brand-black/40" />
                <div>
                  <h5 className="text-[10px] uppercase tracking-widest font-bold">Secure Request</h5>
                  <p className="text-[8px] uppercase tracking-widest text-brand-black/40">Encrypted Data Transmission</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
