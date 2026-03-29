export type LangMap = Record<string, string>;

export interface Banner {
  id: string;
  title: LangMap;
  image: string;
  link?: string | null;
  isActive: boolean;
  order: number;
}

export interface CreateBannerDto {
  title: LangMap;
  image: string;
  link?: string;
  isActive?: boolean;
  order?: number;
}
