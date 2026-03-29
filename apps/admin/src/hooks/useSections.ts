import { useGet, usePost, usePut, useDelete, usePatch } from "@/hooks/useApi";
import type { Section, CreateSectionDto, ReorderItem } from "@/types/section";

const KEY = ["sections"];

export function useSections() {
  const { data, isLoading } = useGet<{ data: Section[] }>(
    "/admin/homepage/sections",
    KEY,
  );
  return {
    sections: [...(data?.data ?? [])].sort((a, b) => a.order - b.order),
    isLoading,
  };
}

export function useCreateSection() {
  return usePost<Section, CreateSectionDto>("/admin/homepage/sections", [KEY]);
}

export function useUpdateSection(id: string) {
  return usePut<Section, Partial<CreateSectionDto>>(
    `/admin/homepage/sections/${id}`,
    [KEY],
  );
}

export function useToggleSection(id: string) {
  return usePatch<Section, undefined>(
    `/admin/homepage/sections/${id}/toggle`,
    [KEY],
  );
}

export function useReorderSections() {
  return usePut<Section[], { sections: ReorderItem[] }>(
    "/admin/homepage/sections/reorder",
    [KEY],
  );
}

export function useDeleteSection() {
  return useDelete<Section>("/admin/homepage/sections", [KEY]);
}
