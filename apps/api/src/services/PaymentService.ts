import IPaymentService from "../interfaces/IServices/IPaymentService";
import IPaymentRepository from "../interfaces/IRepositories/IPaymentRepository";
import IOrderRepository from "../interfaces/IRepositories/IOrderRepository";
import ISaleRepository from "../interfaces/IRepositories/ISaleRepository";
import IPaymentMethodRepository from "../interfaces/IRepositories/IPaymentMethodRepository";
import IExchangeService from "../interfaces/IServices/IExchangeService";
import { PaymentToCreateType } from "../schemas/Payment.schema";
import {
    PublicPayment,
    PaymentFiltersForService,
    ListOfPayments,
} from "../types/dtos/Payment.dto";
import { PaymentStatus, OrderStatus, SaleStatus } from "../types/enums";
import {
    OrderNotFoundError,
    SaleNotFoundError,
    PaymentNotFoundError,
    PaymentExceedsOrderTotalError,
    PaymentExceedsSaleTotalError,
    OrderAlreadyPaidError,
    SaleAlreadyPaidError,
    InvalidPaymentAmountError,
    PaymentMethodNotFoundError,
    PaymentMethodInactiveError,
    ReversalRequiresNotesError,
} from "../errors/BusinessErrors";
import PaymentMapper from "../mappers/PaymentMapper";

export default class PaymentService implements IPaymentService {
    private readonly ROUNDING_TOLERANCE = 0.01;
        
    constructor(
        private paymentRepository: IPaymentRepository,
        private orderRepository: IOrderRepository,
        private saleRepository: ISaleRepository,
        private paymentMethodRepository: IPaymentMethodRepository,
        private exchangeRateService: IExchangeService
    ) {}
    
    async getPaymentById(id: string): Promise<PublicPayment> {
        const payment = await this.paymentRepository.getById(id);
        
        if (!payment) {
            throw new PaymentNotFoundError(`Payment ${id} not found`);
        }
        
        return PaymentMapper.toPublicPayment(payment);
    }

    async listPaymentsByTarget(filters: PaymentFiltersForService): Promise<ListOfPayments> {
        if (filters.orderId) {
            const order = await this.orderRepository.getById(filters.orderId);
            if (!order) {
                throw new OrderNotFoundError(`Order ${filters.orderId} not found`);
            }
        }
        
        if (filters.saleId) {
            const sale = await this.saleRepository.getById(filters.saleId);
            if (!sale) {
                throw new SaleNotFoundError(`Sale ${filters.saleId} not found`);
            }
        }
        
        const offset = (filters.page - 1) * filters.limit;
        
        const [payments, totalRecords] = await Promise.all([
            this.paymentRepository.listByTarget({
                orderId: filters.orderId,
                saleId: filters.saleId,
                paymentMethodId: filters.paymentMethodId,
                fromDate: filters.fromDate,
                toDate: filters.toDate,
                limit: filters.limit,
                offset,
            }),
            this.paymentRepository.countByTarget({
                orderId: filters.orderId,
                saleId: filters.saleId,
                paymentMethodId: filters.paymentMethodId,
                fromDate: filters.fromDate,
                toDate: filters.toDate,
            }),
        ]);
        
        const totalPages = Math.ceil(totalRecords / filters.limit);
        
        return {
            data: PaymentMapper.toPublicPaymentList(payments),
            meta: {
                totalRecords,
                currentPage: filters.page,
                limit: filters.limit,
                totalPages,
            },
        };
    }

