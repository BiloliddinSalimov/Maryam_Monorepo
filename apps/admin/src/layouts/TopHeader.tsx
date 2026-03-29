import { useLocation, useNavigate } from "react-router-dom";
import { Search, ChevronRight, Bell, HelpCircle } from "lucide-react";
import { NAV } from "@/constants/navbar";
import { cn } from "@/lib/utils";

// ─── Route metadata ─────────────────────────────────────────────────────────

interface RouteInfo {
  title: string;
  breadcrumb?: { label: string; path: string }[];
}

function useRouteInfo(): RouteInfo {
  const location = useLocation();
  const pathname = location.pathname;

  // Create / Edit routes → show breadcrumb
  if (pathname === "/products/create") {
    return {
      title: "Yangi mahsulot",
      breadcrumb: [
        { label: "Mahsulotlar", path: "/products" },
        { label: "Yangi mahsulot", path: "" },
      ],
    };
  }
  if (/^\/products\/[^\/]+\/edit$/.test(pathname)) {
    return {
      title: "Mahsulotni tahrirlash",
      breadcrumb: [
        { label: "Mahsulotlar", path: "/products" },
        { label: "Tahrirlash", path: "" },
      ],
    };
  }
  if (pathname === "/banners/create") {
    return {
      title: "Yangi banner",
      breadcrumb: [
        { label: "Bannerlar", path: "/banners" },
        { label: "Yangi banner", path: "" },
      ],
    };
  }
  if (/^\/banners\/[^\/]+\/edit$/.test(pathname)) {
    return {
      title: "Bannerni tahrirlash",
      breadcrumb: [
        { label: "Bannerlar", path: "/banners" },
        { label: "Tahrirlash", path: "" },
      ],
    };
  }
  if (pathname === "/homepage/create") {
    return {
      title: "Yangi bo'lim",
      breadcrumb: [
        { label: "Bosh sahifa", path: "/homepage" },
        { label: "Yangi bo'lim", path: "" },
      ],
    };
  }
  if (/^\/homepage\/[^\/]+\/edit$/.test(pathname)) {
    return {
      title: "Bo'limni tahrirlash",
      breadcrumb: [
        { label: "Bosh sahifa", path: "/homepage" },
        { label: "Tahrirlash", path: "" },
      ],
    };
  }
  if (pathname === "/categories/create") {
    return {
      title: "Yangi kategoriya",
      breadcrumb: [
        { label: "Kategoriyalar", path: "/categories" },
        { label: "Yangi kategoriya", path: "" },
      ],
    };
  }
  if (/^\/categories\/[^\/]+\/edit$/.test(pathname)) {
    return {
      title: "Kategoriyani tahrirlash",
      breadcrumb: [
        { label: "Kategoriyalar", path: "/categories" },
        { label: "Tahrirlash", path: "" },
      ],
    };
  }

  // Check against NAV paths
  const navItem = NAV.find((n) =>
    n.path === "/"
      ? pathname === "/"
      : pathname === n.path || pathname.startsWith(n.path + "/"),
  );

  return { title: navItem?.label ?? "Admin Panel" };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function TopHeader() {
  const navigate = useNavigate();
  const { title, breadcrumb } = useRouteInfo();

  return (
    <header
      className="z-20 flex items-center flex-shrink-0 gap-4 px-6 bg-white border-b h-14"
      style={{ borderColor: "#F0F2F5" }}
    >
      {/* ── Left: Title or Breadcrumb ─────────────────────────── */}
      <div className="flex items-center gap-1.5 min-w-0 flex-shrink-0">
        {breadcrumb ? (
          // Breadcrumb (only on create/edit pages)
          <nav className="flex items-center gap-1.5 text-sm">
            {breadcrumb.map((crumb, idx) => {
              const isLast = idx === breadcrumb.length - 1;
              return (
                <div key={idx} className="flex items-center gap-1.5">
                  {idx > 0 && (
                    <ChevronRight
                      size={13}
                      className="flex-shrink-0 text-zinc-300"
                    />
                  )}
                  {isLast ? (
                    <span
                      className="font-semibold text-[13px]"
                      style={{ color: "#1A2E44" }}
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => crumb.path && navigate(crumb.path)}
                      className="text-[13px] text-zinc-400 hover:text-zinc-600 transition-colors font-medium"
                    >
                      {crumb.label}
                    </button>
                  )}
                </div>
              );
            })}
          </nav>
        ) : (
          <h1
            className="text-[15px] font-bold truncate"
            style={{ color: "#1A2E44" }}
          >
            {title}
          </h1>
        )}
      </div>

      <div className="flex-shrink-0 w-px h-5 bg-zinc-200" />

      <div className="relative flex-1 max-w-sm">
        <Search
          size={14}
          className="absolute -translate-y-1/2 left-3 top-1/2 text-zinc-400"
        />
        <input
          type="text"
          placeholder="Qidirish..."
          className={cn(
            "w-full h-8 pl-8 pr-3 text-sm bg-zinc-50 border border-zinc-200 rounded-lg",
            "placeholder:text-zinc-400 text-zinc-700",
            "focus:outline-none focus:ring-2 focus:ring-[#1A2E44]/10 focus:border-zinc-300",
            "transition-all",
          )}
        />
      </div>

      <div className="flex items-center gap-1 ml-auto">
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 transition-colors rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
          title="Yordam"
        >
          <HelpCircle size={17} />
        </button>
        <button
          type="button"
          className="relative flex items-center justify-center w-8 h-8 transition-colors rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100"
          title="Bildirishnomalar"
        >
          <Bell size={17} />
        </button>
      </div>
    </header>
  );
}
