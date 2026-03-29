import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  loading?: boolean;
}

export default function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  title = "O'chirishni tasdiqlang",
  description = "Bu amalni ortga qaytarib bo'lmaydi. Ma'lumot butunlay o'chiriladi.",
  loading,
}: ConfirmDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
              <Trash2 size={18} className="text-red-600" />
            </div>
            <DialogTitle className="text-base">{title}</DialogTitle>
          </div>
        </DialogHeader>
        <p className="-mt-2 text-sm text-zinc-500">{description}</p>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Bekor qilish
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="gap-2"
          >
            {loading ? "O'chirilmoqda..." : "O'chirish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
