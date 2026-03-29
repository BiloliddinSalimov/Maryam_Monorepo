import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/errorMessage";
import { Tag, ChevronRight } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import ImageUploadGrid from "@/components/shared/ImageUploadGrid";

import { categorySchema, type CategoryFormValues } from "@/schemas/categorySchema";
import { slugify } from "@/lib/slugify";
import { useCreateCategory, useUpdateCategory, useCategories } from "@/hooks/useCategories";
import type { Category } from "@/types/category";

interface Props {
  open: boolean;
  onClose: () => void;
  editItem?: Category | null;
}

export default function CategoryFormDialog({ open, onClose, editItem }: Props) {
  const isEdit = !!editItem;
  const { categories } = useCategories();

  const { mutate: create, isPending: creating } = useCreateCategory();
  const { mutate: update, isPending: updating } = useUpdateCategory(editItem?.id ?? "");
  const isPending = creating || updating;

  const parentOptions = categories.filter((c) => !c.parentId && c.id !== editItem?.id);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } =
    useForm<CategoryFormValues>({
      resolver: zodResolver(categorySchema),
      defaultValues: { name: {}, slug: "", image: "", parentId: "", productIds: [] },
    });

  useEffect(() => {
    if (editItem) {
      reset({
        name: typeof editItem.name === "string" ? { uz: editItem.name } : editItem.name,
        slug: editItem.slug,
        image: editItem.image ?? "",
        parentId: editItem.parentId ?? "",
        productIds: [],
      });
    } else {
      reset({ name: {}, slug: "", image: "", parentId: "", productIds: [] });
    }
  }, [editItem, open]);

  // Auto-slug from name on create
  const watchName = watch("name");
  useEffect(() => {
    if (!isEdit) setValue("slug", slugify(Object.values(watchName)[0] ?? ""));
  }, [watchName, isEdit]);

  const onSubmit = (values: CategoryFormValues) => {
    const dto = {
      name: values.name,
      slug: values.slug,
      image: values.image || undefined,
      parentId: values.parentId || undefined,
    };
    if (isEdit) {
      update(dto, {
        onSuccess: () => { toast.success("Kategoriya yangilandi"); onClose(); },
        onError: (err) => toast.error(getErrorMessage(err)),
      });
    } else {
      create(dto, {
        onSuccess: () => { toast.success("Kategoriya qo'shildi"); onClose(); },
        onError: (err) => toast.error(getErrorMessage(err)),
      });
    }
  };

  const imageValue = watch("image");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden gap-0">

        {/* ── Header ──────────────────────────────────────────────── */}
        <DialogHeader className="px-6 py-5 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 100%)" }}
            >
              <Tag size={15} color="white" strokeWidth={2} />
            </div>
            <div>
              <DialogTitle className="text-[15px] font-semibold text-zinc-800">
                {isEdit ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}
              </DialogTitle>
              <p className="text-[12px] text-zinc-400 mt-0.5">
                {isEdit
                  ? "Ma'lumotlarni yangilang va saqlang"
                  : "Yangi kategoriya ma'lumotlarini kiriting"}
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="px-6 py-5 space-y-5">

            {/* ── Image section ────────────────────────────────────── */}
            <div className="flex gap-4 items-start p-4 rounded-xl bg-zinc-50 border border-zinc-100">
              {/* Preview */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-xl border-2 border-dashed border-zinc-200 bg-white flex items-center justify-center overflow-hidden">
                  {imageValue ? (
                    <img
                      src={imageValue}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Tag size={22} className="text-zinc-300" />
                  )}
                </div>
              </div>

              {/* Upload area */}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-zinc-700 mb-1">
                  Kategoriya rasmi
                </p>
                <p className="text-[11px] text-zinc-400 mb-3">
                  Tavsiya etiladi: 200×200 px, PNG yoki JPG
                </p>
                <ImageUploadGrid
                  value={imageValue ? [imageValue] : []}
                  onChange={(urls) => setValue("image", urls[0] ?? "")}
                  max={1}
                  cols={1}
                />
              </div>
            </div>

            {/* ── Name & Slug ──────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Nomi" required error={typeof errors.name?.message === "string" ? errors.name.message : undefined}>
                <Input
                  placeholder="Kategoriya nomi"
                  {...register("name")}
                  className={errors.name ? "border-red-300" : ""}
                />
              </FormField>

              <FormField
                label="Slug"
                required
                error={errors.slug?.message}
                hint="Avtomatik hosil bo'ladi"
              >
                <Input
                  placeholder="kategoriya-nomi"
                  {...register("slug")}
                  className={errors.slug ? "border-red-300" : ""}
                />
              </FormField>
            </div>

            {/* ── Parent category ──────────────────────────────────── */}
            {parentOptions.length > 0 && (
              <FormField label="Asosiy kategoriya">
                <Select
                  value={watch("parentId") ?? ""}
                  onValueChange={(v) => setValue("parentId", v === "none" ? "" : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang (ixtiyoriy)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">— Asosiy kategoriya yo'q —</SelectItem>
                    {parentOptions.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <span className="flex items-center gap-1.5">
                          <ChevronRight size={12} className="text-zinc-400" />
                          {typeof cat.name === "string" ? cat.name : Object.values(cat.name)[0] ?? "—"}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            )}
          </div>

          {/* ── Footer ──────────────────────────────────────────────── */}
          <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-zinc-100 bg-zinc-50/60">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="h-9 px-4 text-[13px]"
            >
              Bekor
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-9 px-5 text-[13px] font-medium gap-1.5"
              style={{ backgroundColor: "#1A2E44" }}
            >
              {isPending ? "Saqlanmoqda..." : isEdit ? "Saqlash" : "Qo'shish"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
