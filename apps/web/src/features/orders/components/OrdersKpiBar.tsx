import { Car, Wrench, ClipboardList } from "lucide-react";

export type OrdersKpiBarProps = {
  vehiclesInYard: number;
  servicesInProgress: number;
  totalOrders: number;
};

type StatCardProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
};

function StatCard({ label, value, icon, iconBg }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
      <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider truncate">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export function OrdersKpiBar({
  vehiclesInYard,
  servicesInProgress,
  totalOrders,
}: OrdersKpiBarProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <StatCard
        label="Vehiculos en Patio"
        value={vehiclesInYard}
        icon={<Car size={20} className="text-indigo-600" />}
        iconBg="bg-indigo-50"
      />
      <StatCard
        label="Servicios en Proceso"
        value={servicesInProgress}
        icon={<Wrench size={20} className="text-emerald-600" />}
        iconBg="bg-emerald-50"
      />
      <StatCard
        label="Ordenes Totales"
        value={totalOrders}
        icon={<ClipboardList size={20} className="text-amber-600" />}
        iconBg="bg-amber-50"
      />
    </div>
  );
}

export function OrdersKpiBarSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 bg-white p-5 animate-pulse h-24"
        />
      ))}
    </div>
  );
}
