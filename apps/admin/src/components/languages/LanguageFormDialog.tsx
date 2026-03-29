import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/errorMessage";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import FormField from "@/components/shared/FormField";

import { languageSchema, type LanguageFormValues } from "@/schemas/languageSchema";
import { useCreateLanguage, useUpdateLanguage } from "@/hooks/useLanguages";
import type { Language } from "@/types/language";

interface Props {
  open: boolean;
  onClose: () => void;
  editItem?: Language | null;
}

export default function LanguageFormDialog({ open, onClose, editItem }: Props) {
  const isEdit = !!editItem;

  const { mutate: create, isPending: creating } = useCreateLanguage();
  const { mutate: update, isPending: updating } = useUpdateLanguage(editItem?.id ?? "");
  const isPending = creating || updating;

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } =
    useForm<LanguageFormValues>({
      resolver: zodResolver(languageSchema),
      defaultValues: { code: "", name: "", isDefault: false, isActive: true },
    });

  useEffect(() => {
    if (editItem) {
      reset({
        code: editItem.code,
        name: editItem.name,
        isDefault: editItem.isDefault,
        isActive: editItem.isActive,
      });
    } else {
      reset({ code: "", name: "", isDefault: false, isActive: true });
    }
  }, [editItem, open]);

  const onSubmit = (values: LanguageFormValues) => {
    if (isEdit) {
      update(
        { name: values.name, isDefault: values.isDefault, isActive: values.isActive },
        {
          onSuccess: () => { toast.success("Til yangilandi"); onClose(); },
          onError: (err) => toast.error(getErrorMessage(err)),
        },
      );
    } else {
      create(values, {
        onSuccess: () => { toast.success("Til qo'shildi"); onClose(); },
        onError: (err) => toast.error(getErrorMessage(err)),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-[15px]">
            {isEdit ? "Tilni tahrirlash" : "Yangi til qo'shish"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Til kodi" required error={errors.code?.message}>
            <Input
              placeholder="uz, ru, en..."
              disabled={isEdit}
              {...register("code")}
              className={errors.code ? "border-red-300" : ""}
            />
          </FormField>

          <FormField label="Til nomi" required error={errors.name?.message}>
            <Input
              placeholder="O'zbek, Русский, English..."
              {...register("name")}
              className={errors.name ? "border-red-300" : ""}
            />
          </FormField>

          {/* Toggle switches */}
          <div className="space-y-2 pt-1">
            {(
              [
                { field: "isDefault" as const, label: "Asosiy til", desc: "Standart til sifatida belgilash" },
                { field: "isActive" as const, label: "Faol", desc: "Til saytda ko'rinadi" },
              ] as const
            ).map(({ field, label, desc }) => (
              <div
                key={field}
                className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2.5"
              >
                <div>
                  <p className="text-[13px] font-medium text-zinc-700">{label}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{desc}</p>
                </div>
                <Switch
                  checked={watch(field)}
                  onCheckedChange={(v) => setValue(field, v)}
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending} className="h-9">
              Bekor
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="h-9"
              style={{ backgroundColor: "#1A2E44" }}
            >
              {isPending ? "Saqlanmoqda..." : isEdit ? "Saqlash" : "Qo'shish"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
