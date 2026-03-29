import type { LangMap } from "./category";

export type SectionType = "BANNER" | "PRODUCT_LIST" | "CATEGORY_LIST" | "PROMO_BLOCK";

export type SortBy = "newest" | "oldest" | "price_asc" | "price_desc";

export interface BannerListConfig {
  bannerIds?: string[];
}

export interface ProductListConfig {
  productIds?: string[];
  sortBy?: SortBy;
  limit?: number;
}

export interface CategoryListConfig {
  categoryIds?: string[];
  showAll?: boolean;
  limit?: number;
}

export type SectionConfig =
  | BannerListConfig
  | ProductListConfig
  | CategoryListConfig
  | Record<string, unknown>;

export interface Section {
  id: string;
  type: SectionType;
  title?: LangMap;
  isActive: boolean;
  order: number;
  config: SectionConfig;
}

export interface CreateSectionDto {
  type: SectionType;
  title?: LangMap;
  isActive?: boolean;
  config?: SectionConfig;
}

export interface ReorderItem {
  id: string;
  order: number;
}
