import IOrderService from '../interfaces/IServices/IOrderService';
import IOrderRepository from '../interfaces/IRepositories/IOrderRepository';
import IOrderDetailRepository from '../interfaces/IRepositories/IOrderDetailRepository';
import { ICustomerRepository } from '../interfaces/IRepositories/ICustomerRepository';
import IProductRepository from '../interfaces/IRepositories/IProductRepository';
import IServiceRepository from '../interfaces/IRepositories/IServiceRepository';
import IExchangeService from '../interfaces/IServices/IExchangeService';
import {
    OrderToCreateType,
    OrderToUpdateType,
    OrderStatusChangeType,
    PublicOrder,
    OrderFiltersForService,
    ListOfOrders,
    OrderSummary,
} from '../types/dtos/Order.dto';
import { PublicOrderDetail, OrderDetailToCreateType } from '../types/dtos/OrderDetail.dto';
import {
    OrderNotFoundError,
    CustomerNotFoundError,
    ServiceNotFoundError,
    ServiceInactiveError,
    ProductNotFoundError,
    InsufficientStockError,
    OrderDetailNotFoundError,
    InvalidOrderDetailError,
    InvalidOrderStatusTransitionError,
} from '../errors/BusinessErrors';
import OrderMapper from '../mappers/OrderMapper';
import { OrderStatus, PaymentStatus } from '../types/enums';

