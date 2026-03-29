import { useGet, usePost, usePut, useDelete } from "@/hooks/useApi";
import type { Banner, CreateBannerDto } from "@/types/banner";

const KEY = ["banners"];

export function useBanners() {
  const { data, isLoading } = useGet<{ data: Banner[] }>("/api/banners", KEY);
  return { banners: data?.data ?? [], isLoading };
}

export function useCreateBanner() {
  return usePost<Banner, CreateBannerDto>("/admin/banners", [KEY]);
}

export function useUpdateBanner(id: string) {
  return usePut<Banner, Partial<CreateBannerDto>>(`/admin/banners/${id}`, [KEY]);
}

export function useDeleteBanner() {
  return useDelete<Banner>("/admin/banners", [KEY]);
}
