export type {
    StoreInfoToUpdateType,
    PublicStoreInfo,
} from '@car-wash/types';

// Internal type used by StoreInfo entity — not in shared package
export type StoreInfoType = {
    id: string;
    logoUrl: string | null;
    name: string;
    rif: string;
    address: string;
    phone: string;
    updatedAt: Date;
}
