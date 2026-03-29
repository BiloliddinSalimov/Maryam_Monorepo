import { useState } from "react";
import { Image as ImageIcon, Search, ImageOff, Link2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { useBanners } from "@/hooks/useBanners";
import { useLanguages } from "@/hooks/useLanguages";

/**
 * Config form for BANNER section type.
 * auto  → config: {}                    (backend shows all active banners)
 * manual → config: { bannerIds: [...] } (specific banners)
 * Reads/writes: bannerMode, bannerIds from form context.
 */
export default function BannerListConfig() {
  const { watch, setValue } = useFormContext();
  const { banners } = useBanners();
  const { languages } = useLanguages();
  const [search, setSearch] = useState("");

  const bannerMode: "auto" | "manual" = watch("bannerMode") ?? "auto";
  const bannerIds: string[] = watch("bannerIds") ?? [];

  const defaultLang =
    languages.find((l) => l.isDefault)?.code ??
    languages.find((l) => l.isActive)?.code ??
    "uz";

  const sorted = [...banners].sort((a, b) => a.order - b.order);

  const filtered = sorted.filter((b) => {
    if (!search) return true;
    const title = b.title[defaultLang] ?? Object.values(b.title)[0] ?? "";
    return title.toLowerCase().includes(search.toLowerCase());
  });

  const toggleBanner = (id: string) => {
    setValue(
      "bannerIds",
      bannerIds.includes(id)
        ? bannerIds.filter((x) => x !== id)
        : [...bannerIds, id],
    );
  };

  return (
    <div className="space-y-4">
      {/* Mode switcher */}
      <div className="flex rounded-xl border border-zinc-200 overflow-hidden">
        {(["auto", "manual"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => setValue("bannerMode", mode)}
            className={`flex-1 py-2.5 text-[13px] font-semibold transition-colors ${
              bannerMode === mode
                ? "bg-[#1A2E44] text-white"
                : "bg-white text-zinc-500 hover:bg-zinc-50"
            }`}
          >
            {mode === "auto" ? "Avtomatik (barcha faol)" : "Qo'lda tanlash"}
          </button>
        ))}
      </div>

      {bannerMode === "auto" ? (
        /* Auto mode hint */
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-sky-50 border border-sky-100">
          <ImageIcon size={15} className="text-sky-500 flex-shrink-0" />
          <p className="text-[13px] text-sky-700 leading-relaxed">
            Barcha <strong>faol</strong> bannerlar avtomatik ko'rsatiladi.
            Tartib va ko'rinishni{" "}
            <span className="font-semibold">Bannerlar</span> sahifasidan boshqaring.
          </p>
        </div>
      ) : (
        /* Manual mode: banner picker */
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-zinc-600">
              Bannerlarni tanlash
            </label>
            {bannerIds.length > 0 && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#1A2E44] text-white">
                {bannerIds.length} ta
              </span>
            )}
          </div>

          {/* Search */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <Input
              placeholder="Banner qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-[13px]"
            />
          </div>

          {/* List */}
          <div className="max-h-60 overflow-y-auto rounded-xl border border-zinc-100 divide-y divide-zinc-50 bg-white">
            {banners.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                <ImageOff size={22} className="text-zinc-300" />
                <p className="text-[12px] text-zinc-400">
                  Hali banner qo'shilmagan.{" "}
                  <span className="text-[#1A2E44] font-medium">
                    Bannerlar
                  </span>{" "}
                  sahifasidan qo'shing.
                </p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-5 text-center text-xs text-zinc-400">
                Banner topilmadi
              </div>
            ) : (
              filtered.map((banner) => {
                const isSelected = bannerIds.includes(banner.id);
                const title =
                  banner.title[defaultLang] ??
                  Object.values(banner.title)[0] ??
                  "—";

                return (
                  <button
                    key={banner.id}
                    type="button"
                    onClick={() => toggleBanner(banner.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      isSelected ? "bg-[#1A2E44]/5" : "hover:bg-zinc-50"
                    } ${!banner.isActive ? "opacity-50" : ""}`}
                  >
                    {/* Checkbox */}
                    <div
                      className={`w-4 h-4 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-[#1A2E44] border-[#1A2E44]"
                          : "border-zinc-300"
                      }`}
                    >
                      {isSelected && (
                        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                          <path
                            d="M1 3.5L3.5 6L8 1"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Banner thumbnail */}
                    <div
                      className="overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50 flex-shrink-0"
                      style={{ width: 72, height: 22 }}
                    >
                      {banner.image ? (
                        <img
                          src={banner.image}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageOff size={10} className="text-zinc-300" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-medium text-zinc-800 truncate">
                        {title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {banner.link ? (
                          <div className="flex items-center gap-1">
                            <Link2 size={9} className="text-zinc-400" />
                            <span className="text-[10px] text-zinc-400 truncate max-w-[120px]">
                              {banner.link}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-zinc-300">
                            Havola yo'q
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Order + status badges */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-[10px] text-zinc-400 font-medium">
                        #{banner.order}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                          banner.isActive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-zinc-100 text-zinc-400"
                        }`}
                      >
                        {banner.isActive ? "Faol" : "Yashirin"}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
