import { ClipboardList, ShoppingCart, CreditCard } from "lucide-react";
import type { ActivityFeedItem } from "@car-wash/types";

type Props = {
  activity: ActivityFeedItem[];
  isLoading: boolean;
};

const TYPE_CONFIG: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  order: { bg: "bg-blue-50", text: "text-blue-500", icon: ClipboardList },
  sale: { bg: "bg-green-50", text: "text-green-500", icon: ShoppingCart },
  payment: { bg: "bg-purple-50", text: "text-purple-500", icon: CreditCard },
};

function relativeTime(timestamp: Date | string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "Ahora";
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Hace ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays}d`;
}

export function ActivityFeedCard({ activity, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 animate-pulse">
        <div className="h-4 w-36 bg-gray-200 rounded mb-4" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 bg-gray-100 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/4 bg-gray-100 rounded" />
                <div className="h-2.5 w-1/3 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <p className="text-sm font-semibold text-gray-900 mb-3">Actividad Reciente</p>

      {activity.length === 0 ? (
        <p className="text-sm text-gray-400">Sin actividad reciente</p>
      ) : (
        <div className="space-y-3 max-h-[280px] overflow-y-auto">
          {activity.map((item) => {
            const config = TYPE_CONFIG[item.type] ?? { bg: "bg-gray-50", text: "text-gray-400", icon: ClipboardList };
            const Icon = config.icon;
            return (
              <div key={item.id} className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${config.bg}`}>
                  <Icon size={14} className={config.text} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 leading-relaxed">{item.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-400">{relativeTime(item.timestamp)}</span>
                    {item.amountUsd != null && (
                      <span className="text-[10px] font-medium text-gray-600">
                        ${item.amountUsd.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
