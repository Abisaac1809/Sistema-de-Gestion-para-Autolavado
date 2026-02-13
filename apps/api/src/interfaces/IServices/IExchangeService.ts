import { ExchangeRateConfigToUpdateType } from "../../schemas/ExchangeRateConfig.schema";
import { PublicExchangeRateConfig } from "../../types/dtos/ExchangeRateConfig.dto";

export default interface IExchangeService {
    getCurrentRate(): Promise<number>;
    getExchangeRateConfig(): Promise<PublicExchangeRateConfig>;
    updateExchangeRateConfig(config: ExchangeRateConfigToUpdateType): Promise<PublicExchangeRateConfig>;
    syncExchangeRates(): Promise<void>;
}