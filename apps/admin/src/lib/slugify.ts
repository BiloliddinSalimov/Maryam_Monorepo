/**
 * Converts a string into a URL-friendly slug.
 * Handles Cyrillic, Latin and special characters.
 */
const CYRILLIC_MAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo",
  ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
  н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  // Uzbek-specific
  ў: "u", қ: "q", ғ: "g", ҳ: "h",
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((c) => CYRILLIC_MAP[c] ?? c)
    .join("")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}
