import { PrismaClient } from '../generated/prisma';
import IExchangeRateRepository from '../interfaces/IRepositories/IExchangeRateRepository';
import ExchangeRateConfig from '../entities/ExchangeRateConfig';
import { ExchangeRateConfigToUpdateType } from '../schemas/ExchangeRateConfig.schema';

export default class PrismaExchangeRateRepository implements IExchangeRateRepository {
    constructor(private prisma: PrismaClient) { }

    async updateExchangeRateConfig(config: ExchangeRateConfigToUpdateType): Promise<ExchangeRateConfig> {
        const existingConfig = await this.prisma.exchangeRateConfig.findFirst({
            where: { deletedAt: null }
        });

        let updatedConfig;

        if (existingConfig) {
            updatedConfig = await this.prisma.exchangeRateConfig.update({
                where: { id: existingConfig.id },
                data: {
                    ...(config.activeSource && { activeSource: config.activeSource }),
                    ...(config.customRate !== undefined && { customRate: config.customRate }),
                    ...(config.autoUpdate !== undefined && { autoUpdate: config.autoUpdate }),
                }
            });
        } else {
            updatedConfig = await this.prisma.exchangeRateConfig.create({
                data: {
                    activeSource: config.activeSource || 'BCV_USD',
                    customRate: config.customRate || 0,
                    autoUpdate: config.autoUpdate !== undefined ? config.autoUpdate : true,
                }
            });
        }

        return new ExchangeRateConfig({
            id: updatedConfig.id,
            activeSource: updatedConfig.activeSource,
            customRate: updatedConfig.customRate.toNumber(),
            bcvUsdRate: updatedConfig.bcvUsdRate.toNumber(),
            bcvEurRate: updatedConfig.bcvEurRate.toNumber(),
            autoUpdate: updatedConfig.autoUpdate,
            lastSync: updatedConfig.lastSync,
            createdAt: updatedConfig.createdAt,
            updatedAt: updatedConfig.updatedAt,
            deletedAt: updatedConfig.deletedAt,
        });
    }

    async getExchangeRateConfig(): Promise<ExchangeRateConfig> {
        const config = await this.prisma.exchangeRateConfig.findFirst({
            where: { deletedAt: null }
        });

        if (!config) {
            const newConfig = await this.prisma.exchangeRateConfig.create({
                data: {
                    activeSource: 'BCV_USD',
                    customRate: 0,
                    bcvUsdRate: 0,
                    bcvEurRate: 0,
                    autoUpdate: true,
                }
            });

            return new ExchangeRateConfig({
                id: newConfig.id,
                activeSource: newConfig.activeSource,
                customRate: newConfig.customRate.toNumber(),
                bcvUsdRate: newConfig.bcvUsdRate.toNumber(),
                bcvEurRate: newConfig.bcvEurRate.toNumber(),
                autoUpdate: newConfig.autoUpdate,
                lastSync: newConfig.lastSync,
                createdAt: newConfig.createdAt,
                updatedAt: newConfig.updatedAt,
                deletedAt: newConfig.deletedAt,
            });
        }

        return new ExchangeRateConfig({
            id: config.id,
            activeSource: config.activeSource,
            customRate: config.customRate.toNumber(),
            bcvUsdRate: config.bcvUsdRate.toNumber(),
            bcvEurRate: config.bcvEurRate.toNumber(),
            autoUpdate: config.autoUpdate,
            lastSync: config.lastSync,
            createdAt: config.createdAt,
            updatedAt: config.updatedAt,
            deletedAt: config.deletedAt,
        });
    }

    async updateBCVRates(usdRate: number, eurRate: number): Promise<void> {
        await this.prisma.exchangeRateConfig.updateMany({
            where: { deletedAt: null },
            data: {
                bcvUsdRate: usdRate,
                bcvEurRate: eurRate,
                lastSync: new Date()
            }
        });
    }
}
