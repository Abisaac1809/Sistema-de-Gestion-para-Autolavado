import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import type {
  PublicExchangeRateConfig,
  ExchangeRateConfigToUpdateType,
} from "@car-wash/types";
import { ExchangeRateSource } from "@car-wash/types";
import type { CurrencyTabFormValues } from "../../schemas/settings.schemas";

type CurrencyTabProps = {
  config: PublicExchangeRateConfig | undefined;
  isLoading: boolean;
  isSaving: boolean;
  isSyncing: boolean;
  onSave: (payload: ExchangeRateConfigToUpdateType) => void;
  onSync: () => void;
};

function formatRelativeTime(value: Date | string | undefined): string {
  if (!value) return "nunca";
  const date = typeof value === "string" ? new Date(value) : value;
  if (isNaN(date.getTime())) return "nunca";
  const diffMs = Date.now() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  if (diffSeconds < 60) return "hace menos de 1 minuto";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `hace ${diffMinutes} minuto${diffMinutes !== 1 ? "s" : ""}`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours !== 1 ? "s" : ""}`;
  const diffDays = Math.floor(diffHours / 24);
  return `hace ${diffDays} día${diffDays !== 1 ? "s" : ""}`;
}

type SourceCard = {
  value: ExchangeRateSource;
  label: string;
  description: string;
};

const SOURCE_CARDS: SourceCard[] = [
  {
    value: ExchangeRateSource.BCV_USD,
    label: "Dólar BCV",
    description: "Tasa oficial del Banco Central de Venezuela (USD)",
  },
  {
    value: ExchangeRateSource.BCV_EUR,
    label: "Euro BCV",
    description: "Tasa oficial del Banco Central de Venezuela (EUR)",
  },
  {
    value: ExchangeRateSource.CUSTOM,
    label: "Personalizada",
    description: "Define tu propia tasa de cambio",
  },
];

export function CurrencyTab({
  config,
  isLoading,
  isSaving,
  isSyncing,
  onSave,
  onSync,
}: CurrencyTabProps) {
  const [form, setForm] = useState<CurrencyTabFormValues>({
    activeSource: ExchangeRateSource.BCV_USD,
    customRate: undefined,
    autoUpdate: false,
  });

  useEffect(() => {
    if (config) {
      const source =
        Object.values(ExchangeRateSource).find((s) => s === config.activeSource) ??
        ExchangeRateSource.BCV_USD;
      setForm({
        activeSource: source,
        customRate: config.customRate,
        autoUpdate: config.autoUpdate,
      });
    }
  }, [config]);

  function getRateLabel(source: ExchangeRateSource): string {
    if (!config) return "";
    if (source === ExchangeRateSource.BCV_USD) {
      return config.bcvUsdRate != null
        ? `1 USD = Bs. ${config.bcvUsdRate.toFixed(2)}`
        : "Sin datos";
    }
    if (source === ExchangeRateSource.BCV_EUR) {
      return config.bcvEurRate != null
        ? `1 EUR = Bs. ${config.bcvEurRate.toFixed(2)}`
        : "Sin datos";
    }
    if (source === ExchangeRateSource.CUSTOM) {
      return form.customRate != null
        ? `1 USD = Bs. ${form.customRate.toFixed(2)}`
        : "Define una tasa personalizada";
    }
    return "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: ExchangeRateConfigToUpdateType = {
      activeSource: form.activeSource,
      autoUpdate: form.autoUpdate,
      ...(form.activeSource === ExchangeRateSource.CUSTOM && form.customRate != null
        ? { customRate: form.customRate }
        : {}),
    };
    onSave(payload);
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-56" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-lg" />
          ))}
        </div>
        <div className="h-10 bg-gray-200 rounded w-48" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Configuración de monedas
        </h2>
        <div className="flex items-center gap-3">
          {config && (
            <span className="text-xs text-gray-500">
              Última sincronización: {formatRelativeTime(config.lastSync)}
            </span>
          )}
          <button
            type="button"
            onClick={onSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw
              className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`}
            />
            Sincronizar BCV
          </button>
        </div>
      </div>

      {/* Source cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {SOURCE_CARDS.map((card) => {
          const isSelected = form.activeSource === card.value;
          return (
            <div key={card.value} className="space-y-2">
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, activeSource: card.value }))
                }
                className={`w-full text-left rounded-lg border-2 p-4 transition-colors ${
                  isSelected
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <p className="text-sm font-semibold text-gray-900">
                  {card.label}
                </p>
                <p className="mt-1 text-xs text-gray-500">{card.description}</p>
                {config && (
                  <p className="mt-2 text-sm font-medium text-gray-700">
                    {getRateLabel(card.value)}
                  </p>
                )}
              </button>
              {isSelected && card.value === ExchangeRateSource.CUSTOM && (
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-gray-700">
                    Tasa personalizada (Bs./USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.customRate ?? 0}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        customRate: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Ej: 36.50"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Auto-update toggle */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
        <div>
          <p className="text-sm font-medium text-gray-900">
            Actualización automática
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Sincronizar tasas del BCV automáticamente cada día
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={form.autoUpdate}
          onClick={() =>
            setForm((prev) => ({ ...prev, autoUpdate: !prev.autoUpdate }))
          }
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 ${
            form.autoUpdate ? "bg-gray-900" : "bg-gray-200"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
              form.autoUpdate ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}
