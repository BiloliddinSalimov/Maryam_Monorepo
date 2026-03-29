import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/errorMessage";
import { Tag, Camera, X, Loader2, Package, Search, CheckSquare, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormField from "@/components/shared/FormField";
import MultiLangInput from "@/components/shared/MultiLangInput";
import GalleryModal from "@/components/shared/GalleryModal";
import { LangTabProvider, LangTabBar } from "@/context/LangTabContext";

import { categorySchema, type CategoryFormValues } from "@/schemas/categorySchema";
import { slugify } from "@/lib/slugify";
import {
  useCreateCategory,
  useUpdateCategory,
  useCategories,
} from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import { useLanguages } from "@/hooks/useLanguages";
import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

// ── Compact single-image picker ───────────────────────────────────────────

function ImagePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative group w-24 h-24 rounded-2xl overflow-hidden border-2 border-dashed border-zinc-200 hover:border-primary/40 bg-zinc-50 hover:bg-zinc-100 transition-all flex items-center justify-center"
        >
          {value ? (
            <>
              <img src={value} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={20} className="text-white" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <Camera size={18} className="text-zinc-400" />
              </div>
              <span className="text-[10px] text-zinc-400 font-medium">Rasm</span>
            </div>
          )}
        </button>

        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-600 transition-colors"
          >
            <X size={11} />
            O'chirish
          </button>
        )}
        <p className="text-[10px] text-zinc-400 text-center leading-relaxed">
          200×200 px<br />PNG yoki JPG
        </p>
      </div>

      <GalleryModal
        open={open}
        onClose={() => setOpen(false)}
        maxSelect={1}
        onConfirm={(urls) => {
          if (urls[0]) onChange(urls[0]);
        }}
      />
    </>
  );
}

// ── Product thumbnail helper ──────────────────────────────────────────────

function getProductThumbnail(product: Product): string | null {
  const rawImg = product.images?.[0];
  if (!rawImg) return null;
  if (typeof rawImg === "string") return rawImg;
  return (rawImg as { fullUrl?: string; url: string }).fullUrl ?? (rawImg as { url: string }).url ?? null;
}

// ── Product picker section ────────────────────────────────────────────────

