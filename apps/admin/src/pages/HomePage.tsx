import { useNavigate } from "react-router-dom";
import {
  Package, Tag, ShoppingCart, Image,
  ArrowRight, Plus, AlertCircle, TrendingDown,
  LayoutTemplate, ChevronRight, BarChart3,
} from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useBanners } from "@/hooks/useBanners";
import { useLanguages } from "@/hooks/useLanguages";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
  return n.toLocaleString("uz-UZ") + " so'm";
}

function getHour() {
  return new Date().getHours();
}

function getGreeting() {
  const h = getHour();
  if (h < 6)  return "Xayrli tun";
  if (h < 12) return "Xayrli tong";
  if (h < 17) return "Xayrli kun";
  if (h < 21) return "Xayrli kech";
  return "Xayrli tun";
}

// ── Stat Card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  onClick?: () => void;
}

function StatCard({ label, value, sub, icon: Icon, color, bg, onClick }: StatCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-zinc-100 p-5 text-left hover:shadow-md hover:border-zinc-200 transition-all overflow-hidden"
    >
      {/* BG accent shape */}
      <div
        className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-10 pointer-events-none"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: bg }}
        >
          <Icon size={19} style={{ color }} />
        </div>
        {onClick && (
          <ChevronRight
            size={15}
            className="text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all"
          />
        )}
      </div>
      <p className="text-[26px] font-bold leading-none" style={{ color: "#1A2E44" }}>
        {value}
      </p>
      <p className="text-[12px] text-zinc-400 mt-1.5 font-medium">{label}</p>
      {sub && (
        <p className="text-[11px] mt-1 font-medium" style={{ color }}>
          {sub}
        </p>
      )}
    </button>
  );
}

// ── Quick link ────────────────────────────────────────────────────────────────

function QuickLink({
  label,
  hint,
  icon: Icon,
  color,
  bg,
  onClick,
}: {
  label: string;
  hint: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-zinc-50 transition-colors text-left"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: bg }}
      >
        <Icon size={16} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-zinc-700">{label}</p>
        <p className="text-[11px] text-zinc-400 mt-0.5">{hint}</p>
      </div>
      <ArrowRight
        size={14}
        className="text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all flex-shrink-0"
      />
    </button>
  );
}

// ── Product row ───────────────────────────────────────────────────────────────

