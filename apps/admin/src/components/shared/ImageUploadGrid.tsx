import { useState } from "react";
import { Plus, X, Images } from "lucide-react";
import { cn } from "@/lib/utils";
import GalleryModal from "@/components/shared/GalleryModal";

interface ImageUploadGridProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  cols?: number;
}

export default function ImageUploadGrid({
  value,
  onChange,
  max = 8,
  cols = 4,
}: ImageUploadGridProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);

  const remaining = max - value.length;

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleGalleryConfirm = (urls: string[]) => {
    const combined = [...value, ...urls].slice(0, max);
    onChange(combined);
  };

  const slots = Array.from({ length: max });

  return (
    <>
      <div
        className="grid gap-2.5"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {slots.map((_, i) => {
          const url = value[i];

          if (url) {
            return (
              <div
                key={i}
                className="relative overflow-hidden border group aspect-square rounded-xl border-zinc-200 bg-zinc-50"
              >
                <img src={url} alt="" className="object-cover w-full h-full" />
                <div className="absolute inset-0 flex items-center justify-center transition-opacity opacity-0 bg-black/40 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="flex items-center justify-center transition-colors rounded-full shadow-sm w-7 h-7 bg-white/90 hover:bg-white"
                  >
                    <X size={13} className="text-zinc-700" />
                  </button>
                </div>
                {i === 0 && (
                  <div className="absolute bottom-1.5 left-1.5 bg-[#1A2E44]/80 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md">
                    Asosiy
                  </div>
                )}
              </div>
            );
          }

          if (i === value.length) {
            return (
              <button
                key={i}
                type="button"
                onClick={() => setGalleryOpen(true)}
                className={cn(
                  "aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group",
                  "border-zinc-300 hover:border-[#1A2E44] hover:bg-blue-50/40",
                )}
              >
                <div className="w-8 h-8 rounded-lg bg-zinc-100 group-hover:bg-[#1A2E44]/10 flex items-center justify-center transition-colors">
                  <Plus
                    size={16}
                    className="text-zinc-400 group-hover:text-[#1A2E44]"
                  />
                </div>
                <span className="text-[10px] text-zinc-400 group-hover:text-[#1A2E44] font-medium transition-colors">
                  Rasm qo'shish
                </span>
              </button>
            );
          }

          return (
            <div
              key={i}
              className="flex items-center justify-center border-2 border-dashed aspect-square rounded-xl border-zinc-100 opacity-30"
            >
              <Images size={15} className="text-zinc-300" />
            </div>
          );
        })}
      </div>

      <GalleryModal
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        maxSelect={remaining > 0 ? remaining : 1}
        onConfirm={handleGalleryConfirm}
      />
    </>
  );
}
