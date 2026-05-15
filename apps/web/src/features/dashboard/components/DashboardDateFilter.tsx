import type { DashboardFilters, DashboardFilterActions, DatePreset } from "../hooks/useDashboardFilters";

type Props = {
  filters: DashboardFilters;
  filterActions: DashboardFilterActions;
};

const PRESETS: { key: DatePreset; label: string }[] = [
  { key: "today", label: "Hoy" },
  { key: "week", label: "Semana" },
  { key: "month", label: "Mes" },
  { key: "year", label: "Año" },
];

export function DashboardDateFilter({ filters, filterActions }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center rounded-lg border border-gray-200 bg-white p-0.5">
        {PRESETS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => filterActions.setPreset(key)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              filters.activePreset === key
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => filterActions.setCustomRange(e.target.value, filters.toDate)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <span className="text-xs text-gray-400">—</span>
        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => filterActions.setCustomRange(filters.fromDate, e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>
    </div>
  );
}
