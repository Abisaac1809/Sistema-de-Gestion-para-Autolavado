import ISaleService from '../interfaces/IServices/ISaleService';
import ISaleRepository from '../interfaces/IRepositories/ISaleRepository';
import IProductRepository from '../interfaces/IRepositories/IProductRepository';
import IServiceRepository from '../interfaces/IRepositories/IServiceRepository';
import IOrderRepository from '../interfaces/IRepositories/IOrderRepository';
import IPaymentMethodRepository from '../interfaces/IRepositories/IPaymentMethodRepository';
import IPaymentRepository from '../interfaces/IRepositories/IPaymentRepository';
import IExchangeRateService from '../interfaces/IServices/IExchangeRateService';
import {
    SaleToSave,
    SaleDetailType,
    SalePaymentToSave,
    PublicSale,
    SaleFiltersForService,
    ListOfSales,
} from '../types/dtos/Sale.dto';
import { SaleToCreateType } from '../schemas/Sale.schema';
import { SaleStatus, OrderStatus, PaymentStatus } from '../types/enums';
import {
    SaleNotFoundError,
    InvalidSaleStatusTransitionError,
    OrderNotFoundError,
    OrderAlreadyHasSaleError,
    InvalidOrderForSaleError,
    ProductNotFoundError,
    InsufficientStockError,
    ServiceNotFoundError,
    ServiceInactiveError,
    PaymentMethodNotFoundError,
    PaymentMethodInactiveError,
    SalePaymentsTotalMismatchError,
} from '../errors/BusinessErrors';
import SaleMapper from '../mappers/SaleMapper';

export default class SaleService implements ISaleService {
    private readonly VALID_TRANSITIONS: Record<SaleStatus, SaleStatus[]> = {
        [SaleStatus.COMPLETED]: [SaleStatus.REFUNDED],
        [SaleStatus.REFUNDED]: [SaleStatus.CANCELLED],
        [SaleStatus.CANCELLED]: [],
    };

    private readonly ROUNDING_TOLERANCE = 0.01;

    constructor(
        private saleRepository: ISaleRepository,
        private productRepository: IProductRepository,
        private serviceRepository: IServiceRepository,
        private orderRepository: IOrderRepository,
        private exchangeService: IExchangeRateService,
        private paymentMethodRepository: IPaymentMethodRepository,
        private paymentRepository: IPaymentRepository,
    ) { }

    async createQuickSale(data: SaleToCreateType): Promise<PublicSale> {
        const dollarRate = await this.exchangeService.getCurrentRate();

        // Validate payment methods in bulk (1 query)
        const paymentMethodIds = data.payments.map(p => p.paymentMethodId);
        const paymentMethods = await this.paymentMethodRepository.getBulkByIds(paymentMethodIds);
        for (const payment of data.payments) {
            const method = paymentMethods.find(pm => pm.id === payment.paymentMethodId);
            if (!method) {
                throw new PaymentMethodNotFoundError(`Payment method ${payment.paymentMethodId} not found`);
            }
            if (!method.isActive) {
                throw new PaymentMethodInactiveError(`Payment method "${method.name}" is inactive`);
            }
        }

        const resolvedDetails: SaleDetailType[] = [];
        const productsToDeduct: Array<{ id: string; newStock: number }> = [];

        for (const detail of data.details) {
            if (detail.serviceId) {
                const service = await this.serviceRepository.getById(detail.serviceId);
                if (!service) {
                    throw new ServiceNotFoundError(`Service with ID ${detail.serviceId} not found`);
                }
                if (!service.status) {
                    throw new ServiceInactiveError(`Service "${service.name}" is inactive and cannot be sold`);
                }

                const unitPrice = detail.unitPrice ?? service.price;
                resolvedDetails.push({
                    serviceId: detail.serviceId,
                    productId: undefined,
                    quantity: detail.quantity,
                    unitPrice,
                    subtotal: detail.quantity * unitPrice,
                });
            } else if (detail.productId) {
                const product = await this.productRepository.get(detail.productId);
                if (!product) {
                    throw new ProductNotFoundError(`Product with ID ${detail.productId} not found`);
                }

                if (product.stock < detail.quantity) {
                    throw new InsufficientStockError(
                        `Product "${product.name}" has insufficient stock. Available: ${product.stock}, Requested: ${detail.quantity}`
                    );
                }

                const unitPrice = detail.unitPrice ?? product.costPrice;
                resolvedDetails.push({
                    serviceId: undefined,
                    productId: detail.productId,
                    quantity: detail.quantity,
                    unitPrice,
                    subtotal: detail.quantity * unitPrice,
                });

                productsToDeduct.push({
                    id: detail.productId,
                    newStock: product.stock - detail.quantity,
                });
            }
        }

        await this.productRepository.bulkUpdateStock(productsToDeduct);

        const totalUsd = resolvedDetails.reduce((sum, d) => sum + d.subtotal, 0);
        const totalVes = totalUsd * dollarRate;

        // Process payments (currency conversion)
        const processedPayments: SalePaymentToSave[] = data.payments.map(payment => {
            if (payment.amountUsd !== undefined) {
                return {
                    paymentMethodId: payment.paymentMethodId,
                    amountUsd: payment.amountUsd,
                    exchangeRate: dollarRate,
                    amountVes: Math.round(payment.amountUsd * dollarRate * 100) / 100,
                    originalCurrency: 'USD' as const,
                    notes: payment.notes,
                };
            } else {
                const amountVes = payment.amountVes!;
                return {
                    paymentMethodId: payment.paymentMethodId,
                    amountUsd: Math.round((amountVes / dollarRate) * 100) / 100,
                    exchangeRate: dollarRate,
                    amountVes,
                    originalCurrency: 'VES' as const,
                    notes: payment.notes,
                };
            }
        });

        // Validate payments total matches sale total
        const paymentsTotal = processedPayments.reduce((sum, p) => sum + p.amountUsd, 0);
        if (Math.abs(paymentsTotal - totalUsd) > this.ROUNDING_TOLERANCE) {
            throw new SalePaymentsTotalMismatchError(
                `Payments total (${paymentsTotal.toFixed(2)} USD) does not match sale total (${totalUsd.toFixed(2)} USD)`
            );
        }

        const saleData: SaleToSave = {
            customerId: data.customerId,
            dollarRate,
            totalUsd,
            totalVes,
            details: resolvedDetails,
            payments: processedPayments,
        };

        const sale = await this.saleRepository.create(saleData);

        return SaleMapper.toPublicSale(sale);
    }

