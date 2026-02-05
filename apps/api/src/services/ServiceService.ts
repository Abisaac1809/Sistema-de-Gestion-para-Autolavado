import IServiceService from '../interfaces/IServices/IServiceService';
import IServiceRepository from '../interfaces/IRepositories/IServiceRepository';
import { ServiceToCreateType, ServiceToUpdateType } from '../schemas/Service.schema';
import {
    ServiceFiltersForService,
    ListOfServices,
    PublicService,
} from '../types/dtos/Service.dto';
import {
    ServiceAlreadyExistsError,
    ServiceNotFoundError,
} from '../errors/BusinessErrors';
import ServiceMapper from '../mappers/ServiceMapper';

export default class ServiceService implements IServiceService {
    constructor(private serviceRepository: IServiceRepository) { }

    async create(data: ServiceToCreateType): Promise<PublicService> {
        const existing = await this.serviceRepository.getByName(data.name);

        if (existing) {
            if (existing.deletedAt !== null) {
                const restored = await this.serviceRepository.restore(existing.id);
                const updated = await this.serviceRepository.update(existing.id, {
                    name: data.name,
                    description: data.description ?? null,
                    price: data.price,

                    status: data.status !== undefined ? data.status : true,
                });
                return ServiceMapper.toPublicService(updated);
            }

            throw new ServiceAlreadyExistsError(
                `Service with name "${data.name}" already exists`
            );
        }

        const newService = await this.serviceRepository.create({
            name: data.name,
            description: data.description ?? null,
            price: data.price,

            status: data.status !== undefined ? data.status : true,
        });

        return ServiceMapper.toPublicService(newService);
    }

    async getById(id: string): Promise<PublicService> {
        const service = await this.serviceRepository.getById(id);

        if (!service) {
            throw new ServiceNotFoundError(`Service with ID ${id} not found`);
        }

        return ServiceMapper.toPublicService(service);
    }

    async getAll(filters: ServiceFiltersForService): Promise<ListOfServices> {
        const offset = (filters.page - 1) * filters.limit;

        const [services, totalRecords] = await Promise.all([
            this.serviceRepository.getAll({
                search: filters.search,
                status: filters.status,
                limit: filters.limit,
                offset,
            }),
            this.serviceRepository.count({
                search: filters.search,
                status: filters.status,
            }),
        ]);

        const totalPages = Math.ceil(totalRecords / filters.limit);

        return {
            data: ServiceMapper.toPublicServices(services),
            meta: {
                totalRecords,
                currentPage: filters.page,
                limit: filters.limit,
                totalPages,
            },
        };
    }

    async update(id: string, data: ServiceToUpdateType): Promise<PublicService> {
        const service = await this.serviceRepository.getById(id);
        if (!service) {
            throw new ServiceNotFoundError(`Service with ID ${id} not found`);
        }

        if (data.name && data.name !== service.name) {
            const existing = await this.serviceRepository.getByName(data.name);
            if (existing && existing.id !== id) {
                throw new ServiceAlreadyExistsError(
                    `Service with name "${data.name}" already exists`
                );
            }
        }

        const updated = await this.serviceRepository.update(id, data);
        return ServiceMapper.toPublicService(updated);
    }

    async softDelete(id: string): Promise<void> {
        const existing = await this.serviceRepository.getById(id);
        if (!existing) {
            throw new ServiceNotFoundError(`Service with ID ${id} not found`);
        }

        await this.serviceRepository.softDelete(id);
    }
}
