import { Car, Wrench, ClipboardList } from "lucide-react";
import { KpiCard } from "@/components/KpiCard";

export type OrdersKpiBarProps = {
  vehiclesInYard: number;
  servicesInProgress: number;
  totalOrders: number;
};

export function OrdersKpiBar({
  vehiclesInYard,
  servicesInProgress,
  totalOrders,
}: OrdersKpiBarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <KpiCard
        value={String(vehiclesInYard)}
        label="Vehiculos en Patio"
        icon={Car}
        colorClass="bg-indigo-50 text-indigo-600"
      />
      <KpiCard
        value={String(servicesInProgress)}
        label="Servicios en Proceso"
        icon={Wrench}
        colorClass="bg-emerald-50 text-emerald-600"
      />
      <KpiCard
        value={String(totalOrders)}
        label="Ordenes Totales"
        icon={ClipboardList}
        colorClass="bg-amber-50 text-amber-600"
      />
    </div>
  );
}

export function OrdersKpiBarSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <KpiCard value="" label="" icon={Car} colorClass="" isLoading />
      <KpiCard value="" label="" icon={Car} colorClass="" isLoading />
      <KpiCard value="" label="" icon={Car} colorClass="" isLoading />
    </div>
  );
}
