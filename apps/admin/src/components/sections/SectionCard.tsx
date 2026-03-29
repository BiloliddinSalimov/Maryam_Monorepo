import { ChevronDown, ChevronUp, Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import { SECTION_TYPE_META } from "./SectionTypeSelector";
import type { Section } from "@/types/section";
import type { LangMap } from "@/types/category";

// ── Config summary ────────────────────────────────────────────────────────

function configSummary(section: Section): string {
  const cfg = section.config as Record<string, unknown>;
  switch (section.type) {
    case "BANNER":
      return "Bannerlar bo'limidan boshqariladi";
    case "PRODUCT_LIST":
      if (cfg?.productIds && (cfg.productIds as string[]).length > 0)
        return `${(cfg.productIds as string[]).length} ta mahsulot tanlangan`;
      if (cfg?.sortBy)
        return `Avtomatik · ${cfg.sortBy}${cfg.limit ? ` · ${cfg.limit} ta` : ""}`;
      return "Sozlanmagan";
    case "CATEGORY_LIST":
      if (cfg?.showAll) return `Barcha kategoriyalar${cfg.limit ? ` · ${cfg.limit} ta` : ""}`;
      if (cfg?.categoryIds && (cfg.categoryIds as string[]).length > 0)
        return `${(cfg.categoryIds as string[]).length} ta kategoriya`;
      return "Sozlanmagan";
    case "PROMO_BLOCK":
      return "Promo blok";
    default:
      return "—";
  }
}

// ── Props ─────────────────────────────────────────────────────────────────

interface Props {
  section: Section;
  lang: string;
  isFirst: boolean;
  isLast: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────

export default function SectionCard({
  section,
  lang,
  isFirst,
  isLast,
  onEdit,
  onDelete,
  onToggle,
  onMoveUp,
  onMoveDown,
}: Props) {
  const { icon: Icon, label, color, bg } = SECTION_TYPE_META[section.type];
  const title = (section.title as LangMap | undefined)?.[lang]
    ?? Object.values(section.title ?? {})[0]
    ?? label;

  return (
    <div className={`flex items-center gap-4 px-4 py-3.5 bg-white rounded-2xl border transition-all ${
      section.isActive ? "border-zinc-100 hover:border-zinc-200 hover:shadow-sm" : "border-zinc-100 opacity-55"
    }`}>
      {/* Order badge */}
      <div className="w-6 h-6 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
        <span className="text-[11px] font-bold text-zinc-500">{section.order}</span>
      </div>

      {/* Type icon */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${bg}`}>
        <Icon size={16} className={color} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-zinc-800 truncate">{title}</p>
        <p className="text-[11px] text-zinc-400 mt-0.5">{configSummary(section)}</p>
      </div>

      {/* Type badge */}
      <span className={`hidden sm:inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-lg border flex-shrink-0 ${bg} ${color}`}>
        {label}
      </span>

      {/* Reorder */}
      <div className="flex flex-col gap-0.5 flex-shrink-0">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          className="w-5 h-5 rounded flex items-center justify-center hover:bg-zinc-100 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
        >
          <ChevronUp size={13} className="text-zinc-500" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          className="w-5 h-5 rounded flex items-center justify-center hover:bg-zinc-100 transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
        >
          <ChevronDown size={13} className="text-zinc-500" />
        </button>
      </div>

      {/* Toggle active */}
      <button
        type="button"
        onClick={onToggle}
        title={section.isActive ? "Yashirish" : "Faollashtirish"}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all flex-shrink-0 ${
          section.isActive
            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
        }`}
      >
        {section.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
        {section.isActive ? "Faol" : "Yashirin"}
      </button>

      {/* Edit + Delete */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button
          type="button"
          onClick={onEdit}
          className="w-8 h-8 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center hover:bg-zinc-100 transition-colors"
        >
          <Pencil size={13} className="text-zinc-500" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="w-8 h-8 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center hover:bg-red-50 hover:border-red-100 transition-colors"
        >
          <Trash2 size={13} className="text-red-400" />
        </button>
      </div>
    </div>
  );
}
