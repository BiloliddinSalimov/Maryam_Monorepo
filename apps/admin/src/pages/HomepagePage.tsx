import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LayoutTemplate } from "lucide-react";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/errorMessage";

import PageHero from "@/components/shared/PageHero";
import ConfirmDeleteDialog from "@/components/shared/ConfirmDeleteDialog";
import SectionCard from "@/components/sections/SectionCard";

import {
  useSections,
  useDeleteSection,
  useToggleSection,
  useReorderSections,
} from "@/hooks/useSections";
import { useLanguages } from "@/hooks/useLanguages";
import type { Section } from "@/types/section";

// ── Helpers ───────────────────────────────────────────────────────────────────

function move<T>(arr: T[], from: number, to: number): T[] {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

// ── Per-row wrapper that owns the toggle hook ─────────────────────────────────

interface SectionRowProps {
  section: Section;
  lang: string;
  index: number;
  total: number;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function SectionRow({
  section,
  lang,
  index,
  total,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: SectionRowProps) {
  const { mutate: toggle } = useToggleSection(section.id);

  const handleToggle = () => {
    toggle(undefined, {
      onSuccess: () =>
        toast.success(
          section.isActive ? "Bo'lim yashirildi" : "Bo'lim faollashtirildi",
        ),
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  return (
    <SectionCard
      section={section}
      lang={lang}
      isFirst={index === 0}
      isLast={index === total - 1}
      onEdit={onEdit}
      onDelete={onDelete}
      onToggle={handleToggle}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
    />
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function HomepagePage() {
  const navigate = useNavigate();
  const { sections, isLoading } = useSections();
  const { mutate: deleteSection, isPending: deleting } = useDeleteSection();
  const { mutate: reorder } = useReorderSections();
  const { languages } = useLanguages();

  const [deleteTarget, setDeleteTarget] = useState<Section | null>(null);

  const defaultLang =
    languages.find((l) => l.isDefault)?.code ??
    languages.find((l) => l.isActive)?.code ??
    "uz";

  // ── Reorder ────────────────────────────────────────────────────────────────

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const reordered = move(sections, index, index - 1).map((s, i) => ({
      ...s,
      order: i + 1,
    }));
    reorder(
      { sections: reordered.map((s) => ({ id: s.id, order: s.order })) },
      { onError: (err) => toast.error(getErrorMessage(err, "Tartib o'zgartirishda xatolik")) },
    );
  };

  const handleMoveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const reordered = move(sections, index, index + 1).map((s, i) => ({
      ...s,
      order: i + 1,
    }));
    reorder(
      { sections: reordered.map((s) => ({ id: s.id, order: s.order })) },
      { onError: (err) => toast.error(getErrorMessage(err, "Tartib o'zgartirishda xatolik")) },
    );
  };

  // ── Delete ─────────────────────────────────────────────────────────────────

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteSection(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Bo'lim o'chirildi");
        setDeleteTarget(null);
      },
      onError: (err) => toast.error(getErrorMessage(err, "O'chirishda xatolik")),
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-6 pb-10">
      <PageHero
        icon={LayoutTemplate}
        title="Bosh sahifa bo'limlari"
        stats={[{ value: sections.length, label: "ta bo'lim" }]}
        actionLabel="Bo'lim qo'shish"
        onAction={() => navigate("/homepage/create")}
      />

      {isLoading ? (
        <div className="mt-2 space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 px-4 py-3.5 bg-white rounded-2xl border border-zinc-100 animate-pulse"
            >
              <div className="w-6 h-6 rounded-lg bg-zinc-100" />
              <div className="w-9 h-9 rounded-xl bg-zinc-100" />
              <div className="flex-1 space-y-1.5">
                <div className="w-40 h-4 rounded-lg bg-zinc-100" />
                <div className="w-24 h-3 rounded-lg bg-zinc-100" />
              </div>
              <div className="w-20 h-7 rounded-lg bg-zinc-100" />
              <div className="w-16 h-7 rounded-lg bg-zinc-100" />
            </div>
          ))}
        </div>
      ) : sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 mt-2 text-center bg-white border shadow-sm rounded-2xl border-zinc-100">
          <div
            className="flex items-center justify-center mb-4 w-14 h-14 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 100%)",
            }}
          >
            <LayoutTemplate size={24} color="white" />
          </div>
          <h3 className="text-[15px] font-semibold text-zinc-700 mb-1">
            Hali bo'lim qo'shilmagan
          </h3>
          <p className="max-w-xs mb-5 text-sm text-zinc-400">
            Bosh sahifada ko'rinadigan bo'limlarni tartib bilan qo'shing
          </p>
          <button
            type="button"
            onClick={() => navigate("/homepage/create")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #1A2E44 0%, #2d4a6b 100%)" }}
          >
            <Plus size={14} />
            Birinchi bo'limni qo'shish
          </button>
        </div>
      ) : (
        <div className="mt-2 space-y-2">
          {sections.map((section, index) => (
            <SectionRow
              key={section.id}
              section={section}
              lang={defaultLang}
              index={index}
              total={sections.length}
              onEdit={() => navigate(`/homepage/${section.id}/edit`)}
              onDelete={() => setDeleteTarget(section)}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
            />
          ))}
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Bo'limni o'chirish"
        description="Bu bo'limni o'chirib bo'lmaydi. Davom etasizmi?"
        loading={deleting}
      />
    </div>
  );
}
