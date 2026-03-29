import { Mail, KeyRound, Shield } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

const ROLE_META: Record<string, { label: string; color: string; bg: string }> =
  {
    ADMIN:      { label: "Admin",       color: "#1A2E44", bg: "#E8EFF5" },
    SUPERADMIN: { label: "Super Admin", color: "#7C3AED", bg: "#F3EEFF" },
    MANAGER:    { label: "Menejer",     color: "#0891B2", bg: "#E0F7FA" },
  };

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function SecurityTab() {
  const { profile } = useProfile();

  return (
    <div className="space-y-3">

      {/* Email */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #0891b2 0%, #22d3ee 100%)" }}
          >
            <Mail size={15} color="white" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-zinc-800">Email manzil</p>
            <p className="text-[11px] text-zinc-400">Hisobingizga kirish uchun ishlatiladi</p>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100">
          <span className="text-[13px] font-medium text-zinc-700">
            {profile?.email ?? "—"}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-semibold">
            Tasdiqlangan
          </span>
        </div>
      </div>

      {/* Password */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)" }}
          >
            <KeyRound size={15} color="white" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-zinc-800">Parol</p>
            <p className="text-[11px] text-zinc-400">
              Hisobingiz xavfsizligi uchun kuchli parol ishlating
            </p>
          </div>
        </div>
        <div className="px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-100">
          <span className="text-[16px] tracking-widest text-zinc-300 select-none">
            ••••••••••
          </span>
        </div>
      </div>

      {/* Account details */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 100%)" }}
          >
            <Shield size={15} color="white" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-zinc-800">Hisob tafsilotlari</p>
            <p className="text-[11px] text-zinc-400">Ro'yxatdan o'tish va ruxsatlar</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-[12px] text-zinc-400 font-medium">ID</span>
            <span className="text-[12px] font-mono text-zinc-500 truncate max-w-[220px]">
              {profile?.id ?? "—"}
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-[12px] text-zinc-400 font-medium">Rol</span>
            {profile?.role && (() => {
              const meta = ROLE_META[profile.role] ?? { label: profile.role, color: "#1A2E44", bg: "#E8EFF5" };
              return (
                <span
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ color: meta.color, backgroundColor: meta.bg }}
                >
                  {meta.label}
                </span>
              );
            })()}
          </div>
          <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-100">
            <span className="text-[12px] text-zinc-400 font-medium">Ro'yxatdan o'tgan</span>
            <span className="text-[12px] text-zinc-600 font-medium">
              {profile?.createdAt ? formatDate(profile.createdAt) : "—"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
