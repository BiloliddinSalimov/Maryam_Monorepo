import { useFormContext } from "react-hook-form";
import { Tag } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useCategories } from "@/hooks/useCategories";
import { useCatName } from "@/hooks/useCatName";

/**
 * Config form for CATEGORY_LIST section type.
 * Reads/writes: categoryMode, categoryIds, limit from form context.
 */
export default function CategoryListConfig() {
  const { watch, setValue } = useFormContext();
  const { categories } = useCategories();
  const getName = useCatName();

  const categoryMode: "manual" | "showAll" = watch("categoryMode") ?? "showAll";
  const categoryIds: string[] = watch("categoryIds") ?? [];
  const limit: number = watch("limit") ?? 12;

  const toggleCategory = (id: string) => {
    setValue(
      "categoryIds",
      categoryIds.includes(id) ? categoryIds.filter((x) => x !== id) : [...categoryIds, id],
    );
  };

  return (
    <div className="space-y-4">
      {/* Mode switcher */}
      <div className="flex rounded-xl border border-zinc-200 overflow-hidden">
        {(["showAll", "manual"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setValue("categoryMode", mode)}
            className={`flex-1 py-2.5 text-[13px] font-semibold transition-colors ${
              categoryMode === mode
                ? "bg-[#1A2E44] text-white"
                : "bg-white text-zinc-500 hover:bg-zinc-50"
            }`}
          >
            {mode === "showAll" ? "Barchasini ko'rsatish" : "Qo'lda tanlash"}
          </button>
        ))}
      </div>

      {categoryMode === "showAll" ? (
        /* showAll mode: only limit */
        <div className="space-y-1.5">
          <label className="text-[12px] font-medium text-zinc-600">Limit (nechta ko'rsatilsin)</label>
          <Input
            type="number"
            min={1}
            max={100}
            value={limit}
            onChange={(e) => setValue("limit", Number(e.target.value))}
            className="h-9 text-[13px] w-28"
          />
        </div>
      ) : (
        /* Manual mode: category picker */
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-zinc-600">
              Kategoriyalar tanlash
            </label>
            {categoryIds.length > 0 && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#1A2E44] text-white">
                {categoryIds.length} ta
              </span>
            )}
          </div>

          <div className="max-h-52 overflow-y-auto rounded-xl border border-zinc-100 divide-y divide-zinc-50 bg-white">
            {categories.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-400">Kategoriya topilmadi</div>
            ) : (
              categories.map((cat) => {
                const isSelected = categoryIds.includes(cat.id);
                const name = getName(cat.name);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      isSelected ? "bg-[#1A2E44]/4" : "hover:bg-zinc-50"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                      isSelected ? "bg-[#1A2E44] border-[#1A2E44]" : "border-zinc-300"
                    }`}>
                      {isSelected && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-100 bg-zinc-50 flex items-center justify-center flex-shrink-0">
                      {cat.image
                        ? <img src={cat.image} alt={name} className="w-full h-full object-cover" />
                        : <Tag size={12} className="text-zinc-300" />
                      }
                    </div>
                    <p className="text-[12px] font-medium text-zinc-800 truncate flex-1">{name}</p>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
