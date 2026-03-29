/**
 * Language code → ISO 3166-1 alpha-2 country code (lowercase).
 * Used to build flag image URLs via flagcdn.com.
 */
export const LANG_TO_COUNTRY: Record<string, string> = {
  uz: "uz", // Uzbekistan
  ru: "ru", // Russia
  en: "gb", // English → UK
  tr: "tr", // Turkey
  kz: "kz", // Kazakhstan
  de: "de", // Germany
  fr: "fr", // France
  zh: "cn", // China
  ar: "sa", // Arabic → Saudi Arabia
  ko: "kr", // South Korea
  ja: "jp", // Japan
  hi: "in", // India
  he: "il", // Israel
  fa: "ir", // Iran
  es: "es", // Spain
  pt: "pt", // Portugal
  it: "it", // Italy
  uk: "ua", // Ukraine
  az: "az", // Azerbaijan
  tj: "tj", // Tajikistan
  ky: "kg", // Kyrgyzstan
  tk: "tm", // Turkmenistan
  mn: "mn", // Mongolia
};

/**
 * Returns a flagcdn.com image URL for any language code.
 * @example getFlagUrl("en") → "https://flagcdn.com/24x18/gb.png"
 */
export function getFlagUrl(
  langCode: string,
  size: "20x15" | "24x18" | "32x24" = "24x18",
): string {
  const cc = LANG_TO_COUNTRY[langCode.toLowerCase()] ?? langCode.toLowerCase().slice(0, 2);
  return `https://flagcdn.com/${size}/${cc}.png`;
}
