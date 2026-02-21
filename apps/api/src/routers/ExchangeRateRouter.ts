import { Router } from "express";
import IExchangeRateService from "../interfaces/IServices/IExchangeRateService";
import ExchangeRateController from "../controllers/ExchangeRateController";
import validateSchema from "../middlewares/ValidateSchema";
import { ExchangeRateConfigToUpdate } from "../schemas/ExchangeRateConfig.schema";

export default function createExchangeRateRouter(exchangeRateService: IExchangeRateService): Router {
    const router = Router();
    const controller = new ExchangeRateController(exchangeRateService);

    router.get("/", controller.getExchangeRateConfig);
    router.patch("/", validateSchema(ExchangeRateConfigToUpdate), controller.updateExchangeRateConfig);
    router.post("/sync", controller.syncExchangeRates);

    return router;
}