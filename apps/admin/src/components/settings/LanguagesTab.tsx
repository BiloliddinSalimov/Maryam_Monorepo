import { useState } from "react";
import { Languages, Plus } from "lucide-react";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/errorMessage";

import { Button } from "@/components/ui/button";
import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";
import EmptyState from "@/components/shared/EmptyState";
import LanguageCard from "@/components/languages/LanguageCard";
import LanguageFormDialog from "@/components/languages/LanguageFormDialog";

import { useLanguages, useDeleteLanguage } from "@/hooks/useLanguages";
import type { Language } from "@/types/language";

export default function LanguagesTab() {
  const { languages, isLoading } = useLanguages();
  const { mutate: deleteLang, isPending: deleting } = useDeleteLanguage();

  const [formOpen, setFormOpen]       = useState(false);
  const [editItem, setEditItem]       = useState<Language | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Language | null>(null);

  const handleEdit = (lang: Language) => { setEditItem(lang); setFormOpen(true); };
  const handleAdd  = () => { setEditItem(null); setFormOpen(true); };
  const handleCloseForm = () => { setFormOpen(false); setEditItem(null); };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteLang(deleteTarget.id, {
      onSuccess: () => { toast.success("Til o'chirildi"); setDeleteTarget(null); },
      onError:   () => toast.error("O'chirishda xatolik"),
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-zinc-100 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-50">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 100%)" }}
            >
              <Languages size={16} color="white" />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold text-zinc-800">Tillar</h2>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {languages.length} ta til sozlangan
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleAdd}
            className="gap-1.5 text-[12px] h-8 px-3"
            style={{ backgroundColor: "#1A2E44" }}
          >
            <Plus size={13} />
            Til qo'shish
          </Button>
        </div>

        {/* List */}
        <div className="p-4">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-zinc-100 animate-pulse" />
              ))}
            </div>
          ) : languages.length === 0 ? (
            <EmptyState
              icon={Languages}
              title="Hali til qo'shilmagan"
              description="Birinchi tilni qo'shing"
              action={{ label: "Til qo'shish", onClick: handleAdd }}
            />
          ) : (
            <div className="space-y-2">
              {languages.map((lang) => (
                <LanguageCard
                  key={lang.id}
                  language={lang}
                  onEdit={handleEdit}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <LanguageFormDialog open={formOpen} onClose={handleCloseForm} editItem={editItem} />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={`"${deleteTarget?.name}" tilini o'chirish`}
        description="Bu til bilan bog'liq barcha tarjimalar o'chib ketishi mumkin."
        loading={deleting}
      />
    </>
  );
}
