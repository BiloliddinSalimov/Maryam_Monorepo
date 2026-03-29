import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable form field wrapper:
 * - Consistent label style
 * - Red asterisk for required
 * - Error message below
 * - Optional hint text
 */
export default function FormField({
  label,
  required,
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label className="text-[13px] font-medium text-zinc-600">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </Label>
      )}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
      {!error && hint && <p className="text-xs text-zinc-400">{hint}</p>}
    </div>
  );
}
