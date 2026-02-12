import {
    OrderToCreateType,
    OrderToUpdateType,
    OrderStatusChangeType,
    PublicOrder,
    OrderFiltersForService,
    ListOfOrders,
} from '../../types/dtos/Order.dto';
import { PublicOrderDetail, OrderDetailToCreateType } from '../../types/dtos/OrderDetail.dto';
import { PaymentStatus } from '../../types/enums';

export default interface IOrderService {
    createOrder(data: OrderToCreateType): Promise<PublicOrder>;
    getOrderById(id: string): Promise<PublicOrder>;
    getListOfOrders(filters: OrderFiltersForService): Promise<ListOfOrders>;
    updateOrder(id: string, data: OrderToUpdateType): Promise<PublicOrder>;
    changeOrderStatus(id: string, data: OrderStatusChangeType): Promise<PublicOrder>;
    updatePaymentStatus(id: string, status: PaymentStatus): Promise<PublicOrder>;
    deleteOrder(id: string): Promise<void>;
    addOrderDetail(orderId: string, data: OrderDetailToCreateType): Promise<PublicOrder>;
    removeOrderDetail(orderId: string, detailId: string): Promise<void>;
}
