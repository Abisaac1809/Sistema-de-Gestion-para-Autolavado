import { Router } from "express";
import PaymentController from "../controllers/PaymentController";
import IPaymentService from "../interfaces/IServices/IPaymentService";

export default function createPaymentRouter(
  paymentService: IPaymentService,
): Router {
  const router = Router();
  const controller = new PaymentController(paymentService);

  router.get("/:id", controller.get);

  return router;
}
