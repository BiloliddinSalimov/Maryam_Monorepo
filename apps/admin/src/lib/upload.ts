import { instance } from "./api";

export async function uploadImages(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const { data } = await instance.post<string[] | { urls: string[] }>(
    "/admin/upload/multiple",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return Array.isArray(data) ? data : (data as any).urls ?? [];
}
