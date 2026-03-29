import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Package } from "lucide-react";
import type { Product } from "@/types/product";

interface ProductTableRowProps {
  product: Product;
  categoryName?: string;
  displayName: string;   // resolved by parent once, not per-row
  thumbnail: string | null;
  onEdit: (p: Product) => void;
  onDelete: (p: Product) => void;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("uz-UZ").format(price) + " so'm";
}

// memo: only re-renders when props change — prevents full list re-render
const ProductTableRow = memo(function ProductTableRow({
  product,
  categoryName,
  displayName,
  thumbnail,
  onEdit,
  onDelete,
}: ProductTableRowProps) {
  const hasDiscount = !!product.discount;

  return (
    <TableRow className="hover:bg-slate-50/80 group">
      {/* Product info */}
      <TableCell>
        <div className="flex items-center gap-2.5">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={displayName}
              className="flex-shrink-0 object-cover rounded-lg w-9 h-9"
            />
          ) : (
            <div
              className="flex items-center justify-center flex-shrink-0 rounded-lg w-9 h-9"
              style={{ backgroundColor: "#E8F8FF" }}
            >
              <Package size={14} style={{ color: "#1A2E44" }} />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-800 truncate max-w-[180px]">
              {displayName}
            </p>
            <code className="text-xs text-zinc-400">{product.slug}</code>
          </div>
        </div>
      </TableCell>

      {/* Category */}
      <TableCell>
        {categoryName ? (
          <Badge
            variant="secondary"
            className="text-xs font-normal"
            style={{ backgroundColor: "#E8F8FF", color: "#1A2E44" }}
          >
            {categoryName}
          </Badge>
        ) : (
          <span className="text-xs text-zinc-400">—</span>
        )}
      </TableCell>

      {/* Price */}
      <TableCell>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-zinc-800">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs font-medium text-emerald-600">
              -{product.discount!.percent}% chegirma
            </span>
          )}
        </div>
      </TableCell>

      {/* Stock */}
      <TableCell>
        <Badge
          variant="outline"
          className="text-xs"
          style={
            product.stock > 10
              ? { borderColor: "#b6f5d5", color: "#1A7A47" }
              : product.stock > 0
                ? { borderColor: "#FFE0A0", color: "#CC7A00" }
                : { borderColor: "#FFCCCC", color: "#CC3333" }
          }
        >
          {product.stock} dona
        </Badge>
      </TableCell>

      {/* Images count */}
      <TableCell>
        <span className="text-xs text-zinc-500">
          {product.images?.length ?? 0} ta
        </span>
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1 transition-opacity opacity-0 group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 text-zinc-400 hover:text-zinc-700"
            onClick={() => onEdit(product)}
          >
            <Pencil size={13} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 text-zinc-400 hover:text-red-600"
            onClick={() => onDelete(product)}
          >
            <Trash2 size={13} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});

export default ProductTableRow;