    async addPaymentToOrder(orderId: string, data: PaymentToCreateType): Promise<PublicPayment> {
        const order = await this.orderRepository.getById(orderId);
        if (!order) {
            throw new OrderNotFoundError(`Order ${orderId} not found`);
        }

        if (order.paymentStatus === PaymentStatus.PAID) {
            throw new OrderAlreadyPaidError(
                `Order ${orderId} is already fully paid. No additional payments allowed.`
            );
        }

        const paymentMethod = await this.paymentMethodRepository.getById(data.paymentMethodId);

        if (!paymentMethod) {
            throw new PaymentMethodNotFoundError(
                `Payment method ${data.paymentMethodId} not found`
            );
        }
        if (paymentMethod.deletedAt !== null) {
            throw new PaymentMethodInactiveError("Payment method is inactive");
        }

        if (!paymentMethod.isActive) {
            throw new PaymentMethodInactiveError("Payment method is inactive");
        }

        const exchangeRate = await this.exchangeRateService.getCurrentRate();

        let amountUsd: number;
        let amountVes: number;
        let originalCurrency: 'USD' | 'VES';

        if (data.amountUsd !== undefined) {
            originalCurrency = 'USD';
            amountUsd = data.amountUsd;
            amountVes = Math.round(amountUsd * exchangeRate * 100) / 100;
        } else if (data.amountVes !== undefined) {
            originalCurrency = 'VES';
            amountVes = data.amountVes;
            amountUsd = Math.round((amountVes / exchangeRate) * 100) / 100;
        } else {
            throw new InvalidPaymentAmountError("Must provide amount in either USD or VES");
        }

        if (amountUsd === 0) {
            throw new InvalidPaymentAmountError("Payment amount cannot be zero");
        }

        if (amountUsd < 0) {
            if (!data.notes || data.notes.trim().length === 0) {
                throw new ReversalRequiresNotesError(
                    "Negative payments (reversals) require notes explaining the reason"
                );
            }
        }

        const currentTotal = await this.paymentRepository.sumByOrderId(orderId);
        const newTotal = currentTotal + amountUsd;
        const orderTotal = order.totalEstimated;

        if (amountUsd > 0) {
            if (newTotal > orderTotal + this.ROUNDING_TOLERANCE) {
                throw new PaymentExceedsOrderTotalError(
                    `Payment would exceed order total. Order total: ${orderTotal}, Already paid: ${currentTotal}, This payment: ${amountUsd}`
                );
            }
        }

        const isFullyPaid = newTotal >= orderTotal - this.ROUNDING_TOLERANCE && newTotal > 0;

        if (isFullyPaid && order.status === OrderStatus.COMPLETED) {
            return this.createPaymentWithSale(orderId, {
                paymentMethodId: data.paymentMethodId,
                amountUsd,
                exchangeRate,
                amountVes,
                originalCurrency,
                notes: data.notes ?? null,
            });
        }

        const paymentData = {
            orderId,
            paymentMethodId: data.paymentMethodId,
            amountUsd,
            exchangeRate,
            amountVes,
            originalCurrency,
            ...(data.notes && { notes: data.notes }),
        };

        const createdPayment = await this.paymentRepository.create(paymentData);

        if (isFullyPaid) {
            await this.orderRepository.updatePaymentStatus(
                orderId,
                PaymentStatus.PAID
            );
        } else if (newTotal < orderTotal - this.ROUNDING_TOLERANCE) {
            await this.orderRepository.updatePaymentStatus(
                orderId,
                PaymentStatus.PENDING
            );
        }

        return PaymentMapper.toPublicPayment(createdPayment);
    }

