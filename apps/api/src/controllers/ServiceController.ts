import { Request, Response, NextFunction } from 'express';
import IServiceService from '../interfaces/IServices/IServiceService';
import { ServiceToCreateType, ServiceToUpdateType } from '../schemas/Service.schema';
import { ServiceFiltersForService } from '../types/dtos/Service.dto';

export default class ServiceController {
    constructor(private serviceService: IServiceService) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const serviceData: ServiceToCreateType = req.body;
            const newService = await this.serviceService.create(serviceData);
            res.status(201).json({
                message: 'Service created successfully',
                service: newService,
            });
        } catch (error) {
            next(error);
        }
    };

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Service ID is required' });
                return;
            }
            const service = await this.serviceService.getById(id);
            res.status(200).json({
                message: 'Service retrieved successfully',
                service,
            });
        } catch (error) {
            next(error);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Using res.locals.validatedQuery populated by ValidateQueryParams middleware
            const filters: ServiceFiltersForService = res.locals.validatedQuery;
            const result = await this.serviceService.getAll(filters);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Service ID is required' });
                return;
            }
            const serviceData: ServiceToUpdateType = req.body;
            const updatedService = await this.serviceService.update(id, serviceData);
            res.status(200).json({
                message: 'Service updated successfully',
                service: updatedService,
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Service ID is required' });
                return;
            }
            await this.serviceService.softDelete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
