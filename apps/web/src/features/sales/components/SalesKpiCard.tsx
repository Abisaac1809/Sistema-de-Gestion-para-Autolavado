type SalesKpiCardProps = {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
};

export function SalesKpiCard({ label, value, sub, icon }: SalesKpiCardProps) {
  return (
    <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between min-h-[96px]">
      {icon && (
        <div className="absolute top-4 right-4 text-gray-400">{icon}</div>
      )}
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label}
      </p>
      <div>
        <p className="text-2xl font-bold text-gray-900 mt-1 truncate">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
