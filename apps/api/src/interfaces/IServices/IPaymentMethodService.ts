import { PaymentMethodToCreateType, PaymentMethodToUpdateType } from '../../schemas/PaymentMethod.schema';
import {
    PaymentMethodFiltersForService,
    ListOfPaymentMethods,
    PublicPaymentMethod,
} from '../../types/dtos/PaymentMethod.dto';

export default interface IPaymentMethodService {
    create(data: PaymentMethodToCreateType): Promise<PublicPaymentMethod>;
    getById(id: string): Promise<PublicPaymentMethod>;
    getAll(filters: PaymentMethodFiltersForService): Promise<ListOfPaymentMethods>;
    update(id: string, data: PaymentMethodToUpdateType): Promise<PublicPaymentMethod>;
    delete(id: string): Promise<void>;
}
