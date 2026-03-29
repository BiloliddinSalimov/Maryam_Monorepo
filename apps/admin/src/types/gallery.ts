export interface GalleryImage {
  id: string;
  url: string;      // "/uploads/filename.ext"
  fullUrl?: string; // only in POST response
  name: string;
  size: number;     // bytes
  type: string;     // "image/jpeg" | "image/png" | etc.
  createdAt: string;
}

export interface GalleryListResponse {
  data: GalleryImage[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
