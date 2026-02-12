export type ExchangeRateConfigType = {
    id: string;
    activeSource: string;
    customRate: number;
    bcvUsdRate: number;
    bcvEurRate: number;
    autoUpdate: Date;
    lastSync: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}