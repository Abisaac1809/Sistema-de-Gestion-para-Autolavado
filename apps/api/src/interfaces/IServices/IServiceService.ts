import { ServiceToCreateType, ServiceToUpdateType } from '../../schemas/Service.schema';
import {
    PublicService,
    ListOfServices,
    ServiceFiltersForService,
} from '../../types/dtos/Service.dto';

export default interface IServiceService {
    create(data: ServiceToCreateType): Promise<PublicService>;
    getById(id: string): Promise<PublicService>;
    getAll(filters: ServiceFiltersForService): Promise<ListOfServices>;
    update(id: string, data: ServiceToUpdateType): Promise<PublicService>;
    softDelete(id: string): Promise<void>;
}
