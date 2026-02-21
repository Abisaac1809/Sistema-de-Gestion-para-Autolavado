import IStoreInfoRepository from "../interfaces/IRepositories/IStoreInfoRepository";
import IStoreInfoService from "../interfaces/IServices/IStoreInfoService";
import { PublicStoreInfo, StoreInfoToUpdateType } from "../types/dtos/StoreInfo.dto";
import StoreInfoMapper from "../mappers/StoreInfoMapper";

export default class StoreInfoService implements IStoreInfoService {
    private repository: IStoreInfoRepository;

    constructor(repository: IStoreInfoRepository) {
        this.repository = repository;
    }

    async getStoreInfo(): Promise<PublicStoreInfo> {
        const storeInfo = await this.repository.getStoreInfo();
        return StoreInfoMapper.toPublicStoreInfo(storeInfo);
    }

    async updateStoreInfo(data: StoreInfoToUpdateType): Promise<PublicStoreInfo> {
        const updated = await this.repository.updateStoreInfo(data);
        return StoreInfoMapper.toPublicStoreInfo(updated);
    }
}
