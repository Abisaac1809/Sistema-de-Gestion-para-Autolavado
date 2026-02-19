import { Router } from "express";
import PaymentController from "../controllers/PaymentController";
import IPaymentService from "../interfaces/IServices/IPaymentService";
import validateSchema from "../middlewares/ValidateSchema";
import validateQueryParams from "../middlewares/ValidateQueryParams";
import { PaymentToCreate, PaymentFilters } from "../schemas/Payment.schema";

export function createOrderPaymentsRouter(
  paymentService: IPaymentService,
): Router {
  const router = Router({ mergeParams: true });
  const controller = new PaymentController(paymentService);

  router.post(
    "/",
    validateSchema(PaymentToCreate),
    controller.addPaymentToOrder,
  );

  router.get("/", validateQueryParams(PaymentFilters), controller.listByOrder);

  return router;
}

export function createSalePaymentsRouter(
  paymentService: IPaymentService,
): Router {
  const router = Router({ mergeParams: true });
  const controller = new PaymentController(paymentService);

  router.post(
    "/",
    validateSchema(PaymentToCreate),
    controller.addPaymentToSale,
  );

  router.get("/", validateQueryParams(PaymentFilters), controller.listBySale);

  return router;
}

export function createPaymentsRouter(paymentService: IPaymentService): Router {
  const router = Router();
  const controller = new PaymentController(paymentService);

  router.get("/:id", controller.getById);

  return router;
}
