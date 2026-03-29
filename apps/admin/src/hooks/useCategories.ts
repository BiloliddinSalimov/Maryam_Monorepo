import { useGet, usePost, usePut, useDelete } from "@/hooks/useApi";
import type { Category, CreateCategoryDto } from "@/types/category";

const KEY = ["categories"];

// Flatten nested tree → flat list (root + all children recursively)
function flatten(cats: Category[]): Category[] {
  return cats.flatMap((cat) => [cat, ...flatten(cat.children ?? [])]);
}

export function useCategories() {
  // API may return Category[] directly or { data: Category[] } — handle both
  const { data, isLoading } = useGet<Category[] | { data: Category[] }>(
    "/api/categories/",
    KEY,
  );
  const root: Category[] = Array.isArray(data)
    ? data
    : (data as { data?: Category[] })?.data ?? [];
  return {
    // flat list: root + all sub-categories (for product selects, etc.)
    categories: flatten(root),
    // only root categories with .children[] (for category split-panel)
    rootCategories: root,
    isLoading,
  };
}

export function useCreateCategory() {
  return usePost<Category, CreateCategoryDto>("/admin/categories/", [KEY]);
}

export function useUpdateCategory(id: string) {
  return usePut<Category, Partial<CreateCategoryDto>>(
    `/admin/categories/${id}`,
    [KEY],
  );
}

export function useDeleteCategory() {
  return useDelete<Category>("/admin/categories", [KEY]);
}
