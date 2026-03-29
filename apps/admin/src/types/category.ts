export type LangMap = Record<string, string>;

export interface Category {
  id: string;
  name: LangMap;
  slug: string;
  image?: string | null;
  parentId?: string | null;
  parent?: Pick<Category, "id" | "name">;
  children?: Category[];
}

export interface CreateCategoryDto {
  name: LangMap;
  slug: string;
  image?: string;
  parentId?: string;
  productIds?: string[];
}
