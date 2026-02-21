import { PublicStoreInfo, StoreInfoToUpdateType } from "../../types/dtos/StoreInfo.dto";

export default interface IStoreInfoService {
    getStoreInfo(): Promise<PublicStoreInfo>;
    updateStoreInfo(data: StoreInfoToUpdateType): Promise<PublicStoreInfo>;
}