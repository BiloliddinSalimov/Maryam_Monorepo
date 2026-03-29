import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider, type SubmitHandler, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { instance } from "@/lib/api";
import { getErrorMessage } from "@/lib/errorMessage";
import type { ProductImageApi } from "@/types/product";
import {
  ArrowLeft,
  Save,
  Package,
  ImageIcon,
  LayoutList,
  Tag,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import MultiLangInput from "@/components/shared/MultiLangInput";
import ImageUploadGrid from "@/components/shared/ImageUploadGrid";
import FormField from "@/components/shared/FormField";
import SectionCard from "@/components/shared/SectionCard";
import { LangTabProvider, LangTabBar } from "@/context/LangTabContext";

import { productSchema, type ProductFormValues } from "@/schemas/productSchema";
import { slugify } from "@/lib/slugify";
import {
  useCreateProduct,
  useProduct,
} from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useLanguages } from "@/hooks/useLanguages";
import { SECTIONS } from "@/context/products";

function ProductForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const qc = useQueryClient();
  const { product: editProduct, isLoading: loadingProduct } = useProduct(isEdit ? id : undefined);
  const { categories, isLoading: loadingCategories } = useCategories();
  const { languages: allLangs } = useLanguages();
  const defaultCatLang =
    allLangs.find((l) => l.isDefault)?.code ??
    allLangs.find((l) => l.isActive)?.code ??
    "uz";
  const { mutate: create, isPending: creating } = useCreateProduct();
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: {},
      slug: "",
      description: {},
      price: 0,
      stock: 0,
      categoryId: "",
      images: [],
      hasDiscount: false,
    },
  });

  const { errors } = form.formState;
  const isPending = creating || form.formState.isSubmitting;

  // ── Helper: extract category ID from any possible API shape ──────────────
  const resolveCategoryId = (p: unknown): string => {
    if (!p || typeof p !== "object") return "";
    const obj = p as Record<string, unknown>;
    // try every known field name the backend might use
    const id =
      // array format:  { categories: [{ id }] }
      (Array.isArray(obj.categories) && (obj.categories[0] as Record<string,unknown>)?.id as string) ||
      // flat format:   { categoryId: "..." }
      (typeof obj.categoryId === "string" && obj.categoryId) ||
      // nested format: { category: { id } }
      (obj.category && typeof (obj.category as Record<string,unknown>).id === "string"
        ? (obj.category as Record<string,unknown>).id as string
        : "") ||
      // other variants
      (typeof (obj as Record<string,unknown>).category_id === "string"
        ? (obj as Record<string,unknown>).category_id as string
        : "") ||
      (Array.isArray((obj as Record<string,unknown>).categoryIds)
        ? ((obj as Record<string,unknown>).categoryIds as string[])[0]
        : "");
    return id || "";
  };

  // ── Effect 1: reset whole form when product loads ─────────────────────────
  useEffect(() => {
    if (!editProduct) return;

    const resolvedCategoryId = resolveCategoryId(editProduct);
    console.log("🔍 editProduct raw keys:", Object.keys(editProduct));
    console.log("🏷️ resolvedCategoryId:", resolvedCategoryId);

    form.reset({
      name:        editProduct.name ?? {},
      slug:        editProduct.slug ?? "",
      description: editProduct.description ?? {},
      price:       editProduct.price ?? 0,
      stock:       editProduct.stock ?? 0,
      categoryId:  resolvedCategoryId,
      images: Array.isArray(editProduct.images)
        ? editProduct.images.map((img) =>
            typeof img === "string"
              ? img
              : (img as { fullUrl?: string; url: string }).fullUrl ??
                (img as { url: string }).url
          )
        : [],
      hasDiscount: !!editProduct.discount,
      // null from API → undefined (Zod .optional() rejects null)
      discount: editProduct.discount ?? undefined,
    });
  }, [editProduct?.id]);

  // ── Effect 2: re-apply categoryId once categories finish loading ──────────
  // Handles race: product loaded first, categories loaded later (or vice-versa).
  // Also does a "smart scan" — if normal resolution fails, it checks every
  // field/value in the product object against the loaded categories list.
  useEffect(() => {
    if (!editProduct || !categories.length) return;
    const current = form.getValues("categoryId");
    if (current) return; // already set — nothing to do

    let resolved = resolveCategoryId(editProduct);

    // Smart scan: if still empty, scan every value in the product and check
    // whether it matches a known category ID — works regardless of field name
    if (!resolved) {
      const knownIds = new Set(categories.map((c) => c.id));
      const obj = editProduct as unknown as Record<string, unknown>;

      outer: for (const val of Object.values(obj)) {
        // plain string field: { categoryId: "uuid" }
        if (typeof val === "string" && knownIds.has(val)) {
          resolved = val;
          break;
        }
        // nested object: { category: { id: "uuid" } }
        if (val && typeof val === "object" && !Array.isArray(val)) {
          const inner = val as Record<string, unknown>;
          const innerId = inner.id;
          if (typeof innerId === "string" && knownIds.has(innerId)) {
            resolved = innerId;
            break;
          }
        }
        // array of objects: { categories: [{ id: "uuid" }] }
        if (Array.isArray(val) && val.length > 0) {
          for (const item of val) {
            if (item && typeof item === "object") {
              const itemId = (item as Record<string, unknown>).id;
              if (typeof itemId === "string" && knownIds.has(itemId)) {
                resolved = itemId;
                break outer;
              }
            }
          }
        }
      }
    }

    if (resolved) {
      console.log("✅ Smart-scan found categoryId:", resolved);
      form.setValue("categoryId", resolved, { shouldValidate: false });
    } else {
      console.warn("⚠️ Could not resolve categoryId. Product keys:", Object.keys(editProduct));
    }
  }, [categories.length, editProduct?.id]);

  const autoSlug = useRef(!isEdit);
  const watchName = form.watch("name");
  useEffect(() => {
    if (!autoSlug.current) return;
    const first = Object.values(watchName)[0] ?? "";
    if (first) form.setValue("slug", slugify(first));
  }, [JSON.stringify(watchName)]);

  const onInvalid = (errs: FieldErrors<ProductFormValues>) => {
    console.error("[ProductForm] validation errors:", JSON.stringify(errs, null, 2));
    toast.error("Iltimos, barcha majburiy maydonlarni to'ldiring");
  };

  const onSubmit: SubmitHandler<ProductFormValues> = async (values) => {
    // ── CREATE ───────────────────────────────────────────────────────────────
    if (!isEdit) {
      create(
        {
          name: values.name,
          slug: values.slug,
          description: values.description,
          price: values.price,
          stock: values.stock,
          categoryId: values.categoryId,
          images: values.images,
          discount: values.hasDiscount ? values.discount : undefined,
        },
        {
          onSuccess: () => {
            toast.success("Mahsulot qo'shildi");
            navigate("/products");
          },
          onError: (err) => toast.error(getErrorMessage(err)),
        },
      );
      return;
    }

    // ── EDIT: orchestrate multiple endpoints ─────────────────────────────────
    try {
      // 1. Update basic fields (backend ignores images & categoryId in PUT)
      await instance.put(`/admin/products/${id}`, {
        name:        values.name,
        slug:        values.slug,
        description: values.description,
        price:       values.price,
        stock:       values.stock,
        discount:    values.hasDiscount ? values.discount : undefined,
      });

      // 2. Update category if it changed
      const oldCategoryId =
        editProduct?.categories?.[0]?.id ||
        editProduct?.categoryId ||
        editProduct?.category?.id ||
        "";
      const newCategoryId = values.categoryId;

      if (oldCategoryId !== newCategoryId) {
        // Remove old category first
        if (oldCategoryId) {
          await instance.delete(`/admin/products/${id}/categories`, {
            data: { categoryIds: [oldCategoryId] },
          });
        }
        // Attach new category
        if (newCategoryId) {
          await instance.post(`/admin/products/${id}/categories`, {
            categoryIds: [newCategoryId],
          });
        }
      }

      // 3. Sync images: find added and removed by comparing URLs
      const originalImages = (editProduct?.images ?? []) as ProductImageApi[];
      const getUrl = (img: ProductImageApi) =>
        (img as { fullUrl?: string }).fullUrl ?? img.url;

      const originalUrls = originalImages.map(getUrl);
      const formUrls = values.images;

      // Images removed from form → delete by image ID
      const removedImgs = originalImages.filter(
        (img) => !formUrls.includes(getUrl(img)),
      );
      for (const img of removedImgs) {
        await instance.delete(`/admin/products/${id}/images/${img.id}`);
      }

      // Images added in form (URL not in originals) → POST new urls
      const addedUrls = formUrls.filter((url) => !originalUrls.includes(url));
      if (addedUrls.length > 0) {
        await instance.post(`/admin/products/${id}/images`, { urls: addedUrls });
      }

      // 4. Targeted invalidation — only what actually changed:
      //    - the edited product's detail cache
      //    - the product list (exact ["products"] key, not byCategory variants)
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["products", id!], exact: true }),
        qc.invalidateQueries({ queryKey: ["products"],       exact: true }),
      ]);

      toast.success("Mahsulot yangilandi");
      navigate("/products");
    } catch (err) {
      toast.error(getErrorMessage(err as Error));
    }
  };

  const hasDiscount = form.watch("hasDiscount");
  const langErrors = {
    name: (errors as Record<string, unknown>)["name"] as
      | Record<string, unknown>
      | undefined,
    description: (errors as Record<string, unknown>)["description"] as
      | Record<string, unknown>
      | undefined,
  };

  // Show loading skeleton while fetching edit product
  if (isEdit && loadingProduct) {
    return (
      <div className="px-6 py-6 mx-auto max-w-7xl space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-zinc-100 rounded-xl" />
        <div className="h-48 bg-zinc-100 rounded-2xl" />
        <div className="h-48 bg-zinc-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} noValidate>
      {/* ── Body ────────────────────────────────────────────────── */}
      <div className="px-6 py-6 mx-auto max-w-7xl">
        <div className="flex items-start gap-6">
          {/* Left: form sections */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* 1. Asosiy ma'lumot */}
            <SectionCard
              id="s-info"
              title="Asosiy ma'lumot"
              icon={<Package size={14} />}
            >
              <LangTabBar errorFields={langErrors} />

              <MultiLangInput
                field="name"
                label="Mahsulot nomi"
                required
                placeholder="Nomini kiriting"
              />

              <FormField
                label="Slug"
                error={errors.slug?.message}
                hint="URL uchun. Avtomatik hosil bo'ladi."
              >
                <Input
                  {...form.register("slug")}
                  placeholder="mahsulot-nomi"
                  onFocus={() => {
                    autoSlug.current = false;
                  }}
                  className={errors.slug ? "border-red-300" : ""}
                />
              </FormField>
            </SectionCard>
            <SectionCard
              id="s-category"
              title="Kategoriya"
              icon={<Tag size={14} />}
            >
              <FormField
                label="Kategoriya"
                required
                error={errors.categoryId?.message}
              >
                {/* key = categoryId value so Select remounts the moment the
                    value arrives — fixes Radix UI stale display bug */}
                <Select
                  key={form.watch("categoryId") || (loadingCategories ? "loading" : "empty")}
                  value={form.watch("categoryId")}
                  onValueChange={(v) =>
                    form.setValue("categoryId", v, { shouldValidate: true })
                  }
                >
                  <SelectTrigger
                    className={errors.categoryId ? "border-red-300" : ""}
                  >
                    <SelectValue placeholder="Kategoriya tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => {
                      const catDisplayName =
                        typeof cat.name === "object"
                          ? (cat.name[defaultCatLang] ?? Object.values(cat.name)[0] ?? cat.slug)
                          : cat.name;
                      return (
                        <SelectItem key={cat.id} value={cat.id}>
                          {catDisplayName}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FormField>
            </SectionCard>

            {/* 2. Rasmlar */}
            <SectionCard
              id="s-images"
              title="Rasmlar"
              icon={<ImageIcon size={14} />}
            >
              <ImageUploadGrid
                value={form.watch("images")}
                onChange={(urls) => form.setValue("images", urls)}
                max={8}
                cols={4}
              />
            </SectionCard>

            {/* 3. Narx va qo'shimcha */}
            <SectionCard
              id="s-extra"
              title="Narx va qo'shimcha"
              icon={<LayoutList size={14} />}
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Narxi (so'm)"
                  required
                  error={errors.price?.message}
                >
                  <Input
                    type="number"
                    min={0}
                    step={1000}
                    {...form.register("price", { valueAsNumber: true })}
                    placeholder="120 000"
                    className={errors.price ? "border-red-300" : ""}
                  />
                </FormField>

                <FormField label="Ombor (dona)">
                  <Input
                    type="number"
                    min={0}
                    {...form.register("stock", { valueAsNumber: true })}
                    placeholder="0"
                  />
                </FormField>
              </div>

              <MultiLangInput
                field="description"
                label="Tavsif"
                type="textarea"
                placeholder="Mahsulot haqida..."
              />

              {/* Discount toggle */}
              <div className="sticky p-4 space-y-4 border rounded-xl border-zinc-100 bg-zinc-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-zinc-700">
                      Chegirma
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Vaqtinchalik chegirma belgilash
                    </p>
                  </div>
                  <Switch
                    checked={hasDiscount}
                    onCheckedChange={(v) => form.setValue("hasDiscount", v)}
                  />
                </div>

                {hasDiscount && (
                  <div className="grid grid-cols-3 gap-3 pt-1 border-t border-zinc-200">
                    <FormField label="Chegirma %">
                      <Input
                        type="number"
                        min={1}
                        max={100}
                        placeholder="20"
                        {...form.register("discount.percent", {
                          valueAsNumber: true,
                        })}
                      />
                    </FormField>
                    <FormField label="Boshlanish">
                      <Input
                        type="date"
                        {...form.register("discount.startDate")}
                      />
                    </FormField>
                    <FormField label="Tugash">
                      <Input
                        type="date"
                        {...form.register("discount.endDate")}
                      />
                    </FormField>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* 4. Kategoriya */}

            <div className="h-10" />
          </div>

          {/* Right: sticky sidebar nav */}
          <aside className="sticky flex-shrink-0 w-1/3 top-2">
            <div className="overflow-hidden bg-white border shadow-sm rounded-2xl border-zinc-100">
              <div className="px-4 py-3 border-b border-zinc-100">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                  Bo'limlar
                </p>
              </div>
              <nav className="p-2 space-y-0.5">
                {SECTIONS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() =>
                      document
                        .getElementById(id)
                        ?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
                    className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 transition-colors text-left group"
                  >
                    <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 transition-colors rounded-md bg-zinc-50 group-hover:bg-zinc-100">
                      <Icon
                        size={12}
                        className="text-zinc-400 group-hover:text-zinc-600"
                      />
                    </div>
                    <span>{label}</span>
                  </button>
                ))}
              </nav>

              <div className="flex gap-2 p-3 pt-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex-1 h-8 text-xs"
                  onClick={() => navigate("/products")}
                >
                  Bekor
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending}
                  className="flex-1 h-8 gap-1 text-xs font-medium"
                  style={{ backgroundColor: "#1A2E44" }}
                >
                  <Save size={11} />
                  {isPending ? "Saqlanmoqda..." : isEdit ? "Saqlash" : "Qo'shish"}
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
      </form>
    </FormProvider>
  );
}

// ─── Page wrapper ─────────────────────────────────────────────────────────────

export default function ProductFormPage() {
  return (
    <LangTabProvider>
      <ProductForm />
    </LangTabProvider>
  );
}
