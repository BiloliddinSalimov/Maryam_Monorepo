import { ShoppingCart } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

export default function OrdersPage() {
  return (
    <div>
      {/* <PageHeader title="Buyurtmalar" subtitle="Barcha buyurtmalar ro'yxati" /> */}
      <div className="max-w-6xl px-6 pb-6 mx-auto mt-3">
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white border shadow-sm rounded-2xl border-zinc-100">
          <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-amber-50">
            <ShoppingCart size={28} className="text-amber-400" />
          </div>
          <h3 className="text-base font-semibold" style={{ color: "#1A2E44" }}>
            Buyurtmalar moduli
          </h3>
          <p className="text-sm text-zinc-400 mt-1.5 max-w-xs">
            Bu bo'lim tez orada ishga tushiriladi
          </p>
        </div>
      </div>
    </div>
  );
}