export default class OrderService implements IOrderService {
    private readonly VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
        [OrderStatus.PENDING]: [OrderStatus.IN_PROGRESS, OrderStatus.CANCELLED],
        [OrderStatus.IN_PROGRESS]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
        [OrderStatus.COMPLETED]: [OrderStatus.CANCELLED],
        [OrderStatus.CANCELLED]: [],
    };

    constructor(
        private orderRepository: IOrderRepository,
        private orderDetailRepository: IOrderDetailRepository,
        private customerRepository: ICustomerRepository,
        private productRepository: IProductRepository,
        private serviceRepository: IServiceRepository,
        private exchangeRateService: IExchangeService
    ) { }

    async createOrder(data: OrderToCreateType): Promise<PublicOrder> {
        const customer = await this.customerRepository.getById(data.customerId);

        if (!customer) {
            throw new CustomerNotFoundError(`Customer with ID ${data.customerId} not found`);
        }

        const resolvedDetails: OrderDetailToCreateType[] = [];

        const productsToDeduct: Array<{ id: string; newStock: number }> = [];

        for (const detail of data.details) {
            if (detail.serviceId) {
                const service = await this.serviceRepository.getById(detail.serviceId);
                if (!service) {
                    throw new ServiceNotFoundError(`Service with ID ${detail.serviceId} not found`);
                }
                if (!service.status) {
                    throw new ServiceInactiveError(`Service "${service.name}" is inactive and cannot be added to orders`);
                }

                const priceAtTime = detail.priceAtTime ?? service.price;
                resolvedDetails.push({
                    serviceId: detail.serviceId,
                    productId: null,
                    quantity: detail.quantity,
                    priceAtTime,
                });
            }
            else if (detail.productId) {
                const product = await this.productRepository.get(detail.productId);
                if (!product) {
                    throw new ProductNotFoundError(`Product with ID ${detail.productId} not found`);
                }

                if (product.stock < detail.quantity) {
                    throw new InsufficientStockError(
                        `Product "${product.name}" has insufficient stock. Available: ${product.stock}, Requested: ${detail.quantity}`
                    );
                }

                const priceAtTime = detail.priceAtTime ?? product.costPrice;
                resolvedDetails.push({
                    serviceId: null,
                    productId: detail.productId ?? null,
                    quantity: detail.quantity,
                    priceAtTime,
                });

                productsToDeduct.push({
                    id: detail.productId,
                    newStock: product.stock - detail.quantity,
                });
            }
        }

        const totalUSD = resolvedDetails.reduce(
            (sum, detail) => {
                const price = Number(detail.priceAtTime) || 0;
                const quantity = Number(detail.quantity) || 0;
                return sum + (price * quantity);
            },
            0
        );

        const validTotalUSD = isNaN(totalUSD) || totalUSD < 0 ? 0 : totalUSD;

        const dollarRate = await this.exchangeRateService.getCurrentRate();
        const totalVES = Math.round(validTotalUSD * dollarRate * 100) / 100;

        const createdOrder = await this.orderRepository.create({
            customerId: data.customerId,
            vehiclePlate: data.vehiclePlate ?? null,
            vehicleModel: data.vehicleModel,
            dollarRate,
            totalUSD: validTotalUSD,
            totalVES,
        });

        const detailsToCreate = resolvedDetails.map(detail => ({
            orderId: createdOrder.id,
            serviceId: detail.serviceId ?? null,
            productId: detail.productId ?? null,
            quantity: detail.quantity,
            priceAtTime: detail.priceAtTime ?? 0,
        }));

        await this.orderDetailRepository.createMany(detailsToCreate);
        for (const productUpdate of productsToDeduct) {
            await this.productRepository.updateStock(productUpdate.id, productUpdate.newStock);
        }
        const fullOrder = await this.orderRepository.getById(createdOrder.id);
        if (!fullOrder) {
            throw new OrderNotFoundError(`Order ${createdOrder.id} not found after creation`);
        }
        return OrderMapper.toPublicOrder(fullOrder);
    }

    async getOrderById(id: string): Promise<PublicOrder> {
        const order = await this.orderRepository.getById(id);
        if (!order) {
            throw new OrderNotFoundError(`Order with ID ${id} not found`);
        }

        return OrderMapper.toPublicOrder(order);
    }

    async getListOfOrders(filters: OrderFiltersForService): Promise<ListOfOrders> {
        const offset = (filters.page - 1) * filters.limit;

        const [orders, totalRecords] = await Promise.all([
            this.orderRepository.list({
                search: filters.search,
                status: filters.status,
                fromDate: filters.fromDate,
                toDate: filters.toDate,
                limit: filters.limit,
                offset,
            }),
            this.orderRepository.count({
                search: filters.search,
                status: filters.status,
                fromDate: filters.fromDate,
                toDate: filters.toDate,
            }),
        ]);

        const data: OrderSummary[] = orders.map(order =>
            OrderMapper.toOrderSummary(order)
        );

        const totalPages = Math.ceil(totalRecords / filters.limit);

        return {
            data,
            meta: {
                totalRecords,
                currentPage: filters.page,
                limit: filters.limit,
                totalPages,
            },
        };
    }

    async updateOrder(id: string, data: OrderToUpdateType): Promise<PublicOrder> {
        const order = await this.orderRepository.getById(id);
        if (!order) {
            throw new OrderNotFoundError(`Order with ID ${id} not found`);
        }

        const updatedOrder = await this.orderRepository.update(id, data);

        return OrderMapper.toPublicOrder(updatedOrder);
    }

    async changeOrderStatus(id: string, data: OrderStatusChangeType): Promise<PublicOrder> {
        const order = await this.orderRepository.getById(id);
        if (!order) {
            throw new OrderNotFoundError(`Order with ID ${id} not found`);
        }

        if (!this.VALID_TRANSITIONS[order.status].includes(data.status)) {
            throw new InvalidOrderStatusTransitionError(
                `Cannot transition from ${order.status} to ${data.status}`
            );
        }

        const timestamps: { startedAt?: Date; completedAt?: Date } = {};
        if (data.status === OrderStatus.IN_PROGRESS) {
            timestamps.startedAt = new Date();
        } else if (data.status === OrderStatus.COMPLETED) {
            timestamps.completedAt = new Date();
        }

        const updatedOrder = await this.orderRepository.updateStatus(id, data.status, timestamps);

        return OrderMapper.toPublicOrder(updatedOrder);
    }

    async updatePaymentStatus(id: string, status: PaymentStatus): Promise<PublicOrder> {
        const order = await this.orderRepository.getById(id);
        if (!order) {
            throw new OrderNotFoundError(`Order with ID ${id} not found`);
        }

        const updatedOrder = await this.orderRepository.updatePaymentStatus(id, status);

        return OrderMapper.toPublicOrder(updatedOrder);
    }

    async deleteOrder(id: string): Promise<void> {
        const order = await this.orderRepository.getById(id);
        if (!order) {
            throw new OrderNotFoundError(`Order with ID ${id} not found`);
        }

        await this.orderRepository.softDelete(id);

        await this.orderDetailRepository.softDeleteByOrderId(id);
    }

    async addOrderDetail(orderId: string, data: OrderDetailToCreateType): Promise<PublicOrder> {
        const order = await this.orderRepository.getById(orderId);
        if (!order) {
            throw new OrderNotFoundError(`Order with ID ${orderId} not found`);
        }

        let priceAtTime: number;
        let productToDeduct: { id: string; newStock: number } | null = null;

        if (data.serviceId) {
            const service = await this.serviceRepository.getById(data.serviceId);
            if (!service) {
                throw new ServiceNotFoundError(`Service with ID ${data.serviceId} not found`);
            }
            if (!service.status) {
                throw new ServiceInactiveError(`Service "${service.name}" is inactive and cannot be added to orders`);
            }

            priceAtTime = data.priceAtTime ?? service.price;
        } else if (data.productId) {
            const product = await this.productRepository.get(data.productId);
            if (!product) {
                throw new ProductNotFoundError(`Product with ID ${data.productId} not found`);
            }

            if (product.stock < data.quantity) {
                throw new InsufficientStockError(
                    `Product "${product.name}" has insufficient stock. Available: ${product.stock}, Requested: ${data.quantity}`
                );
            }

            priceAtTime = data.priceAtTime ?? product.costPrice;

            productToDeduct = {
                id: data.productId,
                newStock: product.stock - data.quantity,
            };
        } else {
            throw new InvalidOrderDetailError('Order detail must have either a serviceId or a productId');
        }

        await this.orderDetailRepository.create({
            orderId,
            serviceId: data.serviceId ?? null,
            productId: data.productId ?? null,
            quantity: data.quantity,
            priceAtTime,
        });

        if (productToDeduct) {
            await this.productRepository.updateStock(productToDeduct.id, productToDeduct.newStock);
        }

        const allDetails = await this.orderDetailRepository.getByOrderId(orderId);
        const newTotal = allDetails.reduce((sum, detail) => sum + detail.quantity * detail.priceAtTime, 0);
        const newTotalVES = Math.round(newTotal * order.dollarRate * 100) / 100;

        await this.orderRepository.updateTotal(orderId, newTotal, newTotalVES);

        const updatedOrder = await this.orderRepository.getById(orderId);
        if (!updatedOrder) {
            throw new OrderNotFoundError(`Order ${orderId} not found after adding detail`);
        }

        return OrderMapper.toPublicOrder(updatedOrder);
    }

    async removeOrderDetail(orderId: string, detailId: string): Promise<void> {
        const order = await this.orderRepository.getById(orderId);
        if (!order) {
            throw new OrderNotFoundError(`Order with ID ${orderId} not found`);
        }

        const detail = await this.orderDetailRepository.getById(detailId);
        if (!detail) {
            throw new OrderDetailNotFoundError(`Order detail with ID ${detailId} not found`);
        }

        if (detail.orderId !== orderId) {
            throw new InvalidOrderDetailError(`Order detail ${detailId} does not belong to order ${orderId}`);
        }

        if (detail.productId) {
            const product = await this.productRepository.get(detail.productId);
            if (product) {
                const newStock = product.stock + detail.quantity;
                await this.productRepository.updateStock(detail.productId, newStock);
            }
        }

        await this.orderDetailRepository.softDelete(detailId);

        const allDetails = await this.orderDetailRepository.getByOrderId(orderId);
        const newTotal = allDetails.reduce((sum, d) => sum + d.quantity * d.priceAtTime, 0);
        const newTotalVES = Math.round(newTotal * order.dollarRate * 100) / 100;

        await this.orderRepository.updateTotal(orderId, newTotal, newTotalVES);
    }
}
