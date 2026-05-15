import { useState, useCallback, useMemo } from "react";

export type DatePreset = "today" | "week" | "month" | "year" | "custom";

export type DashboardFilters = {
  activePreset: DatePreset;
  fromDate: string;
  toDate: string;
};

export type DashboardFilterActions = {
  setPreset: (preset: DatePreset) => void;
  setCustomRange: (from: string, to: string) => void;
};

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function computeDatesForPreset(preset: DatePreset): { fromDate: string; toDate: string } {
  const now = new Date();
  const today = formatDate(now);

  switch (preset) {
    case "today":
      return { fromDate: today, toDate: today };
    case "week": {
      const day = now.getDay();
      const diff = day === 0 ? 6 : day - 1;
      const monday = new Date(now);
      monday.setDate(now.getDate() - diff);
      return { fromDate: formatDate(monday), toDate: today };
    }
    case "month": {
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return { fromDate: formatDate(firstOfMonth), toDate: today };
    }
    case "year": {
      const firstOfYear = new Date(now.getFullYear(), 0, 1);
      return { fromDate: formatDate(firstOfYear), toDate: today };
    }
    default:
      return { fromDate: today, toDate: today };
  }
}

export function useDashboardFilters() {
  const initialDates = computeDatesForPreset("today");
  const [activePreset, setActivePreset] = useState<DatePreset>("today");
  const [fromDate, setFromDate] = useState(initialDates.fromDate);
  const [toDate, setToDate] = useState(initialDates.toDate);

  const setPreset = useCallback((preset: DatePreset) => {
    setActivePreset(preset);
    if (preset !== "custom") {
      const dates = computeDatesForPreset(preset);
      setFromDate(dates.fromDate);
      setToDate(dates.toDate);
    }
  }, []);

  const setCustomRange = useCallback((from: string, to: string) => {
    setActivePreset("custom");
    setFromDate(from);
    setToDate(to);
  }, []);

  const dateParams = useMemo(() => ({ fromDate, toDate }), [fromDate, toDate]);

  return {
    filters: { activePreset, fromDate, toDate } as DashboardFilters,
    filterActions: { setPreset, setCustomRange } as DashboardFilterActions,
    dateParams,
  };
}
