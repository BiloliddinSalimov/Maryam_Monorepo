import { useRef, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Upload,
  X,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Trash2,
  ImageOff,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGallery,
  useUploadToGallery,
  useDeleteFromGallery,
} from "@/hooks/useGallery";
import type { GalleryImage } from "@/types/gallery";

const BASE_URL = (import.meta.env.VITE_API_URL as string) ?? "";

function imageUrl(img: GalleryImage) {
  if (img.fullUrl) return img.fullUrl;
  if (img.url.startsWith("http")) return img.url;
  return BASE_URL.replace(/\/$/, "") + img.url;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Drag & Drop Upload Zone ─────────────────────────────────────────────────

function UploadZone({ onFiles }: { onFiles: (files: FileList) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length) onFiles(e.dataTransfer.files);
    },
    [onFiles],
  );

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1.5 py-5 cursor-pointer transition-colors",
        dragging
          ? "border-sky-400 bg-sky-50"
          : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50",
      )}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && onFiles(e.target.files)}
      />
      <Upload size={20} className="text-zinc-400" />
      <p className="text-sm text-zinc-500 font-medium">
        Rasmni shu yerga tashlang yoki{" "}
        <span className="text-sky-500">tanlang</span>
      </p>
      <p className="text-xs text-zinc-400">JPG, PNG, WEBP, GIF · Max 5MB</p>
    </div>
  );
}

// ─── Gallery Image Tile ───────────────────────────────────────────────────────

