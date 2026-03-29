import { instance } from "@/lib/api";

export const uploadService = {
  single: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await instance.post<{ url: string } | string>(
      "/admin/upload/",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return typeof data === "string" ? data : data.url;
  },

  multiple: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const { data } = await instance.post<string[] | { urls: string[] }>(
      "/admin/upload/multiple",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return Array.isArray(data) ? data : (data as { urls: string[] }).urls ?? [];
  },
};
