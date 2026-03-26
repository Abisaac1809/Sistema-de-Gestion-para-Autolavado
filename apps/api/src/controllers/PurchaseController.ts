import { Request, Response, NextFunction } from 'express';
import IPurchaseService from '../interfaces/IServices/IPurchaseService';
import { PurchaseToCreateType } from '@car-wash/types';
import { PurchaseFiltersForService } from '../types/dtos/Purchase.dto';

export default class PurchaseController {
    constructor(private purchaseService: IPurchaseService) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: PurchaseToCreateType = req.body;
            const purchase = await this.purchaseService.create(data);
            res.status(201).json({
                message: 'Purchase created successfully',
                purchase,
            });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const purchase = await this.purchaseService.getById(id as string);
            res.status(200).json({
                message: 'Purchase retrieved successfully',
                purchase,
            });
        } catch (error) {
            next(error);
        }
    };

    getMany = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters: PurchaseFiltersForService = res.locals.validatedQuery;
            const result = await this.purchaseService.getMany(filters);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    softDelete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            await this.purchaseService.softDelete(id as string);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
