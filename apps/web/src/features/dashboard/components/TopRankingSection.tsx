import { Sparkles, Package } from "lucide-react";
import type { TopServiceItem, TopProductItem } from "@car-wash/types";

type Props = {
  services: TopServiceItem[];
  products: TopProductItem[];
  isLoadingServices: boolean;
  isLoadingProducts: boolean;
};

function RankingCard({
  title,
  icon: Icon,
  items,
  isLoading,
}: {
  title: string;
  icon: React.ElementType;
  items: { name: string; revenue: number; quantity: number }[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 animate-pulse">
        <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-5 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const maxRevenue = items.length > 0 ? Math.max(...items.map((i) => i.revenue)) : 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon size={16} className="text-gray-400" />
        <p className="text-sm font-semibold text-gray-900">{title}</p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-400">Sin datos</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => {
            const pct = (item.revenue / maxRevenue) * 100;
            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700 truncate flex-1">{item.name}</span>
                  <span className="text-xs font-medium text-gray-900 ml-2">
                    ${item.revenue.toFixed(2)}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-900 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400">{item.quantity} vendidos</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function TopRankingSection({ services, products, isLoadingServices, isLoadingProducts }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <RankingCard
        title="Top Servicios"
        icon={Sparkles}
        isLoading={isLoadingServices}
        items={services.map((s) => ({ name: s.serviceName, revenue: s.revenueUsd, quantity: s.quantitySold }))}
      />
      <RankingCard
        title="Top Productos"
        icon={Package}
        isLoading={isLoadingProducts}
        items={products.map((p) => ({ name: p.productName, revenue: p.revenueUsd, quantity: p.quantitySold }))}
      />
    </div>
  );
}
