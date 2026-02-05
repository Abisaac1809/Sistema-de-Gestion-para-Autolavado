import Service from '../../entities/Service';
import { ServiceToCreateType, ServiceToUpdateType } from '../../schemas/Service.schema';
import { ServiceFiltersForRepository, ServiceFiltersForCount } from '../../types/dtos/Service.dto';

export default interface IServiceRepository {
    create(data: ServiceToCreateType): Promise<Service>;
    getById(id: string): Promise<Service | null>;
    getAll(filters: ServiceFiltersForRepository): Promise<Service[]>;
    update(id: string, data: ServiceToUpdateType): Promise<Service>;
    softDelete(id: string): Promise<void>;
    restore(id: string): Promise<Service>;
    getByName(name: string): Promise<Service | null>;
    getBulkByIds(ids: string[]): Promise<Service[]>;
    count(filters: ServiceFiltersForCount): Promise<number>;
}
