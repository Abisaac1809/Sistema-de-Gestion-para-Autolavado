export default interface IExchangeRateProviderService {
    getUSDExchangeRate(): Promise<number>;
    getEURExchangeRate(): Promise<number>;
    syncExchangeRates(): Promise<void>;
}