import type {
    PublicStoreInfo,
    StoreInfoToUpdateType
} from "@car-wash/types";

export type UseStoreInfoResult = {
    storeInfo: PublicStoreInfo,
    isLoading: boolean
};

export type UseStoreInfoMutations = {
    update: (payload: StoreInfoToUpdateType) => void,
    isUpdating: boolean
};