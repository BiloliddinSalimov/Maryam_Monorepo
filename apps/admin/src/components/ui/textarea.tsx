import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex w-full rounded-lg border bg-white px-3 py-2 text-sm",
      "border-zinc-200 text-zinc-800 placeholder:text-zinc-400",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/40",
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-zinc-50",
      "transition-colors resize-none",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export { Textarea };
