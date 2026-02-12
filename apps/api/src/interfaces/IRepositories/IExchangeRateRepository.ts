export default interface IExchangeRateRepository {
    getCurrentRate(): Promise<number>;
}
