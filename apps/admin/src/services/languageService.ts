import { instance } from "@/lib/api";
import type { Language, CreateLanguageDto, UpdateLanguageDto } from "@/types/language";

export const languageService = {
  getAll: async (): Promise<Language[]> => {
    const { data } = await instance.get<{ data: Language[] }>("/admin/languages/");
    return data.data;
  },

  create: async (dto: CreateLanguageDto): Promise<Language> => {
    const { data } = await instance.post<Language>("/admin/languages/", dto);
    return data;
  },

  update: async (id: string, dto: UpdateLanguageDto): Promise<Language> => {
    const { data } = await instance.put<Language>(`/admin/languages/${id}`, dto);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await instance.delete(`/admin/languages/${id}`);
  },
};
