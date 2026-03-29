import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/errorMessage";
import { Image, Camera, X, Loader2, Link2, Hash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import FormField from "@/components/shared/FormField";
import MultiLangInput from "@/components/shared/MultiLangInput";
import GalleryModal from "@/components/shared/GalleryModal";
import { LangTabProvider, LangTabBar } from "@/context/LangTabContext";

import { bannerSchema, type BannerFormValues } from "@/schemas/bannerSchema";
import { useCreateBanner, useUpdateBanner, useBanners } from "@/hooks/useBanners";
import { useLanguages } from "@/hooks/useLanguages";

// ── Wide banner image picker ──────────────────────────────────────────────────

function BannerImagePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative w-full overflow-hidden rounded-2xl border-2 border-dashed border-zinc-200 hover:border-primary/40 bg-zinc-50 hover:bg-zinc-100 transition-all"
        style={{ aspectRatio: "16/5" }}
      >
        {value ? (
          <>
            <img src={value} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <Camera size={22} className="text-white" />
              <span className="text-white text-xs font-medium">Rasmni almashtirish</span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
              <Image size={22} className="text-zinc-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-500">Banner rasmi</p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Tavsiya: 1200×375 px (16:5 nisbat) · PNG yoki JPG
              </p>
            </div>
          </div>
        )}
      </button>

      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="mt-2 flex items-center gap-1 text-[11px] text-red-400 hover:text-red-600 transition-colors"
        >
          <X size={11} />
          Rasmni o'chirish
        </button>
      )}

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

// ── Main form ─────────────────────────────────────────────────────────────────

function BannerForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;

  const { banners } = useBanners();
  const { languages } = useLanguages();
  const { mutate: create, isPending: creating } = useCreateBanner();
  const { mutate: update, isPending: updating } = useUpdateBanner(id ?? "");
  const isPending = creating || updating;

  const editItem = isEdit ? banners.find((b) => b.id === id) : undefined;
  const nextOrder = banners.length > 0 ? Math.max(...banners.map((b) => b.order)) + 1 : 0;

  const form = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema),
    defaultValues: {
      title: {},
      image: "",
      link: "",
      isActive: true,
      order: nextOrder,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (editItem) {
      reset({
        title: editItem.title ?? {},
        image: editItem.image ?? "",
        link: editItem.link ?? "",
        isActive: editItem.isActive ?? true,
        order: editItem.order ?? 0,
      });
    }
  }, [editItem?.id]);

  const onSubmit = (values: BannerFormValues) => {
    const dto = {
      title: values.title,
      image: values.image,
      link: values.link || undefined,
      isActive: values.isActive,
      order: values.order,
    };
    if (isEdit) {
      update(dto, {
        onSuccess: () => {
          toast.success("Banner yangilandi");
          navigate("/banners");
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      });
    } else {
      create(dto, {
        onSuccess: () => {
          toast.success("Banner qo'shildi");
          navigate("/banners");
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      });
    }
  };

  const imageValue = watch("image") ?? "";
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
                    style={{ background: "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 100%)" }}
                  >
                    <Image size={15} color="white" />
                  </div>
                  <div>
                    <h1 className="text-[15px] font-semibold text-zinc-800">
                      {isEdit ? "Bannerni tahrirlash" : "Yangi banner"}
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {isEdit ? "Ma'lumotlarni yangilang va saqlang" : "Banner ma'lumotlarini kiriting"}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="px-6 py-5 space-y-5">

                  {/* ── Banner image ──────────────────────────────── */}
                  <FormField
                    label="Banner rasmi *"
                    error={errors.image?.message}
                    hint="Tavsiya qilingan o'lcham: 1200×375 px (16:5 nisbat)"
                  >
                    <BannerImagePicker
                      value={imageValue}
                      onChange={(url) => setValue("image", url)}
                    />
                  </FormField>

                  {/* ── Title (multilingual) ──────────────────────── */}
                  <div className="space-y-3">
                    <LangTabBar />
                    <MultiLangInput
                      field="title"
                      label="Banner sarlavhasi"
                      placeholder="Sarlavhani kiriting"
                    />
                  </div>

                  {/* ── Link ─────────────────────────────────────── */}
                  <FormField
                    label="Havola (Link)"
                    hint="Bosilganda qayerga o'tishi. Bo'sh qoldirsangiz hech qaerga o'tmaydi"
                  >
                    <div className="relative">
                      <Link2
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                      />
                      <Input
                        placeholder="/products?sale=true yoki https://..."
                        {...register("link")}
                        className="pl-8 text-[13px]"
                      />
                    </div>
                  </FormField>

                  {/* ── Order + isActive row ─────────────────────── */}
                  <div className="flex items-start gap-4">
                    {/* Order */}
                    <FormField
                      label="Tartib raqami"
                      hint="Kichik raqam birinchi chiqadi"
                      className="flex-1"
                    >
                      <div className="relative">
                        <Hash
                          size={13}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                        />
                        <Input
                          type="number"
                          min={0}
                          {...register("order", { valueAsNumber: true })}
                          className="pl-8 w-28 text-[13px]"
                        />
                      </div>
                    </FormField>

                    {/* isActive */}
                    <div className="flex flex-col gap-1.5 pt-0.5">
                      <span className="text-[13px] font-medium text-zinc-700">Holat</span>
                      <div className="flex items-center gap-2.5 h-10">
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
                </div>

                {/* ── Footer ────────────────────────────────────── */}
                <div className="px-6 pb-6 flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-10"
                    onClick={() => navigate("/banners")}
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

export default function BannerFormPage() {
  return (
    <LangTabProvider>
      <BannerForm />
    </LangTabProvider>
  );
}
