import { useState } from "react";
import { Package, Search } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { useProducts } from "@/hooks/useProducts";
import { useLanguages } from "@/hooks/useLanguages";
import type { Product } from "@/types/product";
import type { SortBy } from "@/types/section";

// ── Helpers ───────────────────────────────────────────────────────────────

function getProductThumb(product: Product): string | null {
  const raw = product.images?.[0];
  if (!raw) return null;
  if (typeof raw === "string") return raw;
  return (raw as { fullUrl?: string; url: string }).fullUrl
    ?? (raw as { url: string }).url
    ?? null;
}

const SORT_OPTIONS: { value: SortBy; label: string }[] = [
  { value: "newest",     label: "Yangilaridan" },
  { value: "oldest",     label: "Eskilaridan" },
  { value: "price_asc",  label: "Narx: arzondan" },
  { value: "price_desc", label: "Narx: qimmatdan" },
];

// ── Component ─────────────────────────────────────────────────────────────

/**
 * Config form for PRODUCT_LIST section type.
 * Reads/writes: productMode, productIds, sortBy, limit from form context.
 */
export default function ProductListConfig() {
  const { watch, setValue } = useFormContext();
  const { products } = useProducts();
  const { languages } = useLanguages();
  const [search, setSearch] = useState("");

  const productMode: "manual" | "auto" = watch("productMode") ?? "auto";
  const productIds: string[] = watch("productIds") ?? [];
  const sortBy: SortBy = watch("sortBy") ?? "newest";
  const limit: number = watch("limit") ?? 8;

  const defaultLang =
    languages.find((l) => l.isDefault)?.code ??
    languages.find((l) => l.isActive)?.code ??
    "uz";

  const filtered = products.filter((p) => {
    if (!search) return true;
    const name = p.name[defaultLang] ?? Object.values(p.name)[0] ?? "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const toggleProduct = (id: string) => {
    setValue(
      "productIds",
      productIds.includes(id) ? productIds.filter((x) => x !== id) : [...productIds, id],
    );
  };

  return (
    <div className="space-y-4">
      {/* Mode switcher */}
      <div className="flex rounded-xl border border-zinc-200 overflow-hidden">
        {(["auto", "manual"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setValue("productMode", mode)}
            className={`flex-1 py-2.5 text-[13px] font-semibold transition-colors ${
              productMode === mode
                ? "bg-[#1A2E44] text-white"
                : "bg-white text-zinc-500 hover:bg-zinc-50"
            }`}
          >
            {mode === "auto" ? "Avtomatik" : "Qo'lda tanlash"}
          </button>
        ))}
      </div>

      {productMode === "auto" ? (
        /* Auto mode: sortBy + limit */
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-zinc-600">Tartib</label>
            <select
              value={sortBy}
              onChange={(e) => setValue("sortBy", e.target.value as SortBy)}
              className="w-full h-9 px-2.5 rounded-lg border border-zinc-200 text-[13px] text-zinc-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1A2E44]/20 focus:border-[#1A2E44]/40"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-zinc-600">Limit</label>
            <Input
              type="number"
              min={1}
              max={50}
              value={limit}
              onChange={(e) => setValue("limit", Number(e.target.value))}
              className="h-9 text-[13px]"
            />
          </div>
        </div>
      ) : (
        /* Manual mode: product picker */
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-zinc-600">
              Mahsulotlar tanlash
            </label>
            {productIds.length > 0 && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#1A2E44] text-white">
                {productIds.length} ta
              </span>
            )}
          </div>

          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <Input
              placeholder="Mahsulot qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-[13px]"
            />
          </div>

          <div className="max-h-52 overflow-y-auto rounded-xl border border-zinc-100 divide-y divide-zinc-50 bg-white">
            {filtered.length === 0 ? (
              <div className="py-6 text-center text-xs text-zinc-400">Mahsulot topilmadi</div>
            ) : (
              filtered.map((product) => {
                const isSelected = productIds.includes(product.id);
                const thumb = getProductThumb(product);
                const name = product.name[defaultLang] ?? Object.values(product.name)[0] ?? "—";
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggleProduct(product.id)}
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
                      {thumb
                        ? <img src={thumb} alt={name} className="w-full h-full object-cover" />
                        : <Package size={12} className="text-zinc-300" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-zinc-800 truncate">{name}</p>
                      <p className="text-[11px] text-zinc-400">{product.price.toLocaleString()} so'm</p>
                    </div>
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
