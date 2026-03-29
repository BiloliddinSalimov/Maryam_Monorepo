import { Tag } from "lucide-react";

interface Props {
  src?: string | null;
  name: string;
  size?: "sm" | "md";
}

/**
 * Circular/square avatar for a category — shows image or fallback icon.
 */
export default function CategoryImage({ src, name, size = "sm" }: Props) {
  const dim = size === "sm" ? "w-8 h-8" : "w-12 h-12";
  const iconSize = size === "sm" ? 13 : 18;

  if (!src) {
    return (
      <div
        className={`${dim} rounded-lg flex items-center justify-center flex-shrink-0`}
        style={{ background: "linear-gradient(135deg, #e8f4fd 0%, #c8e8f8 100%)" }}
      >
        <Tag size={iconSize} className="text-[#1A2E44]/40" />
      </div>
    );
  }

  return (
    <div className={`${dim} rounded-lg overflow-hidden flex-shrink-0 border border-zinc-100 bg-zinc-50`}>
      <img src={src} alt={name} className="w-full h-full object-cover" />
    </div>
  );
}
