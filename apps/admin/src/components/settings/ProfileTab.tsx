import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  User,
  Mail,
  Phone,
  AtSign,
  Pencil,
  X,
  Check,
  Loader2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/errorMessage";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InfoRow from "@/components/settings/InfoRow";
import EditField from "@/components/settings/EditField";

import {
  useProfile,
  useUpdateProfile,
  type UpdateProfileDto,
} from "@/hooks/useProfile";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(firstName?: string, lastName?: string): string {
  const f = firstName?.[0]?.toUpperCase() ?? "";
  const l = lastName?.[0]?.toUpperCase() ?? "";
  return f + l || "?";
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("uz-UZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const ROLE_META: Record<string, { label: string; color: string; bg: string }> =
  {
    ADMIN:      { label: "Admin",       color: "#1A2E44", bg: "#E8EFF5" },
    SUPERADMIN: { label: "Super Admin", color: "#7C3AED", bg: "#F3EEFF" },
    MANAGER:    { label: "Menejer",     color: "#0891B2", bg: "#E0F7FA" },
  };

// ── Form values ───────────────────────────────────────────────────────────────

interface ProfileFormValues {
  firstName: string;
  lastName:  string;
  username:  string;
  phone:     string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProfileTab() {
  const { profile, isLoading } = useProfile();
  const { mutate: updateProfile, isPending: saving } = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues: { firstName: "", lastName: "", username: "", phone: "" },
  });

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName ?? "",
        lastName:  profile.lastName  ?? "",
        username:  profile.username  ?? "",
        phone:     profile.phone     ?? "",
      });
    }
  }, [profile?.id]);

  const onSubmit = (values: ProfileFormValues) => {
    const dto: UpdateProfileDto = {
      firstName: values.firstName || undefined,
      lastName:  values.lastName  || undefined,
      username:  values.username  || undefined,
      phone:     values.phone     || undefined,
    };
    updateProfile(dto, {
      onSuccess: () => {
        toast.success("Profil yangilandi");
        setIsEditing(false);
      },
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  const handleCancel = () => {
    if (profile) {
      reset({
        firstName: profile.firstName ?? "",
        lastName:  profile.lastName  ?? "",
        username:  profile.username  ?? "",
        phone:     profile.phone     ?? "",
      });
    }
    setIsEditing(false);
  };

  // ── Loading ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden animate-pulse">
        <div className="h-28 bg-zinc-100" />
        <div className="px-5 py-5 space-y-4">
          <div className="space-y-2">
            <div className="w-36 h-5 rounded-lg bg-zinc-100" />
            <div className="w-24 h-4 rounded-lg bg-zinc-100" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-zinc-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const roleMeta =
    ROLE_META[profile.role] ?? { label: profile.role, color: "#1A2E44", bg: "#E8EFF5" };

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">

      {/* ── Banner ────────────────────────────────────────────────────── */}
      <div
        className="relative flex items-end px-5 pb-0 h-28"
        style={{
          background:
            "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 55%, #3d6491 100%)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-2 right-24 w-16 h-16 rounded-full bg-white/5 pointer-events-none" />

        {/* Avatar — sticks out of banner by half its height (h-16 → translate 50% = 32px) */}
        <div
          className="relative z-10 w-16 h-16 rounded-2xl border-[3px] border-white shadow-lg flex items-center justify-center text-white text-[18px] font-bold flex-shrink-0 select-none translate-y-8"
          style={{
            background:
              "linear-gradient(135deg, #0f1f30 0%, #1A2E44 100%)",
          }}
        >
          {getInitials(profile.firstName, profile.lastName)}
        </div>

        {/* Edit button inside banner */}
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="absolute right-4 bottom-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[12px] font-medium transition-all backdrop-blur-sm border border-white/20"
          >
            <Pencil size={11} />
            Tahrirlash
          </button>
        )}
      </div>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="px-5 pt-10 pb-5">

        {/* Name + role row */}
        <div className="mb-5">
          <h2 className="text-[17px] font-bold text-zinc-800 leading-tight">
            {profile.firstName} {profile.lastName}
          </h2>
          <div className="flex items-center gap-2 mt-1.5">
            <span
              className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
              style={{ color: roleMeta.color, backgroundColor: roleMeta.bg }}
            >
              {roleMeta.label}
            </span>
            {profile.createdAt && (
              <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                <Calendar size={10} />
                {formatDate(profile.createdAt)} dan a'zo
              </span>
            )}
          </div>
        </div>

        {/* ── View mode ─────────────────────────────────────────────── */}
        {!isEditing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <InfoRow
              icon={<Mail size={13} />}
              label="Email"
              value={profile.email}
            />
            <InfoRow
              icon={<User size={13} />}
              label="To'liq ism"
              value={`${profile.firstName} ${profile.lastName}`.trim() || "—"}
            />
            <InfoRow
              icon={<AtSign size={13} />}
              label="Username"
              value={profile.username ?? "—"}
            />
            <InfoRow
              icon={<Phone size={13} />}
              label="Telefon"
              value={profile.phone ?? "—"}
            />
          </div>
        ) : (
          /* ── Edit form ─────────────────────────────────────────── */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Email (read-only) */}
            <div>
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1.5">
                Email
              </p>
              <div className="flex items-center gap-2.5 px-3.5 h-10 rounded-xl border border-zinc-100 bg-zinc-50">
                <Mail size={13} className="text-zinc-300 flex-shrink-0" />
                <span className="text-[13px] text-zinc-400 flex-1 truncate">
                  {profile.email}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-200 text-zinc-400 font-medium whitespace-nowrap">
                  O'zgartirib bo'lmaydi
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EditField
                label="Ism"
                icon={<User size={13} className="text-zinc-400" />}
                error={errors.firstName?.message}
              >
                <Input
                  placeholder="Ismingiz"
                  {...register("firstName")}
                  className="pl-9 text-[13px] h-10 rounded-xl border-zinc-200"
                />
              </EditField>

              <EditField
                label="Familiya"
                icon={<User size={13} className="text-zinc-400" />}
                error={errors.lastName?.message}
              >
                <Input
                  placeholder="Familiyangiz"
                  {...register("lastName")}
                  className="pl-9 text-[13px] h-10 rounded-xl border-zinc-200"
                />
              </EditField>

              <EditField
                label="Username"
                icon={<AtSign size={13} className="text-zinc-400" />}
                error={errors.username?.message}
              >
                <Input
                  placeholder="username"
                  {...register("username")}
                  className="pl-9 text-[13px] h-10 rounded-xl border-zinc-200"
                />
              </EditField>

              <EditField
                label="Telefon"
                icon={<Phone size={13} className="text-zinc-400" />}
                error={errors.phone?.message}
              >
                <Input
                  placeholder="+998 90 000 00 00"
                  {...register("phone")}
                  className="pl-9 text-[13px] h-10 rounded-xl border-zinc-200"
                />
              </EditField>
            </div>

            <div className="flex gap-2.5 pt-1">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-9 gap-1.5 text-[13px]"
                onClick={handleCancel}
                disabled={saving}
              >
                <X size={13} />
                Bekor
              </Button>
              <Button
                type="submit"
                className="flex-1 h-9 gap-1.5 text-[13px]"
                style={{ backgroundColor: "#1A2E44" }}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Check size={13} />
                )}
                {saving ? "Saqlanmoqda..." : "Saqlash"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
