import type { ReactNode, ElementType } from "react";
import { Plus } from "lucide-react";

interface PageHeroProps {
  /** Icon shown left of the title */
  icon: ElementType;
  title: string;
  /** Optional short stat line below the title */
  stats?: { value: string | number; label: string }[];
  /** Button label — if provided, renders the add button */
  actionLabel?: string;
  onAction?: () => void;
  /** Replace the default add button with custom content */
  actionSlot?: ReactNode;
}

/**
 * Reusable gradient hero header — used on all list pages
 * (Products, Banners, Homepage sections, etc.)
 * Matches the visual style of HomePage's hero banner.
 */
export default function PageHero({
  icon: Icon,
  title,
  stats,
  actionLabel,
  onAction,
  actionSlot,
}: PageHeroProps) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden px-6 py-5 mb-6"
      style={{
        background:
          "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 55%, #3d6491 100%)",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute bottom-0 right-24 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute top-3 right-14 w-10 h-10 rounded-full bg-white/5 pointer-events-none" />

      <div className="relative flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
            <Icon size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-white text-[18px] font-bold leading-tight">
              {title}
            </h1>
            {stats && stats.length > 0 && (
              <div className="flex items-center gap-4 mt-2">
                {stats.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {i > 0 && (
                      <div className="w-px h-5 bg-white/15" />
                    )}
                    <div>
                      <span className="text-white text-[16px] font-bold leading-none">
                        {s.value}
                      </span>
                      <span className="text-white/50 text-[11px] ml-1.5">
                        {s.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        {actionSlot ??
          (actionLabel && onAction ? (
            <button
              type="button"
              onClick={onAction}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[13px] font-semibold transition-all backdrop-blur-sm border border-white/20 flex-shrink-0"
            >
              <Plus size={15} />
              {actionLabel}
            </button>
          ) : null)}
      </div>
    </div>
  );
}
