import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Tag, FolderOpen } from "lucide-react";
import type { Category } from "@/types/category";

interface CategoryTableRowProps {
  category: Category;
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
}

export default function CategoryTableRow({
  category,
  onEdit,
  onDelete,
}: CategoryTableRowProps) {
  const hasParent = !!category.parentId;

  return (
    <TableRow className="hover:bg-slate-50/80 group">
      {/* Name */}
      <TableCell>
        <div className="flex items-center gap-2.5">
          {category.image ? (
            <img
              src={category.image}
              alt=""
              className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#E8F8FF" }}
            >
              {hasParent ? (
                <Tag size={14} style={{ color: "#1A2E44" }} />
              ) : (
                <FolderOpen size={14} style={{ color: "#1A2E44" }} />
              )}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-zinc-800">{typeof category.name === "string" ? category.name : Object.values(category.name)[0] ?? "—"}</p>
            {hasParent && (
              <p className="text-xs text-zinc-400">ichki kategoriya</p>
            )}
          </div>
        </div>
      </TableCell>

      {/* Slug */}
      <TableCell>
        <code className="text-xs bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">
          {category.slug}
        </code>
      </TableCell>

      {/* Parent */}
      <TableCell>
        {category.parent ? (
          <Badge
            variant="secondary"
            className="text-xs font-normal"
            style={{ backgroundColor: "#E8F8FF", color: "#1A2E44" }}
          >
            {typeof category.parent.name === "string" ? category.parent.name : Object.values(category.parent.name)[0] ?? "—"}
          </Badge>
        ) : (
          <span className="text-xs text-zinc-400">—</span>
        )}
      </TableCell>

      {/* Children count */}
      <TableCell>
        {category.children && category.children.length > 0 ? (
          <Badge variant="outline" className="text-xs font-normal">
            {category.children.length} ta ichki
          </Badge>
        ) : (
          <span className="text-xs text-zinc-400">—</span>
        )}
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 text-zinc-400 hover:text-zinc-700"
            onClick={() => onEdit(category)}
          >
            <Pencil size={13} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 text-zinc-400 hover:text-red-600"
            onClick={() => onDelete(category)}
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
