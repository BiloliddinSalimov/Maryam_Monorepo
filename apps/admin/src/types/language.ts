export interface Language {
  id: string;
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface CreateLanguageDto {
  code: string;
  name: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface UpdateLanguageDto {
  name?: string;
  isDefault?: boolean;
  isActive?: boolean;
}
