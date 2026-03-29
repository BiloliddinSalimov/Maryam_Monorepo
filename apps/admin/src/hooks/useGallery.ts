import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { galleryService } from "@/services/galleryService";

const KEY = ["gallery"];

export function useGallery(page = 1, limit = 20) {
  const query = useQuery({
    queryKey: [...KEY, page, limit],
    queryFn: () => galleryService.getAll(page, limit),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  return {
    images: query.data?.data ?? [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}

export function useUploadToGallery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => galleryService.upload(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY, refetchType: "all" });
    },
  });
}

export function useDeleteFromGallery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => galleryService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY, refetchType: "all" });
    },
  });
}
