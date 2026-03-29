import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const NewsletterBanner = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !EMAIL_REGEX.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // TODO: wire up to real email API
    setSubmitted(true);
  };

  return (
    <section className="py-32 px-8 bg-brand-beige/50">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-brand-black/40 mb-6 block">Stay Connected</span>
          <h2 className="text-4xl md:text-5xl font-display mb-8">Join the <span className="italic">Inner Circle</span></h2>
          <p className="text-xs uppercase tracking-widest text-brand-black/60 mb-12 max-w-md mx-auto leading-relaxed">
            Subscribe to receive early access to new collections, exclusive events, and fashion insights.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {submitted ? (
            <div className="flex items-center justify-center gap-3 text-brand-black">
              <CheckCircle2 size={18} />
              <p className="text-[10px] uppercase tracking-widest font-bold">You're subscribed! Welcome to the inner circle.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto"
            >
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="ENTER YOUR EMAIL"
                  className={`w-full bg-transparent border-b py-4 text-[10px] tracking-widest uppercase focus:outline-none transition-colors ${error ? 'border-red-400 placeholder:text-red-400' : 'border-brand-black/20 focus:border-brand-black'}`}
                />
                {error && (
                  <p className="text-[9px] text-red-500 uppercase tracking-widest mt-1 text-left">{error}</p>
                )}
              </div>
              <button
                type="submit"
                className="px-10 py-4 bg-brand-black text-white text-[10px] uppercase tracking-widest hover:bg-brand-black/80 transition-all flex items-center justify-center gap-2 group"
              >
                Subscribe
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};
