import type { Image } from "./images";

export type LangMap = Record<string, string>;

/** Category shape returned inside a product from /api/products/:id */
export interface ProductCategory {
  id: string;
  name: LangMap | string;
  slug: string;
}

/** Image shape returned inside a product from /api/products/:id */
export interface ProductImageApi {
  id: string;
  url: string;
  fullUrl?: string;   // may be present if the backend returns absolute URL
  isMain: boolean;
  productId?: string;
  createdAt?: string;
}

export interface Product {
  id: string;
  name: LangMap;
  slug: string;
  description: LangMap;
  price: number;
  stock: number;
  // ── Category: API returns one of these shapes ─────────────────────────────
  categoryId?: string;                      // some list endpoints return flat id
  category?:  { id: string; name: LangMap | string }; // some endpoints nest it
  categories?: ProductCategory[];           // /api/products/:id returns array
  // ─────────────────────────────────────────────────────────────────────────
  images: ProductImageApi[] | Image[] | string[];
  discount?: Discount | null;
}

export interface Discount {
  id?: string;
  percent: number;
  startDate: string;
  endDate: string;
  productId?: string;
}

export interface CreateProductDto {
  name: LangMap;
  slug: string;
  description: LangMap;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
  discount?: Omit<Discount, "id" | "productId">;
}
