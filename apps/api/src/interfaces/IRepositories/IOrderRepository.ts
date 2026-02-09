import Order from '../../entities/Order';
import { OrderToSave, OrderToUpdateType } from '../../types/dtos/Order.dto';
import { OrderFiltersForRepository, OrderFiltersForCount } from '../../types/dtos/Order.dto';
import { OrderStatus } from '../../types/enums';

export default interface IOrderRepository {
    create(data: OrderToSave): Promise<Order>;
    getById(id: string): Promise<Order | null>;
    list(filters: OrderFiltersForRepository): Promise<Order[]>;
    count(filters: OrderFiltersForCount): Promise<number>;

    update(id: string, data: OrderToUpdateType): Promise<Order>;
    updateStatus(id: string, status: OrderStatus, timestamps: {
        startedAt?: Date;
        completedAt?: Date;
    }): Promise<Order>;
    updateTotal(id: string, totalEstimated: number): Promise<Order>;
    softDelete(id: string): Promise<void>;
}
