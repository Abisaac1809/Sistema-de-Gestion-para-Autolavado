import { Request, Response, NextFunction } from 'express';
import IPaymentMethodService from '../interfaces/IServices/IPaymentMethodService';
import { PaymentMethodToCreateType, PaymentMethodToUpdateType } from '../schemas/PaymentMethod.schema';
import { PaymentMethodFiltersForService } from '../types/dtos/PaymentMethod.dto';

export default class PaymentMethodController {
    constructor(private paymentMethodService: IPaymentMethodService) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const paymentMethodData: PaymentMethodToCreateType = req.body;
            const newPaymentMethod = await this.paymentMethodService.create(paymentMethodData);
            res.status(201).json({
                message: 'Payment method created successfully',
                paymentMethod: newPaymentMethod,
            });
        } catch (error) {
            next(error);
        }
    };

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Payment method ID is required' });
                return;
            }
            const paymentMethod = await this.paymentMethodService.getById(id);
            res.status(200).json({
                message: 'Payment method retrieved successfully',
                paymentMethod,
            });
        } catch (error) {
            next(error);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters: PaymentMethodFiltersForService = res.locals.validatedQuery;
            const result = await this.paymentMethodService.getAll(filters);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Payment method ID is required' });
                return;
            }
            const paymentMethodData: PaymentMethodToUpdateType = req.body;
            const updatedPaymentMethod = await this.paymentMethodService.update(id, paymentMethodData);
            res.status(200).json({
                message: 'Payment method updated successfully',
                paymentMethod: updatedPaymentMethod,
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Payment method ID is required' });
                return;
            }
            await this.paymentMethodService.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
