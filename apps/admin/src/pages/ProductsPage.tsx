import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/errorMessage";
import PageHero from "@/components/shared/PageHero";
import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";

import { useProducts, useDeleteProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useLanguages } from "@/hooks/useLanguages";
import type { Product } from "@/types/product";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  return new Intl.NumberFormat("uz-UZ").format(n) + " so'm";
}

function getThumb(product: Product): string | null {
  const raw = product.images?.[0];
  if (!raw) return null;
  if (typeof raw === "string") return raw;
  return (
    (raw as { fullUrl?: string; url: string }).fullUrl ??
    (raw as { url: string }).url ??
    null
  );
}

// ── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({
  product,
  categoryName,
  displayName,
  onEdit,
  onDelete,
}: {
  product: Product;
  categoryName: string;
  displayName: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const thumb = getThumb(product);
  const outOfStock = product.stock === 0;
  const lowStock   = product.stock > 0 && product.stock < 5;
  const hasDiscount = !!product.discount;

  return (
    <div
      className="group relative bg-white rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer flex flex-col"
      onClick={onEdit}
    >
      {/* ── Action buttons (hover) ── */}
      <div
        className="absolute top-2 right-2 z-20 flex gap-1 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onEdit}
          className="w-7 h-7 rounded-lg bg-white shadow-md border border-zinc-100 flex items-center justify-center hover:bg-zinc-50 transition-colors"
        >
          <Pencil size={11} className="text-zinc-500" />
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="w-7 h-7 rounded-lg bg-white shadow-md border border-zinc-100 flex items-center justify-center hover:bg-red-50 hover:border-red-100 transition-colors"
        >
          <Trash2 size={11} className="text-red-400" />
        </button>
      </div>

      {/* ── Discount ribbon ── */}
      {hasDiscount && (
        <div className="absolute top-0 left-0 z-10">
          <div
            className="text-[10px] font-bold text-white px-2 py-0.5 rounded-br-lg"
            style={{ background: "linear-gradient(135deg, #10B981, #059669)" }}
          >
            -{product.discount!.percent}%
          </div>
        </div>
      )}

      {/* ── Image area ── */}
      <div className="relative w-full bg-zinc-50 overflow-hidden"
        style={{ aspectRatio: "1 / 1" }}>
        {thumb ? (
          <img
            src={thumb}
            alt={displayName}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #f8fafc, #f1f5f9)" }}
          >
            <Package size={28} className="text-zinc-200" />
            <span className="text-[10px] text-zinc-300 font-medium">Rasm yo'q</span>
          </div>
        )}

        {/* Stock overlay badge */}
        {(outOfStock || lowStock) && (
          <div className="absolute bottom-2 left-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm ${
                outOfStock
                  ? "bg-red-500/90 text-white"
                  : "bg-amber-400/90 text-white"
              }`}
            >
              {outOfStock ? "Tugagan" : "Kam qoldi"}
            </span>
          </div>
        )}
      </div>

      {/* ── Info ── */}
      <div className="flex flex-col flex-1 px-3 pt-2.5 pb-3 gap-1.5">
        {/* Name */}
        <p className="text-[13px] font-semibold text-zinc-800 line-clamp-2 leading-snug">
          {displayName}
        </p>

        {/* Category */}
        {categoryName && (
          <div className="flex items-center gap-1">
            <Tag size={9} className="text-zinc-300 flex-shrink-0" />
            <span className="text-[11px] text-zinc-400 truncate">{categoryName}</span>
          </div>
        )}

        {/* Price + stock */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-50">
          <div>
            <p className="text-[14px] font-bold text-zinc-800 leading-tight">
              {formatPrice(product.price)}
            </p>
            {hasDiscount && (
              <p className="text-[10px] text-zinc-400 line-through leading-tight">
                asl narx
              </p>
            )}
          </div>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              outOfStock
                ? "bg-red-50 text-red-500"
                : lowStock
                  ? "bg-amber-50 text-amber-600"
                  : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {product.stock} dona
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const navigate = useNavigate();
  const { products, isLoading } = useProducts();
  const { categories } = useCategories();
  const { languages } = useLanguages();
  const { mutate: deleteProduct, isPending: deleting } = useDeleteProduct();

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const defaultLang = useMemo(
    () =>
      languages.find((l) => l.isDefault)?.code ??
      languages.find((l) => l.isActive)?.code ??
      "uz",
    [languages],
  );

  // Build a category ID → name map once, reused per product
  const categoryMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const cat of categories) {
      map[cat.id] =
        typeof cat.name === "string"
          ? cat.name
          : (cat.name[defaultLang] ?? Object.values(cat.name)[0] ?? "");
    }
    return map;
  }, [categories, defaultLang]);

  const getCategoryName = (id: string) => categoryMap[id] ?? "";

  const getDisplayName = (product: Product) =>
    typeof product.name === "object"
      ? (product.name[defaultLang] ?? Object.values(product.name)[0] ?? "—")
      : (product.name ?? "—");

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteProduct(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Mahsulot o'chirildi");
        setDeleteTarget(null);
      },
      onError: (err) =>
        toast.error(getErrorMessage(err, "O'chirishda xatolik")),
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-6 pb-10">
      <PageHero
        icon={Package}
        title="Mahsulotlar"
        stats={[{ value: products.length, label: "ta mahsulot" }]}
        actionLabel="Mahsulot qo'shish"
        onAction={() => navigate("/products/create")}
      />

      {isLoading ? (
        /* ── Skeleton grid ── */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-zinc-100 overflow-hidden animate-pulse"
            >
              <div className="aspect-square bg-zinc-100" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-zinc-100 rounded-lg" />
                <div className="h-3 bg-zinc-100 rounded-lg w-2/3" />
                <div className="h-px bg-zinc-100 mt-3" />
                <div className="flex justify-between">
                  <div className="h-3 bg-zinc-100 rounded-lg w-1/2" />
                  <div className="h-3 bg-zinc-100 rounded-lg w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        /* ── Empty state ── */
        <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-zinc-100 shadow-sm">
          <div
            className="flex items-center justify-center mb-4 w-16 h-16 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 100%)",
            }}
          >
            <Package size={28} color="white" />
          </div>
          <h3 className="text-[16px] font-bold text-zinc-700 mb-1">
            Hali mahsulot qo'shilmagan
          </h3>
          <p className="max-w-xs mb-6 text-[13px] text-zinc-400">
            Birinchi mahsulotni qo'shing
          </p>
          <button
            type="button"
            onClick={() => navigate("/products/create")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 100%)",
            }}
          >
            <Plus size={15} />
            Mahsulot qo'shish
          </button>
        </div>
      ) : (
        /* ── Card grid ── */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={getCategoryName(
                product.categories?.[0]?.id ?? product.categoryId ?? product.category?.id ?? "",
              )}
              displayName={getDisplayName(product)}
              onEdit={() => navigate(`/products/${product.id}/edit`)}
              onDelete={() => setDeleteTarget(product)}
            />
          ))}
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={`"${deleteTarget ? getDisplayName(deleteTarget) : ""}" ni o'chirish`}
        description="Bu mahsulot buyurtmalar tarixidan o'chirilmaydi, lekin saytda ko'rinmaydi."
        loading={deleting}
      />
    </div>
  );
}
