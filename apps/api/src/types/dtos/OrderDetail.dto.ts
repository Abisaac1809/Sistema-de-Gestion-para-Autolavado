import Service from '../../entities/Service';
import Product from '../../entities/Product';

export type {
    OrderDetailToCreateType,
    OrderDetailToSave,
    OrderDetailRecord,
    PublicOrderDetail,
} from '@car-wash/types';

// Internal type using entity classes — not in shared package
export type OrderDetailType = {
    id: string;
    orderId: string;
    quantity: number;
    priceAtTime: number;
    service: Service | null;
    product: Product | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
