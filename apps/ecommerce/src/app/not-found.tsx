import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
      <h2 className="text-4xl font-display mb-4 uppercase tracking-widest">Page Not Found</h2>
      <p className="text-sm text-brand-black/60 mb-8 uppercase tracking-wider">
        The requested page does not exist or has been moved.
      </p>
      <Link 
        href="/"
        className="px-8 py-3 bg-brand-black text-white text-[10px] uppercase tracking-widest hover:bg-brand-black/90 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
