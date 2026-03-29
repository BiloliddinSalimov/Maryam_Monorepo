import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
        style={{ backgroundColor: "#E8F8FF" }}
      >
        <Icon size={24} style={{ color: "#1A2E44" }} />
      </div>
      <h3 className="text-base font-semibold text-zinc-700">{title}</h3>
      {description && <p className="text-sm text-zinc-400 mt-1 max-w-xs">{description}</p>}
      {action && (
        <Button onClick={action.onClick} className="mt-4" size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}
