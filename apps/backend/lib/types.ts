export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  is_bot?: boolean;
  photo_url?: string;
}

export interface JwtPayload {
  id: string;
  telegramId: string;
}
