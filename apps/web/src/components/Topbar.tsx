import { Plus } from "lucide-react";
import { cn } from "@/utils/cn";

export function Topbar({ onCreateOrder }: { onCreateOrder: () => void }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-4 border-b border-gray-200 bg-white px-6">
      <button
        type="button"
        onClick={onCreateOrder}
        className={cn(
          "inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white",
          "transition-colors hover:bg-gray-700",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
        )}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Crear Orden
      </button>
    </header>
  );
}