    async addPaymentToSale(saleId: string, data: PaymentToCreateType): Promise<PublicPayment> {
        const sale = await this.saleRepository.getById(saleId);
        if (!sale) {
            throw new SaleNotFoundError(`Sale ${saleId} not found`);
        }

        if (
            sale.status === SaleStatus.CANCELLED ||
            sale.status === SaleStatus.REFUNDED
        ) {
            throw new SaleNotFoundError(
                `Sale ${saleId} is ${sale.status} and cannot accept payments`
            );
        }

        if (sale.paymentStatus === PaymentStatus.PAID) {
            throw new SaleAlreadyPaidError(
                `Sale ${saleId} is already fully paid. No additional payments allowed.`
            );
        }

        const paymentMethod = await this.paymentMethodRepository.getById(
            data.paymentMethodId
        );
        if (!paymentMethod) {
            throw new PaymentMethodNotFoundError(
                `Payment method ${data.paymentMethodId} not found`
            );
        }
        if (paymentMethod.deletedAt !== null) {
            throw new PaymentMethodInactiveError("Payment method is inactive");
        }
        if (!paymentMethod.isActive) {
            throw new PaymentMethodInactiveError("Payment method is inactive");
        }

        const exchangeRate = await this.exchangeRateService.getCurrentRate();

        let amountUsd: number;
        let amountVes: number;
        let originalCurrency: 'USD' | 'VES';

        if (data.amountUsd !== undefined) {
            originalCurrency = 'USD';
            amountUsd = data.amountUsd;
            amountVes = Math.round(amountUsd * exchangeRate * 100) / 100;
        } else if (data.amountVes !== undefined) {
            originalCurrency = 'VES';
            amountVes = data.amountVes;
            amountUsd = Math.round((amountVes / exchangeRate) * 100) / 100;
        } else {
            throw new InvalidPaymentAmountError("Must provide amount in either USD or VES");
        }

        if (amountUsd === 0) {
            throw new InvalidPaymentAmountError("Payment amount cannot be zero");
        }

        if (amountUsd < 0) {
            if (!data.notes || data.notes.trim().length === 0) {
                throw new ReversalRequiresNotesError(
                    "Negative payments (reversals) require notes explaining the reason"
                );
            }
        }

        const currentTotal = await this.paymentRepository.sumBySaleId(saleId);
        const newTotal = currentTotal + amountUsd;
        const saleTotal = sale.total;

        if (amountUsd > 0) {
            if (newTotal > saleTotal + this.ROUNDING_TOLERANCE) {
                throw new PaymentExceedsSaleTotalError(
                    `Payment would exceed sale total. Sale total: ${saleTotal}, Already paid: ${currentTotal}, This payment: ${amountUsd}`
                );
            }
        }

        const isFullyPaid =
        newTotal >= saleTotal - this.ROUNDING_TOLERANCE && newTotal > 0;

        const paymentData = {
            saleId,
            paymentMethodId: data.paymentMethodId,
            amountUsd,
            exchangeRate,
            amountVes,
            originalCurrency,
            ...(data.notes && { notes: data.notes }),
        };

        const createdPayment = await this.paymentRepository.create(paymentData);

        if (isFullyPaid) {
            await this.saleRepository.updatePaymentStatus(saleId, PaymentStatus.PAID);
        } else if (newTotal < saleTotal - this.ROUNDING_TOLERANCE) {
            await this.saleRepository.updatePaymentStatus(
                saleId,
                PaymentStatus.PENDING
            );
        }

        return PaymentMapper.toPublicPayment(createdPayment);
    }
    
    private async createPaymentWithSale(
        orderId: string,
        paymentData: {
            paymentMethodId: string;
            amountUsd: number;
            exchangeRate: number;
            amountVes: number;
            originalCurrency: 'USD' | 'VES';
            notes: string | null;
        }
    ): Promise<PublicPayment> {
        const payment = await this.paymentRepository.create({
            orderId,
            paymentMethodId: paymentData.paymentMethodId,
            amountUsd: paymentData.amountUsd,
            exchangeRate: paymentData.exchangeRate,
            amountVes: paymentData.amountVes,
            originalCurrency: paymentData.originalCurrency,
            ...(paymentData.notes && { notes: paymentData.notes }),
        });
        
        await this.orderRepository.updatePaymentStatus(orderId, PaymentStatus.PAID);
        
        const orderWithDetails = await this.orderRepository.getById(orderId);
        
        if (!orderWithDetails) {
            throw new OrderNotFoundError(`Order ${orderId} not found`);
        }
        
        // Si detail.service existe, se incluye serviceId, si detail.product existe, se incluye productId
        const saleDetails = orderWithDetails.orderDetails.map((detail) => ({
            ...(detail.serviceId && { serviceId: detail.serviceId }),
            ...(detail.productId && { productId: detail.productId }),
            quantity: detail.quantity,
            unitPrice: detail.priceAtTime,
        }));
        
        await this.saleRepository.create({
            customerId: orderWithDetails.customerId,
            orderId,
            dollarRate: paymentData.exchangeRate,
            details: saleDetails,
        });
        
        return PaymentMapper.toPublicPayment(payment);
    }
}
