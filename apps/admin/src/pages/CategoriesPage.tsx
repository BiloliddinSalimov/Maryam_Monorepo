import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  FolderOpen,
  Home,
  Layers,
  Pencil,
  Plus,
  Tag,
  Trash2,
} from "lucide-react";

import PageHero from "@/components/shared/PageHero";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/errorMessage";

import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";
import CategoryImage from "@/components/categories/CategoryImage";
import CategoryListItem from "@/components/categories/CategoryListItem";
import SubCategoryCard from "@/components/categories/SubCategoryCard";
import CategoryProducts from "@/components/categories/CategoryProducts";

import { useCategories, useDeleteCategory } from "@/hooks/useCategories";
import { useCatName } from "@/hooks/useCatName";
import type { Category } from "@/types/category";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { rootCategories, isLoading } = useCategories();
  const { mutate: deleteCategory, isPending: deleting } = useDeleteCategory();
  const getName = useCatName();

  const [selectedPath, setSelectedPath] = useState<Category[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const selectedRoot  = selectedPath[0] ?? null;
  const selected      = selectedPath[selectedPath.length - 1] ?? null;
  const subCategories = selected?.children ?? [];

  // Total subcategory count across all root categories
  const totalSubs = rootCategories.reduce(
    (acc, c) => acc + (c.children?.length ?? 0),
    0,
  );

  const handleRootClick  = (cat: Category) =>
    setSelectedPath(selectedRoot?.id === cat.id ? [] : [cat]);
  const handleDrillIn    = (cat: Category) =>
    setSelectedPath((prev) => [...prev, cat]);
  const handleBreadcrumb = (index: number) =>
    setSelectedPath((prev) => prev.slice(0, index + 1));

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteCategory(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Kategoriya o'chirildi");
        const idx = selectedPath.findIndex((c) => c.id === deleteTarget.id);
        if (idx !== -1) setSelectedPath((prev) => prev.slice(0, idx));
        setDeleteTarget(null);
      },
      onError: (err) =>
        toast.error(getErrorMessage(err, "O'chirishda xatolik")),
    });
  };

  return (
    <div
      className="flex flex-col max-w-6xl mx-auto px-6 pt-6 pb-6"
      style={{ height: "calc(100vh - 56px)" }}
    >
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <PageHero
        icon={Tag}
        title="Kategoriyalar"
        stats={[
          { value: isLoading ? "..." : rootCategories.length, label: "asosiy" },
          { value: isLoading ? "..." : totalSubs, label: "ichki" },
        ]}
        actionLabel="Kategoriya qo'shish"
        onAction={() => navigate("/categories/create")}
      />

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden rounded-2xl border border-zinc-100 shadow-sm mb-6">

        {/* ── Left panel ──────────────────────────────────────────────── */}
        <div className="flex flex-col flex-shrink-0 w-64 overflow-y-auto bg-white border-r border-zinc-100 rounded-l-2xl">

          {/* Panel label */}
          <div className="px-4 pt-4 pb-2">
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Asosiy kategoriyalar
            </p>
          </div>

          {isLoading ? (
            <div className="p-3 space-y-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-11 rounded-xl bg-zinc-100 animate-pulse"
                />
              ))}
            </div>
          ) : rootCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 p-6 text-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 100%)",
                }}
              >
                <Tag size={20} className="text-white" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-zinc-600">
                  Kategoriya yo'q
                </p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Birinchisini qo'shing
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/categories/create")}
                className="text-[12px] font-semibold text-[#1A2E44] hover:underline"
              >
                + Qo'shish
              </button>
            </div>
          ) : (
            <div className="flex-1 p-2 space-y-0.5 overflow-y-auto">
              {rootCategories.map((cat) => (
                <CategoryListItem
                  key={cat.id}
                  category={cat}
                  displayName={getName(cat.name)}
                  selected={selectedRoot?.id === cat.id}
                  subCount={cat.children?.length ?? 0}
                  onClick={() => handleRootClick(cat)}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Right panel ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-zinc-50/60 min-w-0 rounded-r-2xl">

          {!selected ? (
            /* ── Nothing selected ─────────────────────────────────────── */
            <div className="flex flex-col items-center justify-center h-full text-center p-10 gap-4">
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 100%)",
                }}
              >
                <FolderOpen size={34} color="white" />
              </div>
              <div>
                <h3 className="text-[16px] font-bold text-zinc-700">
                  Kategoriya tanlang
                </h3>
                <p className="text-[13px] text-zinc-400 mt-1 max-w-xs leading-relaxed">
                  Chap paneldan kategoriya tanlang — ichki kategoriyalar va
                  mahsulotlar ko'rinadi
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/categories/create")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 100%)",
                }}
              >
                <Plus size={15} />
                Yangi kategoriya
              </button>
            </div>
          ) : (
            <div className="p-5 max-w-full space-y-5">

              {/* ── Breadcrumb ─────────────────────────────────────────── */}
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSelectedPath([])}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-medium text-zinc-400 hover:text-zinc-700 hover:bg-white transition-all"
                >
                  <Home size={11} />
                  Asosiy
                </button>
                {selectedPath.map((cat, index) => (
                  <span key={cat.id} className="flex items-center gap-1">
                    <ChevronRight size={12} className="text-zinc-300" />
                    <button
                      type="button"
                      onClick={() => handleBreadcrumb(index)}
                      className={`px-2.5 py-1 rounded-lg text-[12px] transition-all ${
                        index === selectedPath.length - 1
                          ? "font-semibold text-white bg-[#1A2E44]"
                          : "font-medium text-zinc-400 hover:text-zinc-700 hover:bg-white"
                      }`}
                    >
                      {getName(cat.name)}
                    </button>
                  </span>
                ))}
              </div>

              {/* ── Selected category hero card ────────────────────────── */}
              <div className="relative rounded-2xl overflow-hidden border border-zinc-100 bg-white shadow-sm">
                {/* Top accent strip */}
                <div
                  className="h-1.5 w-full"
                  style={{
                    background:
                      "linear-gradient(90deg, #1A2E44 0%, #3d6491 100%)",
                  }}
                />

                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-zinc-100"
                      style={
                        !selected.image
                          ? {
                              background:
                                "linear-gradient(135deg, #1A2E44 0%, #3d6491 100%)",
                            }
                          : {}
                      }
                    >
                      {selected.image ? (
                        <img
                          src={selected.image}
                          alt={getName(selected.name)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Tag size={22} className="text-white" />
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-[17px] font-bold text-zinc-800 truncate">
                      {getName(selected.name)}
                    </h2>
                    <p className="text-[12px] text-zinc-400 mt-0.5 font-mono">
                      /{selected.slug}
                    </p>

                    {/* Badges */}
                    <div className="flex items-center gap-2 mt-2">
                      {subCategories.length > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#E0F2FE] text-[#0EA5E9]">
                          <Layers size={10} />
                          {subCategories.length} ichki
                        </span>
                      )}
                      {selected.parentId && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-500">
                          Ichki kategoriya
                        </span>
                      )}
                      {!selected.parentId && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#D1FAE5] text-[#10B981]">
                          Asosiy
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/categories/${selected.id}/edit`)
                      }
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-[12px] font-semibold text-zinc-600 transition-all"
                    >
                      <Pencil size={12} />
                      Tahrirlash
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(selected)}
                      className="flex items-center justify-center w-9 h-9 rounded-xl border border-red-100 bg-white hover:bg-red-50 transition-all"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Sub-categories ─────────────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
                {/* Section header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#E0F2FE] flex items-center justify-center">
                      <Layers size={13} className="text-[#0EA5E9]" />
                    </div>
                    <span className="text-[14px] font-semibold text-zinc-800">
                      Ichki kategoriyalar
                    </span>
                    {subCategories.length > 0 && (
                      <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-zinc-100 text-zinc-500">
                        {subCategories.length}
                      </span>
                    )}
                  </div>
                  {subCategories.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/categories/create?parentId=${selected.id}`,
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A2E44] hover:bg-[#2d4a6b] text-white text-[12px] font-semibold transition-all"
                    >
                      <Plus size={12} />
                      Qo'shish
                    </button>
                  )}
                </div>

                <div className="p-4">
                  {subCategories.length === 0 ? (
                    /* Empty — single dashed CTA */
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/categories/create?parentId=${selected.id}`,
                        )
                      }
                      className="w-full flex flex-col items-center justify-center gap-3 py-12 rounded-xl border-2 border-dashed border-zinc-200 hover:border-[#1A2E44]/40 hover:bg-[#1A2E44]/3 transition-all group"
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform"
                        style={{
                          background:
                            "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 100%)",
                        }}
                      >
                        <Plus size={20} className="text-white" />
                      </div>
                      <div className="text-center">
                        <p className="text-[13px] font-semibold text-zinc-600 group-hover:text-[#1A2E44]">
                          Ichki kategoriya qo'shish
                        </p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          "{getName(selected.name)}" uchun
                        </p>
                      </div>
                    </button>
                  ) : (
                    /* Grid */
                    <div className="grid gap-3 grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                      {subCategories.map((sub) => (
                        <SubCategoryCard
                          key={sub.id}
                          category={sub}
                          displayName={getName(sub.name)}
                          onEdit={() =>
                            navigate(`/categories/${sub.id}/edit`)
                          }
                          onDelete={() => setDeleteTarget(sub)}
                          onDrillIn={() => handleDrillIn(sub)}
                        />
                      ))}
                      {/* Add new */}
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/categories/create?parentId=${selected.id}`,
                          )
                        }
                        className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-200 hover:border-[#1A2E44]/40 hover:bg-[#1A2E44]/3 transition-all group min-h-[130px]"
                      >
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-zinc-100 group-hover:bg-[#1A2E44]/10 transition-colors">
                          <Plus
                            size={16}
                            className="text-zinc-400 group-hover:text-[#1A2E44]"
                          />
                        </div>
                        <span className="text-[11px] font-semibold text-zinc-400 group-hover:text-[#1A2E44]">
                          Qo'shish
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Products linked ────────────────────────────────────── */}
              <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden shadow-sm">
                <CategoryProducts
                  categoryId={selected.id}
                  getName={getName}
                  onNavigate={navigate}
                />
              </div>

            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={`"${getName(deleteTarget?.name)}" ni o'chirish`}
        description="Bu kategoriyaga bog'liq mahsulotlarga ta'sir qilishi mumkin."
        loading={deleting}
      />
    </div>
  );
}
