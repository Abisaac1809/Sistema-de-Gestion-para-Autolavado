import ExchangeRateConfig from "../entities/ExchangeRateConfig";
import { PublicExchangeRateConfig } from "../types/dtos/ExchangeRateConfig.dto";

export default class ExchangeRateConfigMapper {
    static toPublic(entity: ExchangeRateConfig): PublicExchangeRateConfig {
        return {
            id: entity.id,
            activeSource: entity.activeSource,
            customRate: entity.customRate,
            bcvUsdRate: entity.bcvUsdRate,
            bcvEurRate: entity.bcvEurRate,
            autoUpdate: entity.autoUpdate,
            lastSync: entity.lastSync,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt
        };
    }
}