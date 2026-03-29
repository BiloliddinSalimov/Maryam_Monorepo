import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Image,
  ImageOff,
  Link2,
  GripVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/errorMessage";

import PageHero from "@/components/shared/PageHero";
import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";

import {
  useBanners,
  useDeleteBanner,
  useUpdateBanner,
} from "@/hooks/useBanners";
import { useLanguages } from "@/hooks/useLanguages";
import type { Banner } from "@/types/banner";

// ── Active toggle (calls PUT isActive) ───────────────────────────────────────

function ActiveToggle({ banner }: { banner: Banner }) {
  const { mutate: update, isPending } = useUpdateBanner(banner.id);

  const toggle = () => {
    update(
      { isActive: !banner.isActive },
      {
        onSuccess: () =>
          toast.success(
            banner.isActive ? "Banner yashirildi" : "Banner faollashtirildi",
          ),
        onError: (err) => toast.error(getErrorMessage(err)),
      },
    );
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      title={banner.isActive ? "Yashirish" : "Faollashtirish"}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
        banner.isActive
          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
          : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200"
      } disabled:opacity-50`}
    >
      {banner.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
      {banner.isActive ? "Faol" : "Yashirin"}
    </button>
  );
}

// ── Banner card ───────────────────────────────────────────────────────────────

function BannerCard({
  banner,
  lang,
  onEdit,
  onDelete,
}: {
  banner: Banner;
  lang: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const title = banner.title[lang] ?? Object.values(banner.title)[0] ?? "—";

  return (
    <div
      className={`group relative bg-white rounded-2xl border overflow-hidden transition-all hover:shadow-md ${
        banner.isActive ? "border-zinc-100" : "border-zinc-100 opacity-60"
      }`}
    >
      {/* Order badge */}
      <div className="absolute z-10 flex items-center justify-center w-6 h-6 rounded-lg top-3 left-3 bg-black/50 backdrop-blur">
        <span className="text-[11px] font-bold text-white">{banner.order}</span>
      </div>

      {/* Status badge */}
      <div className="absolute z-10 top-3 right-3">
        <ActiveToggle banner={banner} />
      </div>

      {/* Banner image — wide aspect ratio */}
      <div
        className="w-full overflow-hidden bg-zinc-100"
        style={{ aspectRatio: "16/5" }}
      >
        {banner.image ? (
          <img
            src={banner.image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full gap-2">
            <ImageOff size={28} className="text-zinc-300" />
            <p className="text-xs text-zinc-400">Rasm yo'q</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-4 py-3">
        <GripVertical
          size={14}
          className="flex-shrink-0 text-zinc-300 cursor-grab"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-zinc-800 truncate">
            {title}
          </p>
          {banner.link ? (
            <div className="flex items-center gap-1 mt-0.5">
              <Link2 size={11} className="flex-shrink-0 text-zinc-400" />
              <span className="text-[11px] text-zinc-400 truncate">
                {banner.link}
              </span>
            </div>
          ) : (
            <span className="text-[11px] text-zinc-300">Havola yo'q</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center justify-center w-8 h-8 transition-colors border rounded-xl bg-zinc-50 border-zinc-200 hover:bg-zinc-100"
          >
            <Pencil size={13} className="text-zinc-500" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center justify-center w-8 h-8 transition-colors border rounded-xl bg-zinc-50 border-zinc-200 hover:bg-red-50 hover:border-red-100"
          >
            <Trash2 size={13} className="text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function BannersPage() {
  const navigate = useNavigate();
  const { banners, isLoading } = useBanners();
  const { mutate: deleteBanner, isPending: deleting } = useDeleteBanner();
  const { languages } = useLanguages();

  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);

  const defaultLang =
    languages.find((l) => l.isDefault)?.code ??
    languages.find((l) => l.isActive)?.code ??
    "uz";

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteBanner(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Banner o'chirildi");
        setDeleteTarget(null);
      },
      onError: (err) => toast.error(getErrorMessage(err, "O'chirishda xatolik")),
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-6 pb-10">
      <PageHero
        icon={Image}
        title="Bannerlar"
        stats={[{ value: banners.length, label: "ta banner" }]}
        actionLabel="Banner qo'shish"
        onAction={() => navigate("/banners/create")}
      />

      {isLoading ? (
        <div className="mt-2 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="overflow-hidden bg-white border rounded-2xl border-zinc-100"
            >
              <div
                className="w-full bg-zinc-100 animate-pulse"
                style={{ aspectRatio: "16/5" }}
              />
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 space-y-1.5">
                  <div className="w-40 h-4 rounded-lg bg-zinc-100 animate-pulse" />
                  <div className="w-24 h-3 rounded-lg bg-zinc-100 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 mt-2 text-center bg-white border shadow-sm rounded-2xl border-zinc-100">
          <div
            className="flex items-center justify-center mb-4 w-14 h-14 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 100%)",
            }}
          >
            <ImageOff size={24} color="white" />
          </div>
          <h3 className="text-[15px] font-semibold text-zinc-700 mb-1">
            Hali banner qo'shilmagan
          </h3>
          <p className="max-w-xs mb-5 text-sm text-zinc-400">
            Sayt bosh sahifasida ko'rinadigan bannerlar qo'shing
          </p>
          <button
            type="button"
            onClick={() => navigate("/banners/create")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 100%)" }}
          >
            <Plus size={14} />
            Birinchi bannerni qo'shish
          </button>
        </div>
      ) : (
        <div className="mt-2 space-y-3">
          {[...banners]
            .sort((a, b) => a.order - b.order)
            .map((banner) => (
              <BannerCard
                key={banner.id}
                banner={banner}
                lang={defaultLang}
                onEdit={() => navigate(`/banners/${banner.id}/edit`)}
                onDelete={() => setDeleteTarget(banner)}
              />
            ))}
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Bannerni o'chirish"
        description="Bu bannerni o'chirib bo'lmaydi. Davom etasizmi?"
        loading={deleting}
      />
    </div>
  );
}
