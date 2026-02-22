import { OrderStatus, PaymentStatus } from '@car-wash/types';
import Customer from '../../entities/Customer';
import OrderDetail from '../../entities/OrderDetail';
import Payment from '../../entities/Payment';

export type {
    OrderToCreateType,
    OrderToUpdateType,
    OrderStatusChangeType,
    OrderFiltersType,
    OrderItemSummary,
    OrderSummary,
    OrderToSave,
    OrderDurations,
    PublicOrder,
    PublicOrderListItem,
    OrderFiltersForService,
    OrderFiltersForRepository,
    OrderFiltersForCount,
    ListOfOrders,
} from '@car-wash/types';

// Internal type using entity classes — not in shared package
export type OrderType = {
    id: string;
    customer: Customer;
    orderDetails: OrderDetail[];
    payments?: Payment[];
    vehiclePlate: string | null;
    vehicleModel: string;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    dollarRate: number;
    totalUSD: number;
    totalVES: number;
    totalPaidUSD: number;
    totalPaidVES: number;
    startedAt: Date | null;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
