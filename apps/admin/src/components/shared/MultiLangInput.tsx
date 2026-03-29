import { useFormContext } from "react-hook-form";
import { useLanguages } from "@/hooks/useLanguages";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLangTab } from "@/context/LangTabContext";
import FormField from "@/components/shared/FormField";
import { cn } from "@/lib/utils";

interface Props {
  field: string;
  label: string;
  type?: "input" | "textarea";
  placeholder?: string;
  required?: boolean;
}

export default function MultiLangInput({ field, label, type = "input", placeholder, required }: Props) {
  const { register, formState: { errors } } = useFormContext();
  const { languages } = useLanguages();
  const { activeLang } = useLangTab();

  const activeLangs = languages.filter((l) => l.isActive);
  if (activeLangs.length === 0) return null;

  const fieldErrors = (
    errors as Record<string, Record<string, { message?: string } | undefined> | undefined>
  )[field];

  const currentLang = activeLang || activeLangs[0]?.code || "";

  return (
    <FormField label={label} required={required}>
      {/* All lang inputs in DOM (hidden/visible) so RHF tracks all */}
      {activeLangs.map((lang) => {
        const key = `${field}.${lang.code}`;
        const error = fieldErrors?.[lang.code];
        const isVisible = lang.code === currentLang;

        return (
          <div key={lang.code} className={isVisible ? "block space-y-1" : "hidden"}>
            {type === "textarea" ? (
              <Textarea
                {...register(key)}
                placeholder={placeholder ?? `${label} (${lang.name})`}
                rows={3}
                className={cn(error ? "border-red-300" : "")}
              />
            ) : (
              <Input
                {...register(key)}
                placeholder={placeholder ?? `${label} (${lang.name})`}
                className={cn(error ? "border-red-300" : "")}
              />
            )}
            {error?.message && (
              <p className="text-xs text-red-500">{error.message}</p>
            )}
          </div>
        );
      })}
    </FormField>
  );
}
