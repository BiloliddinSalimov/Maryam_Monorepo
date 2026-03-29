import { useGet, usePost, usePut, useDelete } from "@/hooks/useApi";
import type { Language, CreateLanguageDto, UpdateLanguageDto } from "@/types/language";

const QUERY_KEY = ["languages"];

export function useLanguages() {
  const { data, isLoading } = useGet<{ data: Language[] }>(
    "/admin/languages",
    QUERY_KEY,
  );
  return { languages: data?.data ?? [], isLoading };
}

export function useCreateLanguage() {
  return usePost<Language, CreateLanguageDto>("/admin/languages", [QUERY_KEY]);
}

export function useUpdateLanguage(id: string) {
  return usePut<Language, UpdateLanguageDto>(
    `/admin/languages/${id}`,
    [QUERY_KEY],
  );
}

export function useDeleteLanguage() {
  return useDelete<Language>("/admin/languages", [QUERY_KEY]);
}
