import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Baby, Lock, Mail, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { usePost } from "@/hooks/useApi";
import { useAuthStore } from "@/store/authStore";

// ─── Schema ─────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.email("To'g'ri email kiriting"),
  password: z.string().min(6, "Parol kamida 6 ta belgi"),
});
type LoginForm = z.infer<typeof loginSchema>;

// ─── Types ───────────────────────────────────────────────────────────────────

interface LoginResponse {
  token: string;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="px-3 py-2.5 rounded-xl text-sm text-red-700 bg-red-50 border border-red-100">
      {message}
    </div>
  );
}

function FormField({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  icon: React.ElementType;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label style={{ color: "#1A2E44" }}>{label}</Label>
      <div className="relative">
        <Icon size={15} className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
        {children}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);

  const { mutate: login, isPending, error } = usePost<LoginResponse, LoginForm>(
    "/admin/auth/login",
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginForm) => {
    login(data, {
      onSuccess: ({ token }) => {
        setToken(token);
        navigate("/dashboard", { replace: true });
      },
    });
  };

  const errorMessage =
    error instanceof Error
      ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ??
        "Email yoki parol noto'g'ri"
      : null;

  return (
    <div
      className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #1A2E44 0%, #1e3a5f 100%)" }}
    >
      <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full opacity-[0.07] bg-main" />
      <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full opacity-[0.07] bg-secondry" />

      <div className="relative w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 shadow-lg rounded-2xl bg-secondry">
            <Baby size={30} color="white" />
          </div>
          <h1 className="text-2xl font-bold text-white">KidsShop Admin</h1>
          <p className="mt-1 text-sm text-sky-300">Boshqaruv paneliga xush kelibsiz</p>
        </div>

        {/* Card */}
        <Card className="border-0 shadow-2xl rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle style={{ color: "#1A2E44" }}>Kirish</CardTitle>
            <CardDescription>Akkauntingizga kiring</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {errorMessage && <ErrorAlert message={errorMessage} />}

              <FormField label="Email" icon={Mail} error={errors.email?.message}>
                <Input
                  type="email"
                  placeholder="admin@kidsshop.uz"
                  className="pl-9"
                  {...register("email")}
                />
              </FormField>

              <FormField label="Parol" icon={Lock} error={errors.password?.message}>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  {...register("password")}
                />
              </FormField>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full font-semibold text-white h-11 rounded-xl"
                style={{ backgroundColor: "#1A2E44" }}
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Tekshirilmoqda...
                  </>
                ) : (
                  "Kirish"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
