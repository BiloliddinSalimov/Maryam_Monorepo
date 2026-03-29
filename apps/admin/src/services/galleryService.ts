import { instance } from "@/lib/api";
import type { GalleryImage, GalleryListResponse } from "@/types/gallery";

export const galleryService = {
  getAll: async (page = 1, limit = 20): Promise<GalleryListResponse> => {
    const { data } = await instance.get<GalleryListResponse>("/admin/gallery", {
      params: { page, limit },
    });
    return data;
  },

  upload: async (file: File): Promise<GalleryImage> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await instance.post<GalleryImage>("/admin/gallery", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await instance.delete(`/admin/gallery/${id}`);
  },
};
