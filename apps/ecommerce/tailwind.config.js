/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brand-beige': '#F5EEDC',
        'brand-cream': '#FAF9F6',
        'brand-black': '#1A1A1A',
        'brand-gold': '#D4AF37',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      letterSpacing: {
        'widest-extra': '0.2em',
      },
    },
  },
  plugins: [],
};
