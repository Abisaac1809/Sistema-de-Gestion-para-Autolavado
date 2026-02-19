import Order from "../entities/Order";
import OrderDetail from "../entities/OrderDetail";
import { PublicOrder, PublicOrderListItem, OrderSummary, OrderItemSummary, OrderDurations } from "../types/dtos/Order.dto";
import { PublicOrderDetail } from "../types/dtos/OrderDetail.dto";
import { OrderStatus } from "../types/enums";
import CustomerMapper from "./CustomerMapper";
import ProductMapper from "./ProductMapper";
import ServiceMapper from "./ServiceMapper";
import PaymentMapper from "./PaymentMapper";

export default class OrderMapper {
    static toPublicOrder(order: Order): PublicOrder {
        const durations = this.calculateDurations(order);

        return {
            id: order.id,
            customerId: order.customer.id,
            vehiclePlate: order.vehiclePlate,
            vehicleModel: order.vehicleModel,
            status: order.status,
            paymentStatus: order.paymentStatus,
            dollarRate: order.dollarRate,
            totalUSD: order.totalUSD,
            totalVES: order.totalVES,
            totalPaidUSD: order.totalPaidUSD,
            totalPaidVES: order.totalPaidVES,
            startedAt: order.startedAt,
            completedAt: order.completedAt,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            customer: CustomerMapper.toPublic(order.customer),
            orderDetails: order.orderDetails.map((detail) =>
                this.toPublicOrderDetail(detail)
            ),
            payments: order.payments?.map(p => PaymentMapper.toPublicPayment(p)) ?? [],
            durations,
        };
    }

    static toPublicOrderDetail(detail: OrderDetail): PublicOrderDetail {
        return {
            id: detail.id,
            orderId: detail.orderId,
            quantity: detail.quantity,
            priceAtTime: detail.priceAtTime,
            subtotal: detail.quantity * detail.priceAtTime,
            service: detail.service ? ServiceMapper.toPublicService(detail.service) : null,
            product: detail.product ? ProductMapper.toPublicProduct(detail.product) : null,
        };
    }

    static toPublicOrderListItem(order: Order): PublicOrderListItem {
        return {
            id: order.id,
            status: order.status,
            totalUSD: order.totalUSD,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            startedAt: order.startedAt,
            completedAt: order.completedAt,
            vehiclePlate: order.vehiclePlate,
            vehicleModel: order.vehicleModel,
            timeInCurrentStateMinutes: this.calculateTimeInCurrentState(order),
            customer: CustomerMapper.toPublic(order.customer),
            orderDetails: order.orderDetails.map((detail) =>
                this.toPublicOrderDetail(detail)
            ),
        };
    }

    static toOrderSummary(order: Order): OrderSummary {
        const items: OrderItemSummary[] = order.orderDetails.map(detail => {
            if (detail.service) {
                return {
                    type: 'service' as const,
                    name: detail.service.name,
                    quantity: detail.quantity,
                };
            } else if (detail.product) {
                return {
                    type: 'product' as const,
                    name: detail.product.name,
                    quantity: detail.quantity,
                };
            }
            return {
                type: 'service' as const,
                name: 'Unknown',
                quantity: detail.quantity,
            };
        });

        return {
            id: order.id,
            status: order.status,
            totalUSD: order.totalUSD,
            totalVES: order.totalVES,
            totalPaidUSD: order.totalPaidUSD,
            totalPaidVES: order.totalPaidVES,
            createdAt: order.createdAt,
            startedAt: order.startedAt,
            completedAt: order.completedAt,
            vehicleModel: order.vehicleModel,
            vehiclePlate: order.vehiclePlate,
            customerName: order.customer.fullName,
            customerDocument: order.customer.idNumber,
            customerPhone: order.customer.phone,
            items,
        };
    }

    static calculateDurations(order: Order): OrderDurations {
        const now = new Date();

        return {
            pendingMinutes: this.calculatePendingMinutes(order, now),
            inProgressMinutes: this.calculateInProgressMinutes(order, now),
            totalMinutes: this.calculateTotalMinutes(order, now),
        };
    }

    private static calculatePendingMinutes(order: Order, now: Date): number | null {
        if (order.status === OrderStatus.CANCELLED && !order.startedAt) {
            // Cancelada antes de iniciar - sin tiempo pendiente
            return null;
        } else if (order.startedAt) {
            // Orden iniciada - calcular tiempo desde la creación hasta el inicio
            return this.diffInMinutes(order.createdAt, order.startedAt);
        } else {
            // Aún pendiente - calcular tiempo desde la creación hasta ahora
            return this.diffInMinutes(order.createdAt, now);
        }
    }

    private static calculateInProgressMinutes(order: Order, now: Date): number | null {
        if (order.completedAt && order.startedAt) {
            // Orden completada - calcular tiempo desde el inicio hasta la finalización
            return this.diffInMinutes(order.startedAt, order.completedAt);
        } else if (order.status === OrderStatus.IN_PROGRESS && order.startedAt) {
            // Actualmente en progreso - calcular tiempo desde el inicio hasta ahora
            return this.diffInMinutes(order.startedAt, now);
        } else {
            return null;
        }
    }

    private static calculateTotalMinutes(order: Order, now: Date): number | null {
        if (order.completedAt) {
            // Orden completada - calcular tiempo total desde la creación hasta la finalización
            return this.diffInMinutes(order.createdAt, order.completedAt);
        } else if (order.status === OrderStatus.CANCELLED) {
            // Orden cancelada - calcular tiempo desde la creación hasta la última actualización (momento de cancelación)
            return this.diffInMinutes(order.createdAt, order.updatedAt);
        } else {
            // Orden aún activa - calcular tiempo desde la creación hasta ahora
            return this.diffInMinutes(order.createdAt, now);
        }
    }

    static calculateTimeInCurrentState(order: Order): number {
        const now = new Date();

        switch (order.status) {
            case OrderStatus.PENDING:
                return this.diffInMinutes(order.createdAt, now);

            case OrderStatus.IN_PROGRESS:
                // Usar startedAt si está disponible, de lo contrario usar createdAt
                return this.diffInMinutes(order.startedAt || order.createdAt, now);

            case OrderStatus.COMPLETED:
                // Usar completedAt si está disponible, de lo contrario usar updatedAt
                return this.diffInMinutes(order.completedAt || order.updatedAt, now);

            case OrderStatus.CANCELLED:
                // Estado terminal - retornar 0
                return 0;

            default:
                return 0;
        }
    }

    private static diffInMinutes(start: Date, end: Date): number {
        return Math.round((end.getTime() - start.getTime()) / 60000);
    }
}
