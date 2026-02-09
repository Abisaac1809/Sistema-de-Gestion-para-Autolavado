import OrderDetail from '../../entities/OrderDetail';
import { OrderDetailToSave } from '../../types/dtos/OrderDetail.dto';

export default interface IOrderDetailRepository {
    create(data: OrderDetailToSave): Promise<OrderDetail>;
    createMany(data: OrderDetailToSave[]): Promise<OrderDetail[]>;

    getByOrderId(orderId: string): Promise<OrderDetail[]>;
    getById(id: string): Promise<OrderDetail | null>;
    softDelete(id: string): Promise<void>;
    softDeleteByOrderId(orderId: string): Promise<void>;
}
