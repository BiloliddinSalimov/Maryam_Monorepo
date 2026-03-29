import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadService } from "@/services/uploadService";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  max = 5,
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = max - value.length;
    if (remaining <= 0) {
      toast.error(`Maksimal ${max} ta rasm yuklash mumkin`);
      return;
    }
    const toUpload = Array.from(files).slice(0, remaining);
    setUploading(true);
    try {
      const urls = await uploadService.multiple(toUpload);
      onChange([...value, ...urls]);
      toast.success(`${urls.length} ta rasm yuklandi`);
    } catch {
      toast.error("Rasm yuklashda xatolik");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Uploaded images */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((url, i) => (
            <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-zinc-200">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload zone */}
      {value.length < max && (
        <div
          className="border-2 border-dashed border-zinc-200 rounded-lg p-6 text-center cursor-pointer hover:border-zinc-300 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-5 h-5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-zinc-500">Yuklanmoqda...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center">
                <ImageIcon size={18} className="text-zinc-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-600">
                  Rasm yuklash uchun bosing
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">
                  PNG, JPG, WEBP • Maks {max} ta
                </p>
              </div>
              <Button type="button" variant="outline" size="sm" className="gap-1.5">
                <Upload size={13} /> Fayl tanlash
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
