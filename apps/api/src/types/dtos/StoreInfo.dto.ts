import { StoreInfoToUpdateType } from "../../schemas/StoreInfo.schema";

export type StoreInfoType = {
    id: string;
    logoUrl: string | null;
    name: string;
    rif: string;
    address: string;
    phone: string;
    updatedAt: Date;
}

export type PublicStoreInfo = {
    logoUrl: string | null;
    name: string;
    rif: string;
    address: string;
    phone: string;
}

export { StoreInfoToUpdateType };