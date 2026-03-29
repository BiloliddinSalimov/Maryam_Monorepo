import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { NAV } from "@/constants/navbar";
import { cn } from "@/lib/utils";

interface SidebarProps {
  onLogout: () => void;
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <aside
      className={cn(
        "relative flex flex-col bg-[#1A2E44]  h-screen flex-shrink-0 transition-all duration-300 select-none",
        collapsed ? "w-[70px]" : "w-[220px]",
      )}
      style={{ backgroundColor: "#1A2E44" }}
    >
      {/* ── Logo ─────────────────────────────────────────────────── */}
      <div
        className="flex items-center flex-shrink-0 gap-3 px-4 border-b bg-r h-14"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 overflow-hidden rounded-xl bg-white/10">
          <img
            src="/logo.png"
            alt="KidsShop"
            className="object-contain w-7 h-7"
          />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-white leading-tight truncate">
              KidsShop
            </p>
            <p className="text-[10px] font-medium leading-tight text-white/40">
              Admin Panel
            </p>
          </div>
        )}
      </div>

      {/* ── Navigation ───────────────────────────────────────────── */}
      <nav className="flex-1 py-3 px-2.5 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {NAV.map(({ path, label, icon: Icon }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              title={collapsed ? label : undefined}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150",
                active
                  ? "bg-white/[0.12] text-white"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.06]",
              )}
            >
              {/* Orange left accent on active */}
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                  style={{ backgroundColor: "#FFA239" }}
                />
              )}
              <Icon
                size={18}
                className={cn(
                  "flex-shrink-0 transition-colors",
                  active
                    ? "text-white"
                    : "text-white/50 group-hover:text-white/80",
                )}
              />
              {!collapsed && (
                <span className="text-[13px] font-medium truncate">
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Logout ───────────────────────────────────────────────── */}
      <div
        className="px-2.5 pb-4 border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <button
          type="button"
          onClick={onLogout}
          title={collapsed ? "Chiqish" : undefined}
          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl w-full mt-3 transition-colors hover:bg-red-500/10"
        >
          <LogOut
            size={18}
            className="flex-shrink-0 transition-colors text-white/40 group-hover:text-red-400"
          />
          {!collapsed && (
            <span className="text-[13px] font-medium text-white/40 group-hover:text-red-400 transition-colors">
              Chiqish
            </span>
          )}
        </button>
      </div>

      {/* ── Collapse toggle ───────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        className="absolute -right-3 top-[52px] w-6 h-6 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
      >
        {collapsed ? (
          <ChevronRight size={12} className="text-zinc-500" />
        ) : (
          <ChevronLeft size={12} className="text-zinc-500" />
        )}
      </button>
    </aside>
  );
}
