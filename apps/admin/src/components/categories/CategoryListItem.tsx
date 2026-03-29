import { ChevronRight, GripVertical } from "lucide-react";
import CategoryImage from "./CategoryImage";
import type { Category } from "@/types/category";

interface Props {
  category: Category;
  displayName: string;
  selected: boolean;
  subCount: number;
  onClick: () => void;
}

/**
 * Left-panel row item for a root category.
 */
export default function CategoryListItem({
  category,
  displayName,
  selected,
  subCount,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all group ${
        selected
          ? "bg-[#1A2E44] text-white shadow-sm"
          : "hover:bg-zinc-50 text-zinc-700"
      }`}
    >
      <GripVertical
        size={14}
        className={`flex-shrink-0 ${selected ? "text-white/30" : "text-zinc-300"}`}
      />

      <CategoryImage src={category.image} name={displayName} size="sm" />

      <span className="flex-1 min-w-0 text-[13px] font-medium truncate">
        {displayName}
      </span>

      {subCount > 0 && (
        <span
          className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0 ${
            selected ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
          }`}
        >
          {subCount}
        </span>
      )}

      <ChevronRight
        size={13}
        className={`flex-shrink-0 transition-opacity ${
          selected
            ? "text-white/60 opacity-100"
            : "text-zinc-300 opacity-0 group-hover:opacity-100"
        }`}
      />
    </button>
  );
}
