import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/errorMessage";
import {
  LayoutTemplate,
  Loader2,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import FormField from "@/components/shared/FormField";
import MultiLangInput from "@/components/shared/MultiLangInput";
import { LangTabProvider, LangTabBar } from "@/context/LangTabContext";

import SectionTypeSelector, {
  SECTION_TYPE_META,
} from "@/components/sections/SectionTypeSelector";
import BannerListConfig   from "@/components/sections/config/BannerListConfig";
import ProductListConfig  from "@/components/sections/config/ProductListConfig";
import CategoryListConfig from "@/components/sections/config/CategoryListConfig";

import {
  useSections,
  useCreateSection,
  useUpdateSection,
} from "@/hooks/useSections";
import type { SectionType, SortBy, CreateSectionDto } from "@/types/section";

// ── Form value shape ──────────────────────────────────────────────────────────

interface SectionFormValues {
  type: SectionType | null;
  title: Record<string, string>;
  isActive: boolean;
  // BANNER
  bannerMode: "auto" | "manual";
  bannerIds: string[];
  // PRODUCT_LIST
  productMode: "auto" | "manual";
  productIds: string[];
  sortBy: SortBy;
  // CATEGORY_LIST
  categoryMode: "showAll" | "manual";
  categoryIds: string[];
  // shared
  limit: number;
}

// ── Inner form (needs LangTabProvider above) ──────────────────────────────────

function SectionForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const { sections } = useSections();
  const { mutate: create, isPending: creating } = useCreateSection();
  const { mutate: update, isPending: updating } = useUpdateSection(id ?? "");
  const isPending = creating || updating;

  const editItem = isEdit ? sections.find((s) => s.id === id) : undefined;

  const form = useForm<SectionFormValues>({
    defaultValues: {
      type: null,
      title: {},
      isActive: true,
      bannerMode: "auto",
      bannerIds: [],
      productMode: "auto",
      productIds: [],
      sortBy: "newest",
      categoryMode: "showAll",
      categoryIds: [],
      limit: 8,
    },
  });

  const { handleSubmit, watch, setValue, reset } = form;

  // ── Populate form on edit ─────────────────────────────────────────────────

  useEffect(() => {
    if (!editItem) return;
    const cfg = editItem.config as Record<string, unknown>;

    // Detect bannerMode
    const bannerMode: "auto" | "manual" =
      cfg?.bannerIds && (cfg.bannerIds as string[]).length > 0
        ? "manual"
        : "auto";

    // Detect productMode
    const productMode: "auto" | "manual" =
      cfg?.productIds && (cfg.productIds as string[]).length > 0
        ? "manual"
        : "auto";

    // Detect categoryMode
    const categoryMode: "showAll" | "manual" = cfg?.showAll ? "showAll" : "manual";

    reset({
      type: editItem.type,
      title: (editItem.title ?? {}) as Record<string, string>,
      isActive: editItem.isActive,
      bannerMode,
      bannerIds: (cfg?.bannerIds as string[]) ?? [],
      productMode,
      productIds: (cfg?.productIds as string[]) ?? [],
      sortBy: (cfg?.sortBy as SortBy) ?? "newest",
      categoryMode,
      categoryIds: (cfg?.categoryIds as string[]) ?? [],
      limit: (cfg?.limit as number) ?? 8,
    });
  }, [editItem?.id]);

  // ── Build config from form values ─────────────────────────────────────────

  const buildConfig = (values: SectionFormValues): CreateSectionDto["config"] => {
    switch (values.type) {
      case "BANNER":
        if (values.bannerMode === "manual" && values.bannerIds.length > 0) {
          return { bannerIds: values.bannerIds };
        }
        return {}; // auto — backend shows all active banners
      case "PRODUCT_LIST":
        if (values.productMode === "manual") {
          return { productIds: values.productIds };
        }
        return { sortBy: values.sortBy, limit: values.limit };
      case "CATEGORY_LIST":
        if (values.categoryMode === "showAll") {
          return { showAll: true, limit: values.limit };
        }
        return { categoryIds: values.categoryIds };
      default:
        return {};
    }
  };

  // ── Submit ────────────────────────────────────────────────────────────────

  const onSubmit = (values: SectionFormValues) => {
    if (!values.type) {
      toast.error("Bo'lim turini tanlang");
      return;
    }

    const dto: CreateSectionDto = {
      type: values.type,
      title: Object.keys(values.title).length > 0 ? values.title : undefined,
      isActive: values.isActive,
      config: buildConfig(values),
    };

    if (isEdit) {
      update(dto, {
        onSuccess: () => {
          toast.success("Bo'lim yangilandi");
          navigate("/homepage");
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      });
    } else {
      create(dto, {
        onSuccess: () => {
          toast.success("Bo'lim qo'shildi");
          navigate("/homepage");
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      });
    }
  };

  const sectionType = watch("type");
  const isActive = watch("isActive");

  return (
    <FormProvider {...form}>
      <div className="min-h-screen bg-zinc-50/60 flex flex-col">

        {/* ── Card ─────────────────────────────────────────────────────── */}
        <div className="flex flex-1 items-start justify-center px-4 py-8">
          <div className="w-full max-w-2xl">
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">

              {/* Card header */}
              <div className="px-6 pt-6 pb-4 border-b border-zinc-50 bg-gradient-to-b from-zinc-50 to-white">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 100%)",
                    }}
                  >
                    {sectionType ? (
                      (() => {
                        const Icon = SECTION_TYPE_META[sectionType].icon;
                        return <Icon size={15} color="white" />;
                      })()
                    ) : (
                      <LayoutTemplate size={15} color="white" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-[15px] font-semibold text-zinc-800">
                      {isEdit ? "Bo'limni tahrirlash" : "Yangi bo'lim"}
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {isEdit
                        ? "Ma'lumotlarni yangilang va saqlang"
                        : "Bo'lim turini tanlang va sozlang"}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="px-6 py-5 space-y-6">

                  {/* ── Section type ──────────────────────────────── */}
                  <FormField
                    label="Bo'lim turi *"
                    hint={
                      isEdit
                        ? "Bo'lim turini o'zgartirib bo'lmaydi"
                        : "Bosh sahifada qanday kontent ko'rsatilishini tanlang"
                    }
                  >
                    {isEdit && sectionType ? (
                      <div
                        className={`flex items-center gap-3 p-3.5 rounded-xl border-2 border-[#1A2E44] bg-[#1A2E44]/4`}
                      >
                        {(() => {
                          const meta = SECTION_TYPE_META[sectionType];
                          const Icon = meta.icon;
                          return (
                            <>
                              <div
                                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border bg-[#1A2E44]/10 border-[#1A2E44]/20`}
                              >
                                <Icon size={17} className="text-[#1A2E44]" />
                              </div>
                              <div>
                                <p className="text-[13px] font-semibold text-[#1A2E44]">
                                  {meta.label}
                                </p>
                                <p className="text-[11px] text-zinc-400 mt-0.5">
                                  {meta.description}
                                </p>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      <SectionTypeSelector
                        value={sectionType}
                        onChange={(t) => setValue("type", t)}
                      />
                    )}
                  </FormField>

                  {/* ── Config (dynamic per type) ─────────────────── */}
                  {sectionType && (
                    <div>
                      {sectionType === "BANNER" && (
                        <FormField label="Bannerlar sozlamasi">
                          <BannerListConfig />
                        </FormField>
                      )}

                      {sectionType === "PROMO_BLOCK" && (
                        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                          <Info size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                          <p className="text-[13px] text-emerald-700 leading-relaxed">
                            Promo blok bosh sahifada reklama yoki e'lon bloki sifatida
                            ko'rsatiladi. Qo'shimcha sozlamalar kerak emas.
                          </p>
                        </div>
                      )}

                      {sectionType === "PRODUCT_LIST" && (
                        <FormField label="Mahsulotlar sozlamasi">
                          <ProductListConfig />
                        </FormField>
                      )}

                      {sectionType === "CATEGORY_LIST" && (
                        <FormField label="Kategoriyalar sozlamasi">
                          <CategoryListConfig />
                        </FormField>
                      )}
                    </div>
                  )}

                  {/* ── Title (multilingual, optional) ───────────── */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-zinc-700">
                        Sarlavha{" "}
                        <span className="text-zinc-400 font-normal">
                          (ixtiyoriy)
                        </span>
                      </span>
                    </div>
                    <LangTabBar />
                    <MultiLangInput
                      field="title"
                      label=""
                      placeholder="Bo'lim sarlavhasini kiriting"
                    />
                  </div>

                  {/* ── isActive ──────────────────────────────────── */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                    <div>
                      <p className="text-[13px] font-medium text-zinc-700">
                        Holati
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        O'chirilgan bo'limlar bosh sahifada ko'rinmaydi
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Switch
                        checked={isActive}
                        onCheckedChange={(v) => setValue("isActive", v)}
                      />
                      <span
                        className={`text-[13px] font-medium ${
                          isActive ? "text-emerald-600" : "text-zinc-400"
                        }`}
                      >
                        {isActive ? "Faol" : "Yashirin"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── Footer ────────────────────────────────────── */}
                <div className="px-6 pb-6 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-10"
                    onClick={() => navigate("/homepage")}
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
          </div>
        </div>
      </div>
    </FormProvider>
  );
}

// ── Page export (with LangTabProvider) ───────────────────────────────────────

export default function SectionFormPage() {
  return (
    <LangTabProvider>
      <SectionForm />
    </LangTabProvider>
  );
}
