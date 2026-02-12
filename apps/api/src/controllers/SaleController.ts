import { Request, Response, NextFunction } from 'express';
import ISaleService from '../interfaces/IServices/ISaleService';
import { SaleToCreateType, SaleStatusChangeType, SaleFiltersType } from '../schemas/Sale.schema';
import { SaleStatus } from '../types/enums';

export default class SaleController {
    constructor(private saleService: ISaleService) { }

    createQuickSale = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const saleData: SaleToCreateType = req.body;
            const newSale = await this.saleService.createQuickSale(saleData);
            res.status(201).json({
                message: 'Sale created successfully',
                sale: newSale,
            });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Sale ID is required' });
                return;
            }
            const sale = await this.saleService.getById(id);
            res.status(200).json({
                message: 'Sale retrieved successfully',
                sale,
            });
        } catch (error) {
            next(error);
        }
    };

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters: SaleFiltersType = res.locals.validatedQuery;
            const result = await this.saleService.list(filters);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    updateStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Sale ID is required' });
                return;
            }
            const { status }: SaleStatusChangeType = req.body;
            if (!status) {
                res.status(400).json({ message: 'Status is required' });
                return;
            }
            const updatedSale = await this.saleService.updateStatus(id, status as SaleStatus);
            res.status(200).json({
                message: 'Sale status updated successfully',
                sale: updatedSale,
            });
        } catch (error) {
            next(error);
        }
    };
}
