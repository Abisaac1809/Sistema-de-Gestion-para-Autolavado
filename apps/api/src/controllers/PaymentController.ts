import { Request, Response, NextFunction } from "express";
import IPaymentService from "../interfaces/IServices/IPaymentService";
import { PaymentToCreateType } from "../schemas/Payment.schema";
import { PaymentFiltersForService } from "../types/dtos/Payment.dto";

export default class PaymentController {
  constructor(private paymentService: IPaymentService) {}

  addPaymentToOrder = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const orderId = req.params.id ?? req.params.orderId;
      if (!orderId || typeof orderId !== "string") {
        res.status(400).json({ message: "Order ID is required" });
        return;
      }
      const paymentData: PaymentToCreateType = req.body;
      const newPayment = await this.paymentService.addPaymentToOrder(
        orderId,
        paymentData,
      );
      res.status(201).json({
        message: "Payment added successfully",
        payment: newPayment,
      });
    } catch (error) {
      next(error);
    }
  };

  addPaymentToSale = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const saleId = req.params.id ?? req.params.saleId;
      if (!saleId || typeof saleId !== "string") {
        res.status(400).json({ message: "Sale ID is required" });
        return;
      }
      const paymentData: PaymentToCreateType = req.body;
      const newPayment = await this.paymentService.addPaymentToSale(
        saleId,
        paymentData,
      );
      res.status(201).json({
        message: "Payment added successfully",
        payment: newPayment,
      });
    } catch (error) {
      next(error);
    }
  };

  listByOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orderId = req.params.id ?? req.params.orderId;
      if (!orderId || typeof orderId !== "string") {
        res.status(400).json({ message: "Order ID is required" });
        return;
      }
      const queryFilters = res.locals.validatedQuery;
      const filters: PaymentFiltersForService = {
        orderId,
        page: queryFilters.page,
        limit: queryFilters.limit,
      };
      const result = await this.paymentService.listPaymentsByTarget(filters);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  listBySale = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const saleId = req.params.id ?? req.params.saleId;
      if (!saleId || typeof saleId !== "string") {
        res.status(400).json({ message: "Sale ID is required" });
        return;
      }
      const queryFilters = res.locals.validatedQuery;
      const filters: PaymentFiltersForService = {
        saleId,
        page: queryFilters.page,
        limit: queryFilters.limit,
      };
      const result = await this.paymentService.listPaymentsByTarget(filters);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id || typeof id !== "string") {
        res.status(400).json({ message: "Payment ID is required" });
        return;
      }
      const payment = await this.paymentService.getPaymentById(id);
      res.status(200).json({
        message: "Payment retrieved successfully",
        payment,
      });
    } catch (error) {
      next(error);
    }
  };
}
