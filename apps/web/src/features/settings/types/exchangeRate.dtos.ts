import type {
  PublicExchangeRateConfig,
  ExchangeRateConfigToUpdateType,
} from "@car-wash/types";

export type UseExchangeRateConfigResult = {
  config: PublicExchangeRateConfig | undefined;
  isLoading: boolean;
};

export type UseExchangeRateMutationsResult = {
  save: (payload: ExchangeRateConfigToUpdateType) => void;
  sync: () => void;
  isSaving: boolean;
  isSyncing: boolean;
};
