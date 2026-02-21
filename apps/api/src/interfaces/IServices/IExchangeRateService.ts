import { ExchangeRateConfigToUpdateType } from "../../schemas/ExchangeRateConfig.schema.js";
import { CurrentExchangeRateInfo, PublicExchangeRateConfig } from "../../types/dtos/ExchangeRateConfig.dto.js";

export default interface IExchangeRateService {
    getCurrentRate(): Promise<number>;
    getCurrentExchangeRateInfo(): Promise<CurrentExchangeRateInfo>;
    getExchangeRateConfig(): Promise<PublicExchangeRateConfig>;
    updateExchangeRateConfig(config: ExchangeRateConfigToUpdateType): Promise<PublicExchangeRateConfig>;
    syncExchangeRates(): Promise<void>;
}