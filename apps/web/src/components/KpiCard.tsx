import type { LucideIcon } from "lucide-react";

type KpiCardProps = {
  value: string;
  label: string;
  icon: LucideIcon;
  colorClass: string;
  subtitle?: string;
  isLoading?: boolean;
};

export function KpiCard({
  value,
  label,
  icon,
  colorClass,
  subtitle,
  isLoading,
}: KpiCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border p-5 shadow-sm flex flex-col gap-2 bg-gray-100 animate-pulse">
        <div className="flex items-start justify-between">
          <div className="h-8 w-24 rounded bg-black/10" />
          <div className="h-5 w-5 rounded bg-black/10" />
        </div>
        <div className="h-4 w-32 rounded bg-black/10 mt-1" />
      </div>
    );
  }

  const Icon = icon;

  return (
    <div className={`rounded-2xl border p-5 shadow-sm flex flex-col gap-2 ${colorClass}`}>
      <div className="flex items-start justify-between">
        <span className="text-3xl font-bold">{value}</span>
        <Icon size={20} />
      </div>
      <p className="text-sm font-medium opacity-75">{label}</p>
      {subtitle && <p className="text-xs opacity-60">{subtitle}</p>}
    </div>
  );
}
