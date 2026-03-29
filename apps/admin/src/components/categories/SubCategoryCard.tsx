import { ChevronRight, Pencil, Tag, Trash2 } from "lucide-react";
import type { Category } from "@/types/category";

interface Props {
  category: Category;
  displayName: string;
  onEdit: () => void;
  onDelete: () => void;
  onDrillIn: () => void;
}

/**
 * Grid card for a sub-category in the right panel.
 * Clicking anywhere on the card drills into it.
 * Edit / Delete buttons appear on hover (top-right).
 */
export default function SubCategoryCard({
  category,
  displayName,
  onEdit,
  onDelete,
  onDrillIn,
}: Props) {
  const childCount = category.children?.length ?? 0;

  return (
    <div
      className="group relative flex flex-col rounded-xl border border-zinc-100 bg-white hover:border-[#1A2E44]/30 hover:shadow-sm transition-all overflow-hidden cursor-pointer"
      onClick={onDrillIn}
    >
      {/* Edit / Delete — visible on hover */}
      <div
        className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onEdit}
          className="w-6 h-6 rounded-lg bg-white/95 border border-zinc-200 flex items-center justify-center hover:bg-zinc-50 shadow-sm"
        >
          <Pencil size={11} className="text-zinc-500" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="w-6 h-6 rounded-lg bg-white/95 border border-zinc-200 flex items-center justify-center hover:bg-red-50 shadow-sm"
        >
          <Trash2 size={11} className="text-red-400" />
        </button>
      </div>

      {/* Image */}
      <div className="w-full h-24 flex-shrink-0 bg-zinc-50 flex items-center justify-center overflow-hidden">
        {category.image ? (
          <img
            src={category.image}
            alt={displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <Tag size={22} className="text-zinc-200" />
        )}
      </div>

      {/* Info */}
      <div className="px-2.5 py-2 flex flex-col gap-1 flex-1">
        <p className="text-[12px] font-semibold text-zinc-800 leading-tight line-clamp-2">
          {displayName}
        </p>

        <div className="flex items-center justify-between mt-auto pt-1">
          {childCount > 0 ? (
            <span className="text-[10px] font-medium text-[#1A2E44]/70 bg-[#1A2E44]/8 px-1.5 py-0.5 rounded-md">
              {childCount} ichki
            </span>
          ) : (
            <span className="text-[10px] text-zinc-300">bo'sh</span>
          )}
          <ChevronRight
            size={13}
            className="text-zinc-300 group-hover:text-[#1A2E44] transition-colors flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
