import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import FlagImg from "@/components/shared/FlagImg";
import type { Language } from "@/types/language";

interface LanguageCardProps {
  language: Language;
  onEdit: (lang: Language) => void;
  onDelete: (lang: Language) => void;
}

export default function LanguageCard({ language, onEdit, onDelete }: LanguageCardProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-zinc-100 bg-white hover:shadow-sm transition-shadow">
      <div className="flex items-center gap-3">
        {/* Flag + code */}
        <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center flex-shrink-0">
          <FlagImg langCode={language.code} size="md" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-zinc-800">{language.name}</p>
          <p className="text-xs text-zinc-400 font-mono uppercase">{language.code}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {language.isDefault && (
          <Badge
            variant="secondary"
            className="text-xs"
            style={{ backgroundColor: "#FFF4E0", color: "#CC7A00" }}
          >
            Asosiy
          </Badge>
        )}
        <Badge
          variant="secondary"
          className="text-xs"
          style={
            language.isActive
              ? { backgroundColor: "#E6FBF0", color: "#1A7A47" }
              : { backgroundColor: "#F5F5F5", color: "#888" }
          }
        >
          {language.isActive ? "Faol" : "Nofaol"}
        </Badge>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-zinc-400 hover:text-zinc-700"
          onClick={() => onEdit(language)}
        >
          <Pencil size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-zinc-400 hover:text-red-500"
          onClick={() => onDelete(language)}
          disabled={language.isDefault}
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}
