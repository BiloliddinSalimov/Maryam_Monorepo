import { instance } from "@/lib/api";
import type { Category, CreateCategoryDto } from "@/types/category";

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const { data } = await instance.get<{ data: Category[] }>("/admin/categories/");
    return data.data;
  },

  getPublic: async (): Promise<Category[]> => {
    const { data } = await instance.get<{ data: Category[] }>("/api/categories/");
    return data.data;
  },

  create: async (dto: CreateCategoryDto): Promise<Category> => {
    const { data } = await instance.post<Category>("/admin/categories/", dto);
    return data;
  },

  update: async (id: string, dto: Partial<CreateCategoryDto>): Promise<Category> => {
    const { data } = await instance.put<Category>(`/admin/categories/${id}`, dto);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await instance.delete(`/admin/categories/${id}`);
  },
};
