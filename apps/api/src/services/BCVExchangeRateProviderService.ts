import axios from "axios";
import * as cheerio from "cheerio";
import { Agent } from "https";
import IExchangeRateProviderService from "../interfaces/IServices/IExchangeProviderService.js";

export default class BCVExchangeRateProviderService implements IExchangeRateProviderService {
    private httpsAgent: Agent;
    private usdRate: number;
    private eurRate: number;
    private lastUpdated: number;
    private readonly cacheDuration: number; // 1 hora en milisegundos

    constructor() {
        this.httpsAgent = new Agent({
            rejectUnauthorized: false,
        });
        this.usdRate = 0;
        this.eurRate = 0;
        this.lastUpdated = 0;
        this.cacheDuration = 60 * 60 * 1000; // 1 hora
    }

    async getUSDExchangeRate(): Promise<number> {
        await this.checkAndUpdateCache();
        return this.usdRate;
    }

    async getEURExchangeRate(): Promise<number> {
        await this.checkAndUpdateCache();
        return this.eurRate;
    }

    async syncExchangeRates(): Promise<void> {
        await this.updateRates();
    }

    private async checkAndUpdateCache(): Promise<void> {
        const now = Date.now();
        const isExpired = now - this.lastUpdated >= this.cacheDuration;
        
        if (isExpired || this.lastUpdated === 0) {
            await this.updateRates();
        }
    }

    private async updateRates(): Promise<void> {
        try {
            const exchangeRates = await this.getExchangeRatesFromBCV();
            this.usdRate = exchangeRates._dolar;
            this.eurRate = exchangeRates._euro;
            this.lastUpdated = Date.now();
        } catch (error) {
            console.error('Error fetching exchange rates from BCV:', error);
            throw error; // Propagar para que el servicio use fallback
        }
    }

    private async getExchangeRatesFromBCV() {
        const result = await axios.get("https://www.bcv.org.ve", { httpsAgent: this.httpsAgent });
        const $ = cheerio.load(result.data as string);
        const dolar = this.formatExchangeRate($("#dolar").text());
        const euro = this.formatExchangeRate($("#euro").text());
        return {
            _dolar: dolar,
            _euro: euro,
        };
    }

    private formatExchangeRate(exchangeRate: string): number {
        const value = exchangeRate
            .replace(/(\r\n|\n|\r)/gm, "")
            .replace("USD", "")
            .replace("EUR", "")
            .trim()
            .replace(",", ".");
        return parseFloat(value);
    }
}
