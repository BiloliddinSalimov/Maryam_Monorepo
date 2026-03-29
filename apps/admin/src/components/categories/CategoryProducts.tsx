import { ArrowRight, Package } from "lucide-react";
import { useProductsByCategory } from "@/hooks/useProducts";
import type { LangMap } from "@/types/category";
import type { Product } from "@/types/product";

// ── Helper ────────────────────────────────────────────────────────────────

function getProductThumb(product: Product): string | null {
  const raw = product.images?.[0];
  if (!raw) return null;
  if (typeof raw === "string") return raw;
  return (
    (raw as { fullUrl?: string; url: string }).fullUrl ??
    (raw as { url: string }).url ??
    null
  );
}

// ── Props ─────────────────────────────────────────────────────────────────

interface Props {
  categoryId: string;
  getName: (name: LangMap | undefined) => string;
  onNavigate: (path: string) => void;
}

/**
 * Shows products linked to the selected category.
 * Designed to sit inside a white rounded-2xl card wrapper.
 */
export default function CategoryProducts({
  categoryId,
  getName,
  onNavigate,
}: Props) {
  const { products, isLoading } = useProductsByCategory(categoryId);

  return (
    <>
      {/* ── Card header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FEF3C7] flex items-center justify-center">
            <Package size={13} className="text-[#F59E0B]" />
          </div>
          <span className="text-[14px] font-semibold text-zinc-800">
            Mahsulotlar
          </span>
          {!isLoading && products.length > 0 && (
            <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-500">
              {products.length}
            </span>
          )}
        </div>
        {products.length > 0 && (
          <button
            type="button"
            onClick={() => onNavigate(`/products?categoryId=${categoryId}`)}
            className="flex items-center gap-1 text-[12px] text-zinc-400 hover:text-zinc-700 font-medium transition-colors"
          >
            Barchasi <ArrowRight size={12} />
          </button>
        )}
      </div>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 rounded-xl bg-zinc-100 animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-zinc-200">
            <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
              <Package size={15} className="text-zinc-300" />
            </div>
            <div>
              <p className="text-[13px] font-medium text-zinc-500">
                Mahsulot yo'q
              </p>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Bu kategoriyaga hali mahsulot biriktirilmagan
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            {products.slice(0, 6).map((product) => {
              const thumb = getProductThumb(product);
              const name = getName(product.name as LangMap);
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => onNavigate(`/products/${product.id}/edit`)}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-zinc-50 transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border border-zinc-100 bg-zinc-50 flex items-center justify-center">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package size={13} className="text-zinc-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-zinc-700 truncate">
                      {name}
                    </p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      {product.price.toLocaleString()} so'm
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p
                      className={`text-[11px] font-semibold ${
                        product.stock === 0
                          ? "text-red-400"
                          : product.stock < 5
                            ? "text-amber-500"
                            : "text-emerald-500"
                      }`}
                    >
                      {product.stock === 0
                        ? "Tugagan"
                        : `${product.stock} dona`}
                    </p>
                  </div>
                </button>
              );
            })}

            {products.length > 6 && (
              <button
                type="button"
                onClick={() =>
                  onNavigate(`/products?categoryId=${categoryId}`)
                }
                className="w-full flex items-center justify-center gap-1.5 py-2.5 text-[12px] font-medium text-zinc-400 hover:text-[#1A2E44] transition-colors rounded-xl hover:bg-zinc-50"
              >
                Yana {products.length - 6} ta mahsulot
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
