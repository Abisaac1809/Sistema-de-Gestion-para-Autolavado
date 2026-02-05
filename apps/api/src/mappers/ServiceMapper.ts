import Service from '../entities/Service';
import { PublicService } from '../types/dtos/Service.dto';

export default class ServiceMapper {
    static toPublicService(service: Service): PublicService {
        return {
            id: service.id,
            name: service.name,
            description: service.description,
            price: service.price,

            status: service.status,
            createdAt: service.createdAt,
            updatedAt: service.updatedAt,
        };
    }

    static toPublicServices(services: Service[]): PublicService[] {
        return services.map(ServiceMapper.toPublicService);
    }
}
