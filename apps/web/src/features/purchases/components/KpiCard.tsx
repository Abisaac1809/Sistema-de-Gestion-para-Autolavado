type KpiCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  textColor?: string;
};

export function KpiCard({ title, value, icon, color = "bg-gray-100", textColor = "text-gray-900" }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className={`flex items-center justify-center w-9 h-9 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}
