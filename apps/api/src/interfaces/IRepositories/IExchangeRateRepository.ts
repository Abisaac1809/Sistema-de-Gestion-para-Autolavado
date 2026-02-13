import ExchangeRateConfig from "../../entities/ExchangeRateConfig";
import { ExchangeRateConfigToUpdateType } from "../../schemas/ExchangeRateConfig.schema";

export default interface IExchangeRateRepository {
    updateExchangeRateConfig(config: ExchangeRateConfigToUpdateType): Promise<ExchangeRateConfig>;
    getExchangeRateConfig(): Promise<ExchangeRateConfig>;
    updateBCVRates(usdRate: number, eurRate: number): Promise<void>;
}
