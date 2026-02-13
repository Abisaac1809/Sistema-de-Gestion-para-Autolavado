import { NextFunction, Request, Response } from "express";
import IExchangeService from "../interfaces/IServices/IExchangeService";

export default class ExchangeRateController {
    private exchangeService: IExchangeService;

    constructor(exchangeService: IExchangeService) {
        this.exchangeService = exchangeService;
    }

    getExchangeRateConfig = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const config = await this.exchangeService.getExchangeRateConfig();
            res.status(200).json(config);
        } catch (error) {
            next(error);
        }
    }

    updateExchangeRateConfig = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updatedConfig = await this.exchangeService.updateExchangeRateConfig(req.body);
            res.status(200).json(updatedConfig);
        } catch (error) {
            next(error);
        }
    }

    syncExchangeRates = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.exchangeService.syncExchangeRates();
            res.status(200).json({ message: "Exchange rates synchronized successfully." });
        } catch (error) {
            next(error);
        }
    }
}