import { Router } from "express";
import PaymentController from "../controllers/PaymentController";
import IPaymentService from "../interfaces/IServices/IPaymentService";
import validateSchema from "../middlewares/ValidateSchema";
import validateQueryParams from "../middlewares/ValidateQueryParams";
import { PaymentToCreate, PaymentFilters } from "../schemas/Payment.schema";

// Router for /api/orders/:orderId/payments routes
// Mounted in OrderRouter as sub-router
export function createOrderPaymentsRouter(
  paymentService: IPaymentService,
): Router {
  const router = Router({ mergeParams: true });
  const controller = new PaymentController(paymentService);

  // POST /api/orders/:orderId/payments - Add payment to order
  router.post(
    "/",
    validateSchema(PaymentToCreate),
    controller.addPaymentToOrder,
  );

  // GET /api/orders/:orderId/payments - List payments for order
  router.get("/", validateQueryParams(PaymentFilters), controller.listByOrder);

  return router;
}

// Router for /api/sales/:saleId/payments routes
// Mounted in SaleRouter as sub-router
export function createSalePaymentsRouter(
  paymentService: IPaymentService,
): Router {
  const router = Router({ mergeParams: true });
  const controller = new PaymentController(paymentService);

  // POST /api/sales/:saleId/payments - Add payment to sale
  router.post(
    "/",
    validateSchema(PaymentToCreate),
    controller.addPaymentToSale,
  );

  // GET /api/sales/:saleId/payments - List payments for sale
  router.get("/", validateQueryParams(PaymentFilters), controller.listBySale);

  return router;
}

// Router for /api/payments routes (standalone)
export function createPaymentsRouter(paymentService: IPaymentService): Router {
  const router = Router();
  const controller = new PaymentController(paymentService);

  // GET /api/payments/:id - Get single payment detail
  router.get("/:id", controller.getById);

  return router;
}
