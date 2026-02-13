export type ExchangeRateConfigType = {
    id: string;
    activeSource: string;
    customRate: number;
    bcvUsdRate: number;
    bcvEurRate: number;
    autoUpdate: boolean;
    lastSync: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export type PublicExchangeRateConfig = {
    id: string;
    activeSource: string;
    customRate: number;
    bcvUsdRate: number;
    bcvEurRate: number;
    autoUpdate: boolean;
    lastSync: Date;
    createdAt: Date;
    updatedAt: Date;
}