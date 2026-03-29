import { instance } from "@/lib/api";
import type { Product, CreateProductDto } from "@/types/product";

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await instance.get<{ data: Product[] }>("/admin/products/");
    return data.data;
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await instance.get<Product>(`/admin/products/${id}`);
    return data;
  },

  create: async (dto: CreateProductDto): Promise<Product> => {
    const { data } = await instance.post<Product>("/admin/products/", dto);
    return data;
  },

  update: async (id: string, dto: Partial<CreateProductDto>): Promise<Product> => {
    const { data } = await instance.put<Product>(`/admin/products/${id}`, dto);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await instance.delete(`/admin/products/${id}`);
  },
};
