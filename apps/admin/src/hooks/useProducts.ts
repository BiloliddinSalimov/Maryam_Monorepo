import { useGet, usePost, usePut, useDelete } from "@/hooks/useApi";
import type { Product, CreateProductDto } from "@/types/product";

const KEY = ["products"];

export function useProducts() {
  const { data, isLoading } = useGet<{ data: Product[] }>("api/products/", KEY);
  return { products: data?.data ?? [], isLoading };
}

// Fetch a single product by ID — used in edit form so it always works,
// even when the user navigates directly to /products/:id/edit
export function useProduct(id: string | undefined) {
  const { data, isLoading } = useGet<{ data: Product }>(
    `api/products/${id}`,
    ["products", id!],
    { enabled: !!id },
  );
  return { product: data?.data ?? null, isLoading };
}

// Fetch products filtered by categoryId — calls GET /api/products?categoryId=UUID
export function useProductsByCategory(categoryId: string | null) {
  const { data, isLoading } = useGet<{ data: Product[] }>(
    `api/products/?categoryId=${categoryId}`,
    ["products", "byCategory", categoryId],
    { enabled: !!categoryId },
  );
  return { products: data?.data ?? [], isLoading };
}

export function useCreateProduct() {
  return usePost<Product, CreateProductDto>("/admin/products/", [KEY]);
}

export function useUpdateProduct(id: string) {
  return usePut<Product, Partial<CreateProductDto>>(`/admin/products/${id}`, [
    KEY,
  ]);
}

export function useDeleteProduct() {
  return useDelete<Product>("/admin/products", [KEY]);
}