    async createFromOrder(orderId: string): Promise<PublicSale> {
        const order = await this.orderRepository.getById(orderId);
        if (!order) {
            throw new OrderNotFoundError(`Order with ID ${orderId} not found`);
        }

        if (order.status !== OrderStatus.COMPLETED) {
            throw new InvalidOrderForSaleError(
                `Order must be in COMPLETED status to create a sale. Current status: ${order.status}`
            );
        }

        if (order.paymentStatus !== PaymentStatus.PAID) {
            throw new InvalidOrderForSaleError(
                `Order payment must be PAID to create a sale. Current payment status: ${order.paymentStatus}`
            );
        }

        const existingSales = await this.saleRepository.list({
            orderId,
            limit: 1,
            offset: 0,
        });
        if (existingSales.length > 0) {
            throw new OrderAlreadyHasSaleError(`Order ${orderId} already has a sale associated with it`);
        }

        const dollarRate = await this.exchangeService.getCurrentRate();

        const saleDetails: SaleDetailType[] = order.orderDetails.map((detail) => ({
            serviceId: detail.serviceId ?? undefined,
            productId: detail.productId ?? undefined,
            quantity: detail.quantity,
            unitPrice: detail.priceAtTime,
            subtotal: detail.quantity * detail.priceAtTime,
        }));

        const totalUsd = saleDetails.reduce((sum, d) => sum + d.subtotal, 0);
        const totalVes = totalUsd * dollarRate;

        const saleData: SaleToSave = {
            customerId: order.customerId,
            orderId: order.id,
            dollarRate,
            totalUsd,
            totalVes,
            details: saleDetails,
        };

        const sale = await this.saleRepository.create(saleData);

        return SaleMapper.toPublicSale(sale);
    }

    async createSaleFromOrder(orderId: string): Promise<PublicSale> {
        const order = await this.orderRepository.getById(orderId);
        if (!order) {
            throw new OrderNotFoundError(`Order with ID ${orderId} not found`);
        }

        const dollarRate = await this.exchangeService.getCurrentRate();

        const saleDetails: SaleDetailType[] = order.orderDetails.map((detail) => ({
            serviceId: detail.serviceId ?? undefined,
            productId: detail.productId ?? undefined,
            quantity: detail.quantity,
            unitPrice: detail.priceAtTime,
            subtotal: detail.quantity * detail.priceAtTime,
        }));

        const totalUsd = saleDetails.reduce((sum, d) => sum + d.subtotal, 0);
        const totalVes = totalUsd * dollarRate;

        const saleData: SaleToSave = {
            customerId: order.customerId,
            orderId: order.id,
            dollarRate,
            totalUsd,
            totalVes,
            details: saleDetails,
        };

        const sale = await this.saleRepository.create(saleData);

        await this.paymentRepository.linkPaymentsToSale(orderId, sale.id);

        return SaleMapper.toPublicSale(sale);
    }

    async getById(id: string): Promise<PublicSale> {
        const sale = await this.saleRepository.getById(id);
        if (!sale) {
            throw new SaleNotFoundError(`Sale with ID ${id} not found`);
        }

        return SaleMapper.toPublicSale(sale);
    }

    async list(filters: SaleFiltersForService): Promise<ListOfSales> {
        const offset = (filters.page - 1) * filters.limit;

        const [sales, totalRecords] = await Promise.all([
            this.saleRepository.list({
                search: filters.search,
                status: filters.status,
                orderId: filters.orderId,
                fromDate: filters.fromDate,
                toDate: filters.toDate,
                limit: filters.limit,
                offset,
            }),
            this.saleRepository.count({
                search: filters.search,
                status: filters.status,
                orderId: filters.orderId,
                fromDate: filters.fromDate,
                toDate: filters.toDate,
            }),
        ]);

        const totalPages = Math.ceil(totalRecords / filters.limit);

        return {
            data: sales.map((sale) => SaleMapper.toPublicSale(sale)),
            meta: {
                totalRecords,
                currentPage: filters.page,
                limit: filters.limit,
                totalPages,
            },
        };
    }

    async updateStatus(id: string, status: SaleStatus): Promise<PublicSale> {
        const sale = await this.saleRepository.getById(id);
        if (!sale) {
            throw new SaleNotFoundError(`Sale with ID ${id} not found`);
        }

        if (!this.VALID_TRANSITIONS[sale.status].includes(status)) {
            throw new InvalidSaleStatusTransitionError(
                `Cannot transition from ${sale.status} to ${status}. Valid transitions: ${this.VALID_TRANSITIONS[sale.status].join(', ')}`
            );
        }

        const updatedSale = await this.saleRepository.updateStatus(id, status);

        return SaleMapper.toPublicSale(updatedSale);
    }
}
