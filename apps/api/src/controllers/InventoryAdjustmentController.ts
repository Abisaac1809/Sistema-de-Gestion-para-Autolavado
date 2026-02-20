import { Request, Response, NextFunction } from 'express';
import IInventoryAdjustmentService from '../interfaces/IServices/IInventoryAdjustmentService';
import { InventoryAdjustmentToCreateType, InventoryAdjustmentFiltersForService } from '../types/dtos/InventoryAdjustment.dto';

export default class InventoryAdjustmentController {
    constructor(private inventoryAdjustmentService: IInventoryAdjustmentService) { }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data: InventoryAdjustmentToCreateType = req.body;
            const result = await this.inventoryAdjustmentService.create(data);
            res.status(201).json({
                message: 'Inventory adjustment created successfully',
                adjustment: result,
            });
        } catch (error) {
            next(error);
        }
    };

    get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const adjustment = await this.inventoryAdjustmentService.getById(id as string);
            res.status(200).json({
                message: 'Inventory adjustment retrieved successfully',
                adjustment,
            });
        } catch (error) {
            next(error);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const filters: InventoryAdjustmentFiltersForService = res.locals.validatedQuery;
            const result = await this.inventoryAdjustmentService.getAll(filters);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };
}
