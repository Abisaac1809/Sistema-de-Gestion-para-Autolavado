import PaymentMethod from '../../entities/PaymentMethod';
import { PaymentMethodToCreateType, PaymentMethodToUpdateType } from '../../schemas/PaymentMethod.schema';
import { PaymentMethodFiltersForRepository, PaymentMethodFiltersForCount } from '../../types/dtos/PaymentMethod.dto';

export default interface IPaymentMethodRepository {
    create(data: PaymentMethodToCreateType): Promise<PaymentMethod>;
    getById(id: string): Promise<PaymentMethod | null>;
    getAll(filters: PaymentMethodFiltersForRepository): Promise<PaymentMethod[]>;
    update(id: string, data: PaymentMethodToUpdateType): Promise<PaymentMethod>;
    softDelete(id: string): Promise<void>;
    restore(id: string): Promise<PaymentMethod>;
    getByName(name: string): Promise<PaymentMethod | null>;
    getBulkByIds(ids: string[]): Promise<PaymentMethod[]>;
    count(filters: PaymentMethodFiltersForCount): Promise<number>;
}