function ImageTile({
  image,
  selected,
  onSelect,
  onDelete,
  deleting,
}: {
  image: GalleryImage;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const src = imageUrl(image);

  return (
    <div
      className={cn(
        "relative group aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all",
        selected
          ? "border-[#1A2E44] ring-2 ring-[#1A2E44]/20"
          : "border-transparent hover:border-zinc-200",
      )}
      onClick={onSelect}
    >
      {imgError ? (
        <div className="w-full h-full bg-zinc-100 flex flex-col items-center justify-center gap-1">
          <ImageOff size={20} className="text-zinc-300" />
          <span className="text-[10px] text-zinc-400">Topilmadi</span>
        </div>
      ) : (
        <img
          src={src}
          alt={image.name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      )}

      {/* Selection overlay */}
      <div
        className={cn(
          "absolute inset-0 transition-opacity",
          selected
            ? "bg-[#1A2E44]/20 opacity-100"
            : "bg-black/0 opacity-0 group-hover:opacity-100 group-hover:bg-black/10",
        )}
      />

      {/* Checkmark */}
      {selected && (
        <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-[#1A2E44] flex items-center justify-center shadow-sm">
          <Check size={11} className="text-white" strokeWidth={3} />
        </div>
      )}

      {/* Delete button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        disabled={deleting}
        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-white/90 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 disabled:opacity-50"
      >
        {deleting ? (
          <Loader2 size={11} className="animate-spin text-zinc-400" />
        ) : (
          <Trash2 size={11} className="text-red-400" />
        )}
      </button>

      {/* Bottom info on hover */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <p className="text-white text-[10px] truncate font-medium">
          {image.name}
        </p>
        <p className="text-white/70 text-[9px]">{formatSize(image.size)}</p>
      </div>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

interface GalleryModalProps {
  open: boolean;
  onClose: () => void;
  /** Max images the caller can still select */
  maxSelect: number;
  onConfirm: (urls: string[]) => void;
}

export default function GalleryModal({
  open,
  onClose,
  maxSelect,
  onConfirm,
}: GalleryModalProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { images, meta, isLoading, isFetching } = useGallery(page, 20);
  const { mutateAsync: uploadImage, isPending: uploading } =
    useUploadToGallery();
  const { mutateAsync: deleteImage } = useDeleteFromGallery();

  // Client-side search filter
  const filtered = search.trim()
    ? images.filter((img) =>
        img.name.toLowerCase().includes(search.toLowerCase()),
      )
    : images;

  const totalPages = meta?.totalPages ?? 1;

  const toggleSelect = (url: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(url)) {
        next.delete(url);
      } else {
        if (next.size >= maxSelect) {
          toast.warning(`Maksimal ${maxSelect} ta rasm tanlanadi`);
          return prev;
        }
        next.add(url);
      }
      return next;
    });
  };

  const handleUpload = async (files: FileList) => {
    const arr = Array.from(files).slice(0, maxSelect);
    for (const file of arr) {
      try {
        const img = await uploadImage(file);
        const url = img.fullUrl ?? BASE_URL.replace(/\/$/, "") + img.url;
        setSelected((prev) => {
          const next = new Set(prev);
          if (next.size < maxSelect) next.add(url);
          return next;
        });
        toast.success(`${file.name} yuklandi`);
      } catch {
        toast.error(`${file.name} yuklanmadi`);
      }
    }
  };

  const handleDelete = async (img: GalleryImage) => {
    const url = imageUrl(img);
    setDeletingId(img.id);
    try {
      await deleteImage(img.id);
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(url);
        return next;
      });
      toast.success("Rasm o'chirildi");
    } catch {
      toast.error("O'chirishda xatolik");
    } finally {
      setDeletingId(null);
    }
  };

  const handleConfirm = () => {
    onConfirm(Array.from(selected));
    setSelected(new Set());
    setSearch("");
    setPage(1);
    onClose();
  };

  const handleClose = () => {
    setSelected(new Set());
    setSearch("");
    setPage(1);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-3xl w-full p-0 gap-0 overflow-hidden rounded-2xl">
        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-zinc-100">
          <div className="flex items-center justify-between">
            <DialogTitle
              className="text-base font-semibold"
              style={{ color: "#1A2E44" }}
            >
              Galereya
            </DialogTitle>
            <button
              type="button"
              onClick={handleClose}
              className="w-7 h-7 rounded-lg hover:bg-zinc-100 flex items-center justify-center transition-colors"
            >
              <X size={15} className="text-zinc-500" />
            </button>
          </div>

          {/* Search */}
          <div className="relative mt-3">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <Input
              placeholder="Rasm nomini qidiring..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </DialogHeader>

        {/* Body */}
        <div
          className="p-5 space-y-4 overflow-y-auto"
          style={{ maxHeight: "60vh" }}
        >
          {/* Upload zone */}
          {uploading ? (
            <div className="border-2 border-dashed border-sky-200 rounded-xl flex items-center justify-center gap-2 py-5 bg-sky-50">
              <Loader2 size={18} className="animate-spin text-sky-400" />
              <span className="text-sm text-sky-500 font-medium">
                Yuklanmoqda...
              </span>
            </div>
          ) : (
            <UploadZone onFiles={handleUpload} />
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-5 gap-2.5">
              {Array.from({ length: 15 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-zinc-100 animate-pulse"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <ImageOff size={32} className="text-zinc-200 mb-2" />
              <p className="text-sm text-zinc-400">
                {search ? "Qidiruv bo'yicha rasm topilmadi" : "Galereya bo'sh"}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-5 gap-2.5">
                {filtered.map((img) => {
                  const url = imageUrl(img);
                  return (
                    <ImageTile
                      key={img.id}
                      image={img}
                      selected={selected.has(url)}
                      onSelect={() => toggleSelect(url)}
                      onDelete={() => handleDelete(img)}
                      deleting={deletingId === img.id}
                    />
                  );
                })}
              </div>

              {/* Pagination */}
              {!search && totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    disabled={page <= 1 || isFetching}
                    onClick={() => setPage((p) => p - 1)}
                    className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center disabled:opacity-40 hover:bg-zinc-50 transition-colors"
                  >
                    <ChevronLeft size={15} className="text-zinc-600" />
                  </button>
                  <span className="text-xs text-zinc-500 min-w-[80px] text-center">
                    {isFetching ? (
                      <Loader2 size={12} className="animate-spin inline" />
                    ) : (
                      `${page} / ${totalPages}`
                    )}
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages || isFetching}
                    onClick={() => setPage((p) => p + 1)}
                    className="w-8 h-8 rounded-lg border border-zinc-200 flex items-center justify-center disabled:opacity-40 hover:bg-zinc-50 transition-colors"
                  >
                    <ChevronRight size={15} className="text-zinc-600" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-between">
          <p className="text-xs text-zinc-400">
            {selected.size > 0 ? (
              <span className="text-[#1A2E44] font-medium">
                {selected.size} ta tanlangan
              </span>
            ) : (
              `Maksimal ${maxSelect} ta rasm tanlanadi`
            )}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="h-8 text-sm"
            >
              Bekor qilish
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={selected.size === 0}
              onClick={handleConfirm}
              className="h-8 text-sm gap-1.5"
              style={{ backgroundColor: "#1A2E44" }}
            >
              <Check size={13} />
              Qo'shish ({selected.size})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
