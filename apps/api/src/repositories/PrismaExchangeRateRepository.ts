import { PrismaClient } from '../generated/prisma';
import IExchangeRateRepository from '../interfaces/IRepositories/IExchangeRateRepository';

export default class PrismaExchangeRateRepository implements IExchangeRateRepository {
    constructor(private prisma: PrismaClient) { }

    async getCurrentRate(): Promise<number> {
        const config = await this.prisma.exchangeRateConfig.findFirst();

        if (!config) {
            // Fallback to 1.0 if no configuration exists
            return 1.0;
        }

        // Return the rate based on the active source
        switch (config.activeSource) {
            case 'BCV_USD':
                return config.bcvUsdRate.toNumber();
            case 'BCV_EUR':
                return config.bcvEurRate.toNumber();
            case 'CUSTOM':
                return config.customRate.toNumber();
            default:
                return 1.0;
        }
    }
}
