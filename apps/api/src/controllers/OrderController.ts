import { Request, Response, NextFunction } from 'express';
import IOrderService from '../interfaces/IServices/IOrderService';
import { OrderToCreateType, OrderToUpdateType, OrderStatusChangeType, OrderFiltersForService } from '../types/dtos/Order.dto';
import { OrderDetailToCreateType } from '../types/dtos/OrderDetail.dto';

export default class OrderController {
    constructor(private orderService: IOrderService) { }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orderData: OrderToCreateType = req.body;
            console.log('📦 Creating order with data:', JSON.stringify(orderData, null, 2));
            const newOrder = await this.orderService.createOrder(orderData);
            res.status(201).json({
                message: 'Order created successfully',
                order: newOrder,
            });
        } catch (error) {
            next(error);
        }
    };

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Order ID is required' });
                return;
            }
            const order = await this.orderService.getOrderById(id);
            res.status(200).json({
                message: 'Order retrieved successfully',
                order,
            });
        } catch (error) {
            next(error);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters: OrderFiltersForService = res.locals.validatedQuery;
            const result = await this.orderService.getListOfOrders(filters);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Order ID is required' });
                return;
            }
            const orderData: OrderToUpdateType = req.body;
            const updatedOrder = await this.orderService.updateOrder(id, orderData);
            res.status(200).json({
                message: 'Order updated successfully',
                order: updatedOrder,
            });
        } catch (error) {
            next(error);
        }
    };

    changeStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Order ID is required' });
                return;
            }
            const statusData: OrderStatusChangeType = req.body;
            const updatedOrder = await this.orderService.changeOrderStatus(id, statusData);
            res.status(200).json({
                message: 'Order status updated successfully',
                order: updatedOrder,
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Order ID is required' });
                return;
            }
            await this.orderService.deleteOrder(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    addDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Order ID is required' });
                return;
            }
            const detailData: OrderDetailToCreateType = req.body;
            const newDetail = await this.orderService.addOrderDetail(id, detailData);
            res.status(201).json({
                message: 'Order detail added successfully',
                orderDetail: newDetail,
            });
        } catch (error) {
            next(error);
        }
    };

    removeDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id, detailId } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Order ID is required' });
                return;
            }
            if (!detailId || typeof detailId !== 'string') {
                res.status(400).json({ message: 'Order detail ID is required' });
                return;
            }
            await this.orderService.removeOrderDetail(id, detailId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
