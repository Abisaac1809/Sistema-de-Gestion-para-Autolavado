import type { LucideIcon } from "lucide-react";

type KpiCardProps = {
  value: string;
  label: string;
  icon?: LucideIcon;
  colorClass?: string;
  subtitle?: string;
  isLoading?: boolean;
};

export function KpiCard({ value, label, icon, subtitle, isLoading }: KpiCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-5 py-6 flex flex-col gap-2 animate-pulse shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between">
          <div className="h-2.5 w-20 rounded-sm bg-gray-200" />
          <div className="h-4 w-4 rounded-sm bg-gray-200" />
        </div>
        <div className="h-8 w-28 rounded-sm bg-gray-200 mt-1" />
        <div className="h-2.5 w-24 rounded-sm bg-gray-200 mt-1" />
      </div>
    );
  }

  const Icon = icon;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-7 py-7 flex flex-col gap-1 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
          {label}
        </p>
        {Icon && <Icon size={16} className="text-gray-300" />}
      </div>
      <span className="text-3xl font-semibold leading-none tracking-tight tabular-nums text-gray-900 mt-2">
        {value}
      </span>
      <p className={`text-xs text-gray-400 mt-1 ${!subtitle ? "invisible" : ""}`}>
        {subtitle ?? "\u00A0"}
      </p>
    </div>
  );
}
