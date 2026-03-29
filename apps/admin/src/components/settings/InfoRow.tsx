interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export default function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
      <span className="flex-shrink-0 text-zinc-400">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-[13px] font-medium text-zinc-700 truncate mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}
