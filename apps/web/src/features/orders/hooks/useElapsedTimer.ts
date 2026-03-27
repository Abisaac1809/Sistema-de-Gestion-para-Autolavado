import { useState, useEffect, useMemo } from "react";

function formatElapsed(seconds: number): string {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function useElapsedTimer(anchorDate: Date | string): string {
  const anchor = useMemo(
    () =>
      typeof anchorDate === "string" ? new Date(anchorDate) : anchorDate,
    [anchorDate]
  );

  const [elapsed, setElapsed] = useState(() =>
    Math.max(0, Math.floor((Date.now() - anchor.getTime()) / 1000))
  );

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.max(0, Math.floor((Date.now() - anchor.getTime()) / 1000)));
    }, 1000);
    return () => clearInterval(id);
  }, [anchor]);

  return formatElapsed(elapsed);
}
