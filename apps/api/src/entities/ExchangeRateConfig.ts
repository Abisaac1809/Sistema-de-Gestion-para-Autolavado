import { ExchangeRateConfigType } from "../types/dtos/ExchangeRateConfig.dto";

export default class ExchangeRateConfig {
    public readonly id: string;
    public activeSource: string;
    public customRate: number;
    public bcvUsdRate: number;
    public bcvEurRate: number;
    public autoUpdate: boolean;
    public lastSync: Date;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date | null | undefined;

    constructor(data: ExchangeRateConfigType) {
        this.id = data.id;
        this.activeSource = data.activeSource;
        this.customRate = data.customRate;
        this.bcvUsdRate = data.bcvUsdRate;
        this.bcvEurRate = data.bcvEurRate;
        this.autoUpdate = data.autoUpdate;
        this.lastSync = data.lastSync;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
    }
}