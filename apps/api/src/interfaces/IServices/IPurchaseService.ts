import { PurchaseToCreateType } from '@car-wash/types';
import {
    PublicPurchase,
    ListOfPurchases,
    PurchaseFiltersForService,
} from '../../types/dtos/Purchase.dto';

export default interface IPurchaseService {
    create(data: PurchaseToCreateType): Promise<PublicPurchase>;
    getById(id: string): Promise<PublicPurchase>;
    getMany(filters: PurchaseFiltersForService): Promise<ListOfPurchases>;
    softDelete(id: string): Promise<void>;
}
