import { Request, Response, NextFunction } from 'express';
import IStoreInfoService from '../interfaces/IServices/IStoreInfoService';
import { StoreInfoToUpdateType } from '../types/dtos/StoreInfo.dto';

export default class StoreInfoController {
    constructor(private storeInfoService: IStoreInfoService) {}

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const storeInfo = await this.storeInfoService.getStoreInfo();
            res.status(200).json({ storeInfo });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: StoreInfoToUpdateType = req.body;
            const storeInfo = await this.storeInfoService.updateStoreInfo(data);
            res.status(200).json({
                message: 'Store info updated successfully',
                storeInfo,
            });
        } catch (error) {
            next(error);
        }
    };
}
