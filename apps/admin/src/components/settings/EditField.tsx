interface EditFieldProps {
  label: string;
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}

export default function EditField({ label, icon, error, children }: EditFieldProps) {
  return (
    <div>
      <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">
        {label}
      </p>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
          {icon}
        </span>
        {children}
      </div>
      {error && (
        <p className="text-[11px] text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
