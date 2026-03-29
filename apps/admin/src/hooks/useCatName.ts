import { useLanguages } from "@/hooks/useLanguages";
import type { LangMap } from "@/types/category";

/**
 * Returns a function that resolves a LangMap to a display string
 * using the active default language from the Languages API.
 */
export function useCatName() {
  const { languages } = useLanguages();

  const defaultCode =
    languages.find((l) => l.isDefault)?.code ??
    languages.find((l) => l.isActive)?.code ??
    "uz";

  return (name: LangMap | undefined): string => {
    if (!name) return "—";
    return name[defaultCode] ?? Object.values(name)[0] ?? "—";
  };
}
