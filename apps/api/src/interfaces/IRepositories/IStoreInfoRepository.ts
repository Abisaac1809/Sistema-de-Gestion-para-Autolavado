import StoreInfo from "../../entities/StoreInfo";
import { StoreInfoToUpdateType } from "../../types/dtos/StoreInfo.dto";

export default interface IStoreInfoRepository {
    getStoreInfo(): Promise<StoreInfo>;
    updateStoreInfo(data: StoreInfoToUpdateType): Promise<StoreInfo>;
}