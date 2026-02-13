import { InvalidExchangeRateSourceError } from "../errors/InternalServerErrors";
import IExchangeRateRepository from "../interfaces/IRepositories/IExchangeRateRepository";
import IExchangeRateProviderService from "../interfaces/IServices/IExchangeProviderService";
import IExchangeService from "../interfaces/IServices/IExchangeService";
import ExchangeRateConfigMapper from "../mappers/ExchangeRateConfigMapper";
import { ExchangeRateConfigToUpdateType } from "../schemas/ExchangeRateConfig.schema";
import { PublicExchangeRateConfig } from "../types/dtos/ExchangeRateConfig.dto";
import { ExchangeRateSource } from "../types/enums";

export class ExchangeRateService implements IExchangeService {
    private exchangeRateRepository: IExchangeRateRepository;
    private exchangeRateProviderService: IExchangeRateProviderService;
    
    constructor(
        exchangeRateRepository: IExchangeRateRepository,
        exchangeRateProviderService: IExchangeRateProviderService
    ) {
        this.exchangeRateRepository = exchangeRateRepository;
        this.exchangeRateProviderService = exchangeRateProviderService;
    }

    async getCurrentRate(): Promise<number> {
        try {
            const config = await this.exchangeRateRepository.getExchangeRateConfig();

            if (config.activeSource === ExchangeRateSource.CUSTOM) {
                return Math.round(config.customRate * 100) / 100;
            }

            const [usdRate, eurRate] = await Promise.all([
                this.exchangeRateProviderService.getUSDExchangeRate(),
                this.exchangeRateProviderService.getEURExchangeRate()
            ]);

            const usdChanged = Math.abs(usdRate - config.bcvUsdRate) > 0.01;
            const eurChanged = Math.abs(eurRate - config.bcvEurRate) > 0.01;

            if (usdChanged || eurChanged) {
                await this.exchangeRateRepository.updateBCVRates(usdRate, eurRate);
            }

            let rate: number;
            switch (config.activeSource) {
                case ExchangeRateSource.BCV_USD:
                    rate = usdRate;
                    break;
                case ExchangeRateSource.BCV_EUR:
                    rate = eurRate;
                    break;
                default:
                    throw new InvalidExchangeRateSourceError(config.activeSource);
            }

            return Math.round(rate * 100) / 100;

        } catch (error) {
            console.error('Error obteniendo tasa del BCV, usando última tasa conocida:', error);
            const config = await this.exchangeRateRepository.getExchangeRateConfig();

            let rate: number;
            switch (config.activeSource) {
                case ExchangeRateSource.BCV_USD:
                    rate = config.bcvUsdRate;
                    break;
                case ExchangeRateSource.BCV_EUR:
                    rate = config.bcvEurRate;
                    break;
                case ExchangeRateSource.CUSTOM:
                    rate = config.customRate;
                    break;
                default:
                    throw new InvalidExchangeRateSourceError(config.activeSource);
            }

            return Math.round(rate * 100) / 100;
        }
    }

    async getExchangeRateConfig(): Promise<PublicExchangeRateConfig> {
        const exchangeRateConfig = await this.exchangeRateRepository.getExchangeRateConfig();
        return ExchangeRateConfigMapper.toPublic(exchangeRateConfig);
    }

    async updateExchangeRateConfig(config: ExchangeRateConfigToUpdateType): Promise<PublicExchangeRateConfig> {
        const updatedConfig = await this.exchangeRateRepository.updateExchangeRateConfig(config);
        return ExchangeRateConfigMapper.toPublic(updatedConfig);
    }

    async syncExchangeRates(): Promise<void> {
        try {
            await this.exchangeRateProviderService.syncExchangeRates();

            const [usdRate, eurRate] = await Promise.all([
                this.exchangeRateProviderService.getUSDExchangeRate(),
                this.exchangeRateProviderService.getEURExchangeRate()
            ]);

            await this.exchangeRateRepository.updateBCVRates(usdRate, eurRate);

        } catch (error) {
            console.error('Error sincronizando tasas del BCV:', error);
            throw error;
        }
    }
}