function ProductPicker({
  selected,
  onChange,
  defaultLang,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
  defaultLang: string;
}) {
  const { products, isLoading } = useProducts();
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    if (!search) return true;
    const name = p.name[defaultLang] ?? Object.values(p.name)[0] ?? "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const selectAll = () => {
    const allIds = filtered.map((p) => p.id);
    const newSelected = Array.from(new Set([...selected, ...allIds]));
    onChange(newSelected);
  };

  const clearAll = () => {
    const filteredIds = new Set(filtered.map((p) => p.id));
    onChange(selected.filter((id) => !filteredIds.has(id)));
  };

  const allFilteredSelected = filtered.length > 0 && filtered.every((p) => selected.includes(p.id));

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 100%)" }}
          >
            <Package size={12} color="white" />
          </div>
          <span className="text-[13px] font-semibold text-zinc-800">Mahsulotlar</span>
          {selected.length > 0 && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#1A2E44] text-white">
              {selected.length} ta
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {allFilteredSelected ? (
            <button
              type="button"
              onClick={clearAll}
              className="text-[11px] text-zinc-400 hover:text-red-500 transition-colors"
            >
              Bekor qilish
            </button>
          ) : (
            <button
              type="button"
              onClick={selectAll}
              className="text-[11px] text-[#1A2E44] hover:underline transition-colors"
            >
              Hammasini tanlash
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <Input
          placeholder="Mahsulot qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 h-9 text-[13px]"
        />
      </div>

      {/* Product list */}
      <div className="max-h-64 overflow-y-auto rounded-xl border border-zinc-100 bg-white divide-y divide-zinc-50">
        {isLoading ? (
          <div className="p-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 rounded-lg bg-zinc-100 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Package size={24} className="text-zinc-200 mb-2" />
            <p className="text-xs text-zinc-400">
              {search ? "Mahsulot topilmadi" : "Hali mahsulot yo'q"}
            </p>
          </div>
        ) : (
          filtered.map((product) => {
            const isSelected = selected.includes(product.id);
            const thumb = getProductThumbnail(product);
            const name = product.name[defaultLang] ?? Object.values(product.name)[0] ?? "—";

            return (
              <button
                key={product.id}
                type="button"
                onClick={() => toggle(product.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                  isSelected ? "bg-[#1A2E44]/4" : "hover:bg-zinc-50"
                }`}
              >
                <div className="flex-shrink-0">
                  {isSelected ? (
                    <CheckSquare size={16} className="text-[#1A2E44]" />
                  ) : (
                    <Square size={16} className="text-zinc-300" />
                  )}
                </div>
                {/* Thumbnail */}
                <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-100 bg-zinc-50 flex items-center justify-center">
                  {thumb ? (
                    <img src={thumb} alt={name} className="w-full h-full object-cover" />
                  ) : (
                    <Package size={13} className="text-zinc-300" />
                  )}
                </div>
                {/* Name + price */}
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-zinc-800 truncate">{name}</p>
                  <p className="text-[11px] text-zinc-400">
                    {product.price.toLocaleString()} so'm
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
      {filtered.length > 0 && (
        <p className="text-[11px] text-zinc-400 text-right">
          {filtered.length} ta mahsulot
        </p>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────

function CategoryForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const presetParentId = searchParams.get("parentId") ?? "";
  const isEdit = !!id;

  const { categories } = useCategories();
  const { languages } = useLanguages();
  const { mutate: create, isPending: creating } = useCreateCategory();
  const { mutate: update, isPending: updating } = useUpdateCategory(id ?? "");
  const isPending = creating || updating;

  const editItem = isEdit ? categories.find((c) => c.id === id) : undefined;

  // Collect all descendant IDs of a category (to prevent circular parenting)
  function getDescendantIds(cat: Category): string[] {
    return [cat.id, ...(cat.children ?? []).flatMap(getDescendantIds)];
  }
  const excludeIds = isEdit && editItem
    ? new Set(getDescendantIds(editItem))
    : new Set<string>();

  // ALL categories as parent options (not just root), excluding self + own descendants
  const parentOptions = categories.filter((c) => !excludeIds.has(c.id));

  // Depth of a category in the tree (for indent in select)
  function getCatDepth(cat: Category): number {
    if (!cat.parentId) return 0;
    const parent = categories.find((c) => c.id === cat.parentId);
    if (!parent) return 0;
    return 1 + getCatDepth(parent);
  }

  const defaultLang =
    languages.find((l) => l.isDefault)?.code ??
    languages.find((l) => l.isActive)?.code ??
    "uz";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: {},
      slug: "",
      image: "",
      parentId: presetParentId,
      productIds: [],
    },
  });

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = form;

  useEffect(() => {
    if (editItem) {
      reset({
        name: editItem.name ?? {},
        slug: editItem.slug,
        image: editItem.image ?? "",
        parentId: editItem.parentId ?? "",
        productIds: [],
      });
    } else {
      reset({ name: {}, slug: "", image: "", parentId: presetParentId, productIds: [] });
    }
  }, [editItem?.id, presetParentId]);

  // Auto-slug from default lang name (only on create)
  const autoSlug = useRef(!isEdit);
  const watchName = watch("name");
  useEffect(() => {
    if (!autoSlug.current) return;
    const first =
      watchName[defaultLang] ?? Object.values(watchName)[0] ?? "";
    if (first) setValue("slug", slugify(first));
  }, [JSON.stringify(watchName), defaultLang]);

  const onSubmit = (values: CategoryFormValues) => {
    const dto = {
      name: values.name,
      slug: values.slug,
      image: values.image || undefined,
      parentId: values.parentId || undefined,
      productIds: values.productIds && values.productIds.length > 0 ? values.productIds : undefined,
    };
    if (isEdit) {
      update(dto, {
        onSuccess: () => {
          toast.success("Kategoriya yangilandi");
          navigate("/categories");
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      });
    } else {
      create(dto, {
        onSuccess: () => {
          toast.success("Kategoriya qo'shildi");
          navigate("/categories");
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      });
    }
  };

  const imageValue = watch("image") ?? "";
  const parentId = watch("parentId");
  const productIds = watch("productIds") ?? [];
  const presetParent = categories.find((c) => c.id === presetParentId);
  const presetParentName = presetParent
    ? (presetParent.name[defaultLang] ?? Object.values(presetParent.name)[0] ?? "")
    : "";

  return (
    <FormProvider {...form}>
      <div className="min-h-screen bg-zinc-50/60 flex flex-col">

        {/* ── Centered card ─────────────────────────────────────────────── */}
        <div className="flex flex-1 items-start justify-center px-4 py-8">
          <div className="w-full max-w-lg space-y-4">

            {/* ── Main form card ──────────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">

              {/* Card header */}
              <div className="px-6 pt-6 pb-4 border-b border-zinc-50 bg-gradient-to-b from-zinc-50 to-white">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 100%)" }}
                  >
                    <Tag size={15} color="white" strokeWidth={2} />
                  </div>
                  <div>
                    <h1 className="text-[15px] font-semibold text-zinc-800">
                      {isEdit ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {isEdit
                        ? "Ma'lumotlarni yangilang va saqlang"
                        : "Yangi kategoriya ma'lumotlarini kiriting"}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="px-6 py-5 space-y-5">

                  {/* ── Image + Lang row ──────────────────────────────── */}
                  <div className="flex items-start gap-5">
                    {/* Image picker */}
                    <ImagePicker
                      value={imageValue}
                      onChange={(url) => setValue("image", url)}
                    />

                    {/* Lang tabs + name input */}
                    <div className="flex-1 min-w-0 space-y-3">
                      <LangTabBar />
                      <MultiLangInput
                        field="name"
                        label="Kategoriya nomi"
                        required
                        placeholder="Nomini kiriting"
                      />
                    </div>
                  </div>

                  {/* ── Slug ─────────────────────────────────────────── */}
                  <FormField
                    label="Slug (URL)"
                    required
                    error={errors.slug?.message}
                    hint="Avtomatik hosil bo'ladi, qo'lda ham o'zgartirishingiz mumkin"
                  >
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 select-none">
                        /
                      </span>
                      <Input
                        placeholder="kategoriya-nomi"
                        {...register("slug")}
                        onFocus={() => { autoSlug.current = false; }}
                        className={`pl-5 font-mono text-[13px] ${errors.slug ? "border-red-300" : ""}`}
                      />
                    </div>
                  </FormField>

                  {/* ── Parent category ───────────────────────────────── */}
                  {parentOptions.length > 0 && (
                    <FormField
                      label="Asosiy kategoriya"
                      hint="Agar bu ichki kategoriya bo'lsa tanlang"
                    >
                      <Select
                        value={parentId ?? ""}
                        onValueChange={(v) =>
                          setValue("parentId", v === "none" ? "" : v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="— Mustaqil kategoriya —" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">
                            — Mustaqil (asosiy) kategoriya —
                          </SelectItem>
                          {parentOptions.map((cat) => {
                            const catName =
                              cat.name[defaultLang] ??
                              Object.values(cat.name)[0] ??
                              cat.slug;
                            const depth = getCatDepth(cat);
                            const indent = "—".repeat(depth);
                            return (
                              <SelectItem key={cat.id} value={cat.id}>
                                <span className="flex items-center gap-2">
                                  {depth > 0 && (
                                    <span className="text-zinc-300 font-mono text-xs tracking-tighter select-none">
                                      {indent}
                                    </span>
                                  )}
                                  {cat.image ? (
                                    <img
                                      src={cat.image}
                                      alt=""
                                      className="w-4 h-4 rounded object-cover flex-shrink-0"
                                    />
                                  ) : (
                                    <Tag size={12} className="text-zinc-400 flex-shrink-0" />
                                  )}
                                  {catName}
                                </span>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormField>
                  )}
                </div>

                {/* ── Footer ────────────────────────────────────────── */}
                <div className="px-6 pb-6 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-10"
                    onClick={() => navigate("/categories")}
                    disabled={isPending}
                  >
                    Bekor qilish
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-10 gap-2"
                    style={{ backgroundColor: "#1A2E44" }}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Saqlanmoqda...
                      </>
                    ) : isEdit ? (
                      "Saqlash"
                    ) : (
                      "Qo'shish"
                    )}
                  </Button>
                </div>
              </form>
            </div>

            {/* ── Product picker card ────────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
              <ProductPicker
                selected={productIds}
                onChange={(ids) => setValue("productIds", ids)}
                defaultLang={defaultLang}
              />
            </div>

            <p className="text-center text-[11px] text-zinc-400 mt-1">
              * bilan belgilangan maydonlar majburiy
            </p>
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

export default function CategoryFormPage() {
  return (
    <LangTabProvider>
      <CategoryForm />
    </LangTabProvider>
  );
}
