import Order from "../entities/Order";
import OrderDetail from "../entities/OrderDetail";
import { PublicOrder, PublicOrderListItem, OrderSummary, OrderItemSummary } from "../types/dtos/Order.dto";
import { PublicOrderDetail } from "../types/dtos/OrderDetail.dto";
import { OrderStatus } from "../types/enums";
import CustomerMapper from "./CustomerMapper";
import ProductMapper from "./ProductMapper";
import ServiceMapper from "./ServiceMapper";

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
            totalEstimated: order.totalEstimated,
            startedAt: order.startedAt,
            completedAt: order.completedAt,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            customer: CustomerMapper.toPublic(order.customer),
            orderDetails: order.orderDetails.map((detail) =>
                this.toPublicOrderDetail(detail)
            ),
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
            totalEstimated: order.totalEstimated,
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
            // Edge case: should never happen with proper validation
            return {
                type: 'service' as const,
                name: 'Unknown',
                quantity: detail.quantity,
            };
        });

        return {
            id: order.id,
            status: order.status,
            totalEstimated: order.totalEstimated,
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

static calculateDurations(order: Order): {
    pendingMinutes: number | null;
    inProgressMinutes: number | null;
    totalMinutes: number | null;
} {
    const now = new Date();
    
    let pendingMinutes: number | null = null;
    let inProgressMinutes: number | null = null;
    let totalMinutes: number | null = null;
    
    // Calculate pendingMinutes
    if (order.status === OrderStatus.CANCELLED && !order.startedAt) {
        // Cancelled before starting - no pending time
        pendingMinutes = null;
    } else if (order.startedAt) {
        // Order was started - calculate time from creation to start
        pendingMinutes = this.diffInMinutes(order.createdAt, order.startedAt);
    } else {
        // Still pending - calculate time from creation to now
        pendingMinutes = this.diffInMinutes(order.createdAt, now);
    }
    
    // Calculate inProgressMinutes
    if (order.completedAt && order.startedAt) {
        // Order completed - calculate time from start to completion
        inProgressMinutes = this.diffInMinutes(
            order.startedAt,
            order.completedAt,
        );
    } else if (order.status === OrderStatus.IN_PROGRESS && order.startedAt) {
        // Currently in progress - calculate time from start to now
        inProgressMinutes = this.diffInMinutes(order.startedAt, now);
    } else {
        inProgressMinutes = null;
    }
    
    // Calculate totalMinutes
    if (order.completedAt) {
        // Order completed - calculate total time from creation to completion
        totalMinutes = this.diffInMinutes(order.createdAt, order.completedAt);
    } else if (order.status === OrderStatus.CANCELLED) {
        // Order cancelled - calculate time from creation to last update (cancellation time)
        totalMinutes = this.diffInMinutes(order.createdAt, order.updatedAt);
    } else {
        // Order still active - calculate time from creation to now
        totalMinutes = this.diffInMinutes(order.createdAt, now);
    }
    
    return {
        pendingMinutes,
        inProgressMinutes,
        totalMinutes,
    };
}

static calculateTimeInCurrentState(order: Order): number {
    const now = new Date();
    
    switch (order.status) {
        case OrderStatus.PENDING:
        return this.diffInMinutes(order.createdAt, now);
        
        case OrderStatus.IN_PROGRESS:
        // Use startedAt if available, otherwise fall back to createdAt
        return this.diffInMinutes(order.startedAt || order.createdAt, now);
        
        case OrderStatus.COMPLETED:
        // Use completedAt if available, otherwise fall back to updatedAt
        return this.diffInMinutes(order.completedAt || order.updatedAt, now);
        
        case OrderStatus.CANCELLED:
        // Terminal state - return 0
        return 0;
        
        default:
        return 0;
    }
}

private static diffInMinutes(start: Date, end: Date): number {
    return Math.round((end.getTime() - start.getTime()) / 60000);
}
}
