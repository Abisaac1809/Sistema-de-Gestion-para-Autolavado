import IPaymentMethodService from '../interfaces/IServices/IPaymentMethodService';
import IPaymentMethodRepository from '../interfaces/IRepositories/IPaymentMethodRepository';
import { PaymentMethodToCreateType, PaymentMethodToUpdateType } from '../schemas/PaymentMethod.schema';
import {
    PaymentMethodFiltersForService,
    ListOfPaymentMethods,
    PublicPaymentMethod,
} from '../types/dtos/PaymentMethod.dto';
import {
    PaymentMethodAlreadyExistsError,
    PaymentMethodNotFoundError,
} from '../errors/BusinessErrors';
import PaymentMethodMapper from '../mappers/PaymentMethodMapper';

export default class PaymentMethodService implements IPaymentMethodService {
    constructor(private paymentMethodRepository: IPaymentMethodRepository) { }

    async create(data: PaymentMethodToCreateType): Promise<PublicPaymentMethod> {
        const existing = await this.paymentMethodRepository.getByName(data.name);

        if (existing) {
            if (existing.deletedAt !== null) {
                await this.paymentMethodRepository.restore(existing.id);
                const updated = await this.paymentMethodRepository.update(existing.id, data);
                return PaymentMethodMapper.toPublic(updated);
            }

            throw new PaymentMethodAlreadyExistsError(
                `Payment method with name "${data.name}" already exists`
            );
        }

        const newPaymentMethod = await this.paymentMethodRepository.create(data);

        return PaymentMethodMapper.toPublic(newPaymentMethod);
    }

    async getById(id: string): Promise<PublicPaymentMethod> {
        const paymentMethod = await this.paymentMethodRepository.getById(id);

        if (!paymentMethod) {
            throw new PaymentMethodNotFoundError(`Payment method with ID ${id} not found`);
        }

        return PaymentMethodMapper.toPublic(paymentMethod);
    }

    async getAll(filters: PaymentMethodFiltersForService): Promise<ListOfPaymentMethods> {
        const offset = (filters.page - 1) * filters.limit;

        const [paymentMethods, totalRecords] = await Promise.all([
            this.paymentMethodRepository.getAll({
                search: filters.search,
                currency: filters.currency,
                isActive: filters.isActive,
                limit: filters.limit,
                offset,
            }),
            this.paymentMethodRepository.count({
                search: filters.search,
                currency: filters.currency,
                isActive: filters.isActive,
            }),
        ]);

        const totalPages = Math.ceil(totalRecords / filters.limit);

        return {
            data: PaymentMethodMapper.toPublicList(paymentMethods),
            meta: {
                totalRecords,
                currentPage: filters.page,
                limit: filters.limit,
                totalPages,
            },
        };
    }

    async update(id: string, data: PaymentMethodToUpdateType): Promise<PublicPaymentMethod> {
        const paymentMethod = await this.paymentMethodRepository.getById(id);
        if (!paymentMethod) {
            throw new PaymentMethodNotFoundError(`Payment method with ID ${id} not found`);
        }

        if (data.name && data.name !== paymentMethod.name) {
            const existing = await this.paymentMethodRepository.getByName(data.name);
            if (existing && existing.id !== id) {
                throw new PaymentMethodAlreadyExistsError(
                    `Payment method with name "${data.name}" already exists`
                );
            }
        }

        const updated = await this.paymentMethodRepository.update(id, data);
        return PaymentMethodMapper.toPublic(updated);
    }

    async delete(id: string): Promise<void> {
        const existing = await this.paymentMethodRepository.getById(id);
        if (!existing) {
            throw new PaymentMethodNotFoundError(`Payment method with ID ${id} not found`);
        }

        await this.paymentMethodRepository.softDelete(id);
    }
}
