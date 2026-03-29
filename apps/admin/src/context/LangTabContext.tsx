import { createContext, useContext, useState, type ReactNode } from "react";
import { useLanguages } from "@/hooks/useLanguages";
import FlagImg from "@/components/shared/FlagImg";
import { cn } from "@/lib/utils";

interface LangTabContextValue {
  activeLang: string;
  setActiveLang: (code: string) => void;
}

const LangTabContext = createContext<LangTabContextValue | null>(null);

export function useLangTab(): LangTabContextValue {
  const ctx = useContext(LangTabContext);
  if (!ctx) throw new Error("useLangTab must be used inside <LangTabProvider>");
  return ctx;
}

interface LangTabProviderProps {
  children: ReactNode;
}

export function LangTabProvider({ children }: LangTabProviderProps) {
  const { languages } = useLanguages();
  const active = languages.filter((l) => l.isActive);
  const defaultLang =
    active.find((l) => l.isDefault)?.code ?? active[0]?.code ?? "";

  const [activeLang, setActiveLang] = useState<string>("");
  const currentLang = activeLang || defaultLang;

  return (
    <LangTabContext.Provider value={{ activeLang: currentLang, setActiveLang }}>
      {children}
    </LangTabContext.Provider>
  );
}

interface LangTabBarProps {
  errorFields?: Record<string, Record<string, unknown> | undefined>;
}

export function LangTabBar({ errorFields }: LangTabBarProps) {
  const { activeLang, setActiveLang } = useLangTab();
  const { languages } = useLanguages();
  const active = languages.filter((l) => l.isActive);

  if (active.length === 0) return null;

  return (
    <div className="flex items-center gap-0.5 p-1 rounded-xl bg-zinc-100 flex-shrink-0">
      {active.map((lang) => {
        const isActive = lang.code === activeLang;
        const hasError = errorFields
          ? Object.values(errorFields).some(
              (fieldErr) => !!fieldErr?.[lang.code],
            )
          : false;

        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => setActiveLang(lang.code)}
            className={cn(
              "flex items-center w-1/2 justify-center  gap-1.5 px-2.5 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-150 select-none whitespace-nowrap",
              isActive
                ? "bg-white shadow-sm text-zinc-800"
                : "text-zinc-500 hover:text-zinc-700 hover:bg-white/60",
              hasError && !isActive && "text-red-400",
            )}
          >
            <FlagImg langCode={lang.code} size="sm" />
            <span>{lang.name}</span>
            {hasError && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 ml-0.5" />
            )}
          </button>
        );
      })}
    </div>
  );
}
