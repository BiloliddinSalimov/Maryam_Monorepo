import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  id?: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * A visually grouped card section for form pages.
 * Has a header with title + optional icon, and a padded body.
 */
export default function SectionCard({
  id,
  title,
  icon,
  children,
  className,
}: SectionCardProps) {
  return (
    <div
      id={id}
      className={cn(
        "bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden",
        className,
      )}
    >
      <div
        className="flex items-center gap-2 px-5 py-3.5 border-b"
        style={{ borderColor: "#F0F2F5" }}
      >
        {icon && <span className="flex-shrink-0 text-zinc-400">{icon}</span>}
        <h2 className="text-[13px] font-semibold" style={{ color: "#1A2E44" }}>
          {title}
        </h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}
