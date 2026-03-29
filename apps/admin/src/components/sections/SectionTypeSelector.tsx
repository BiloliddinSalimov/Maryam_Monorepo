import { Image, Package, Tag, Zap } from "lucide-react";
import type { SectionType } from "@/types/section";

// ── Config ────────────────────────────────────────────────────────────────

export const SECTION_TYPE_META: Record<
  SectionType,
  { label: string; description: string; icon: React.ElementType; color: string; bg: string }
> = {
  BANNER: {
    label: "Banner",
    description: "Katta rasm + havola bloki",
    icon: Image,
    color: "text-sky-600",
    bg: "bg-sky-50 border-sky-200",
  },
  PRODUCT_LIST: {
    label: "Mahsulotlar ro'yxati",
    description: "Tanlangan yoki avtomatik mahsulotlar",
    icon: Package,
    color: "text-orange-500",
    bg: "bg-orange-50 border-orange-200",
  },
  CATEGORY_LIST: {
    label: "Kategoriyalar ro'yxati",
    description: "Tanlangan yoki barcha kategoriyalar",
    icon: Tag,
    color: "text-violet-600",
    bg: "bg-violet-50 border-violet-200",
  },
  PROMO_BLOCK: {
    label: "Promo blok",
    description: "Reklama yoki e'lon bloki",
    icon: Zap,
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
  },
};

// ── Component ─────────────────────────────────────────────────────────────

interface Props {
  value: SectionType | null;
  onChange: (type: SectionType) => void;
}

export default function SectionTypeSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {(Object.keys(SECTION_TYPE_META) as SectionType[]).map((type) => {
        const { label, description, icon: Icon, color, bg } = SECTION_TYPE_META[type];
        const isSelected = value === type;
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
              isSelected
                ? "border-[#1A2E44] bg-[#1A2E44]/4 shadow-sm"
                : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
            }`}
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
              isSelected ? "bg-[#1A2E44]/10 border-[#1A2E44]/20" : bg
            }`}>
              <Icon size={17} className={isSelected ? "text-[#1A2E44]" : color} />
            </div>
            <div className="min-w-0">
              <p className={`text-[13px] font-semibold ${isSelected ? "text-[#1A2E44]" : "text-zinc-800"}`}>
                {label}
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5 leading-tight">{description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