function ProductRow({
  name,
  category,
  price,
  stock,
  thumb,
  onEdit,
}: {
  name: string;
  category: string;
  price: number;
  stock: number;
  thumb: string | null;
  onEdit: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-zinc-50 transition-colors text-left group"
    >
      <div className="w-9 h-9 rounded-lg bg-zinc-100 overflow-hidden flex-shrink-0 border border-zinc-100">
        {thumb ? (
          <img src={thumb} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package size={14} className="text-zinc-300" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-zinc-700 truncate">{name}</p>
        <p className="text-[11px] text-zinc-400 truncate">{category}</p>
      </div>
      <div className="flex-shrink-0 text-right">
        <p className="text-[12px] font-semibold text-zinc-700">
          {price.toLocaleString()}
        </p>
        <p
          className={`text-[11px] font-medium ${
            stock === 0 ? "text-red-400" : stock < 5 ? "text-amber-500" : "text-emerald-500"
          }`}
        >
          {stock === 0 ? "Tugagan" : `${stock} dona`}
        </p>
      </div>
    </button>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const navigate = useNavigate();
  const { products, isLoading: loadingProducts } = useProducts();
  const { categories } = useCategories();
  const { banners } = useBanners();
  const { languages } = useLanguages();

  const outOfStock   = products.filter((p) => p.stock === 0).length;
  const lowStock     = products.filter((p) => p.stock > 0 && p.stock < 5).length;
  const activeLangs  = languages.filter((l) => l.isActive).length;
  const activeBanners = banners.filter((b) => b.isActive).length;

  const getCategoryName = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return "";
    return typeof cat.name === "string" ? cat.name : (Object.values(cat.name)[0] ?? "");
  };

  const recentProducts = [...products].slice(-6).reverse();

  return (
    <div className="max-w-6xl mx-auto px-6 pt-6 pb-10 space-y-6">

      {/* ── Hero greeting ─────────────────────────────────────────────── */}
      <div
        className="relative rounded-2xl overflow-hidden px-7 py-6"
        style={{ background: "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 55%, #3d6491 100%)" }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 right-32 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-4 right-16 w-12 h-12 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-white/60 text-[13px] font-medium">
              {getGreeting()} 👋
            </p>
            <h1 className="text-white text-[22px] font-bold mt-0.5">
              KidsShop Admin
            </h1>
            <p className="text-white/50 text-[12px] mt-1">
              {new Date().toLocaleDateString("uz-UZ", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>

          {/* Quick add button */}
          <button
            type="button"
            onClick={() => navigate("/products/create")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[13px] font-semibold transition-all backdrop-blur-sm border border-white/20"
          >
            <Plus size={15} />
            Mahsulot qo'shish
          </button>
        </div>

        {/* Mini stats inside hero */}
        <div className="relative flex items-center gap-6 mt-5 pt-5 border-t border-white/10">
          <div>
            <p className="text-white text-[20px] font-bold leading-none">
              {loadingProducts ? "..." : products.length}
            </p>
            <p className="text-white/50 text-[11px] mt-0.5">mahsulot</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <p className="text-white text-[20px] font-bold leading-none">
              {categories.length}
            </p>
            <p className="text-white/50 text-[11px] mt-0.5">kategoriya</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <p className="text-white text-[20px] font-bold leading-none">
              {activeBanners}
            </p>
            <p className="text-white/50 text-[11px] mt-0.5">faol banner</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <p className="text-white text-[20px] font-bold leading-none">
              {activeLangs}
            </p>
            <p className="text-white/50 text-[11px] mt-0.5">faol til</p>
          </div>
        </div>
      </div>

      {/* ── Alert banners ─────────────────────────────────────────────── */}
      {(outOfStock > 0 || lowStock > 0) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {outOfStock > 0 && (
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-left hover:bg-red-100/60 transition-colors group"
            >
              <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
              <p className="flex-1 text-[13px] text-red-600">
                <span className="font-semibold">{outOfStock} ta mahsulot</span> omborda tugagan
              </p>
              <ArrowRight size={13} className="text-red-300 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
          {lowStock > 0 && (
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100 text-left hover:bg-amber-100/60 transition-colors group"
            >
              <TrendingDown size={15} className="text-amber-400 flex-shrink-0" />
              <p className="flex-1 text-[13px] text-amber-700">
                <span className="font-semibold">{lowStock} ta mahsulot</span> kam qoldi
              </p>
              <ArrowRight size={13} className="text-amber-300 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      )}

      {/* ── Stats grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Jami mahsulotlar"
          value={loadingProducts ? "..." : products.length}
          sub={outOfStock > 0 ? `${outOfStock} ta tugagan` : undefined}
          icon={Package}
          color="#1A2E44"
          bg="#E8EFF5"
          onClick={() => navigate("/products")}
        />
        <StatCard
          label="Kategoriyalar"
          value={categories.length}
          icon={Tag}
          color="#0EA5E9"
          bg="#E0F2FE"
          onClick={() => navigate("/categories")}
        />
        <StatCard
          label="Faol bannerlar"
          value={activeBanners}
          sub={banners.length > 0 ? `${banners.length} ta jami` : undefined}
          icon={Image}
          color="#8B5CF6"
          bg="#F3EEFF"
          onClick={() => navigate("/banners")}
        />
        <StatCard
          label="Buyurtmalar"
          value="—"
          icon={ShoppingCart}
          color="#F59E0B"
          bg="#FEF3C7"
          onClick={() => navigate("/orders")}
        />
      </div>

      {/* ── Two column layout ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ── Recent products (2/3) ─────────────────────────────────── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E8EFF5] flex items-center justify-center">
                <BarChart3 size={14} className="text-[#1A2E44]" />
              </div>
              <h2 className="text-[14px] font-semibold text-zinc-800">
                So'nggi mahsulotlar
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate("/products")}
              className="flex items-center gap-1 text-[12px] text-zinc-400 hover:text-zinc-700 font-medium transition-colors"
            >
              Barchasi <ArrowRight size={12} />
            </button>
          </div>

          <div>
            {loadingProducts ? (
              <div className="p-4 space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 rounded-xl bg-zinc-100 animate-pulse" />
                ))}
              </div>
            ) : recentProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center gap-3">
                <Package size={36} className="text-zinc-200" />
                <div>
                  <p className="text-[14px] font-medium text-zinc-500">
                    Hali mahsulot yo'q
                  </p>
                  <p className="text-[12px] text-zinc-400 mt-0.5">
                    Birinchi mahsulotni qo'shing
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/products/create")}
                  className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1A2E44] hover:underline"
                >
                  <Plus size={13} />
                  Mahsulot qo'shish
                </button>
              </div>
            ) : (
              <>
                {recentProducts.map((p) => {
                  const rawThumb = p.images?.[0];
                  const thumb = typeof rawThumb === "string"
                    ? rawThumb
                    : rawThumb?.fullUrl ?? rawThumb?.url ?? null;
                  return (
                    <ProductRow
                      key={p.id}
                      name={Object.values(p.name)[0] ?? "—"}
                      category={getCategoryName(
                        p.categories?.[0]?.id ?? p.categoryId ?? p.category?.id ?? "",
                      )}
                      price={p.price}
                      stock={p.stock}
                      thumb={thumb}
                      onEdit={() => navigate(`/products/${p.id}/edit`)}
                    />
                  );
                })}
                <div className="px-4 py-3 border-t border-zinc-50">
                  <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="w-full text-center text-[12px] text-zinc-400 hover:text-zinc-700 font-medium transition-colors"
                  >
                    Barcha mahsulotlarni ko'rish →
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Right column (1/3) ───────────────────────────────────── */}
        <div className="space-y-4">

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-100">
              <h2 className="text-[14px] font-semibold text-zinc-800">
                Tezkor havolalar
              </h2>
            </div>
            <div className="py-1.5">
              <QuickLink
                label="Mahsulot qo'shish"
                hint="Yangi mahsulot yaratish"
                icon={Package}
                color="#1A2E44"
                bg="#E8EFF5"
                onClick={() => navigate("/products/create")}
              />
              <QuickLink
                label="Kategoriya qo'shish"
                hint="Yangi kategoriya yaratish"
                icon={Tag}
                color="#0EA5E9"
                bg="#E0F2FE"
                onClick={() => navigate("/categories/create")}
              />
              <QuickLink
                label="Banner qo'shish"
                hint="Yangi banner yaratish"
                icon={Image}
                color="#8B5CF6"
                bg="#F3EEFF"
                onClick={() => navigate("/banners/create")}
              />
              <QuickLink
                label="Homepage bo'limi"
                hint="Yangi section qo'shish"
                icon={LayoutTemplate}
                color="#10B981"
                bg="#D1FAE5"
                onClick={() => navigate("/homepage/create")}
              />
            </div>
          </div>

          {/* Inventory summary */}
          <div
            className="rounded-2xl p-5 text-white relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 100%)" }}
          >
            <div className="absolute -bottom-6 -right-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
            <p className="text-[13px] font-semibold text-white/70 mb-4">
              Ombor holati
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-white/60">Mavjud</span>
                <span className="text-[14px] font-bold">
                  {products.filter((p) => p.stock > 4).length} ta
                </span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all"
                  style={{
                    width: products.length
                      ? `${(products.filter((p) => p.stock > 4).length / products.length) * 100}%`
                      : "0%",
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[12px] text-white/60">Kam qolgan</span>
                <span className="text-[14px] font-bold text-amber-300">{lowStock} ta</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{
                    width: products.length
                      ? `${(lowStock / products.length) * 100}%`
                      : "0%",
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[12px] text-white/60">Tugagan</span>
                <span className="text-[14px] font-bold text-red-300">{outOfStock} ta</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-400 rounded-full transition-all"
                  style={{
                    width: products.length
                      ? `${(outOfStock / products.length) * 100}%`
                      : "0%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
