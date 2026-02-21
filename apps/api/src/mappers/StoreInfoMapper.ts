import StoreInfo from '../entities/StoreInfo';
import { PublicStoreInfo } from '../types/dtos/StoreInfo.dto';

export default class StoreInfoMapper {
    static toPublicStoreInfo(storeInfo: StoreInfo): PublicStoreInfo {
        return {
            logoUrl: storeInfo.logoUrl,
            name: storeInfo.name,
            rif: storeInfo.rif,
            address: storeInfo.address,
            phone: storeInfo.phone,
        };
    }
}
