import { useGet, usePut } from "@/hooks/useApi";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string | null;
  phone: string | null;
  role: string;
  telegramId: string | null;
  createdAt: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
}

const KEY = ["profile", "me"];

export function useProfile() {
  const { data, isLoading } = useGet<{ user: UserProfile }>(
    "/api/user/me",
    KEY,
  );
  return { profile: data?.user ?? null, isLoading };
}

export function useUpdateProfile() {
  return usePut<{ user: UserProfile }, UpdateProfileDto>("/api/user/me", [KEY]);
}
