import Customer from "../../entities/Customer";
import {
    CustomerToCreateType,
    CustomerToUpdateType,
    CustomerFiltersForRepository,
    CustomerFiltersForCount
} from "../../types/dtos/Customer.dto";

export interface ICustomerRepository {
    create(data: CustomerToCreateType): Promise<Customer>;
    update(id: string, data: CustomerToUpdateType): Promise<Customer>;
    getById(id: string): Promise<Customer | null>;
    getByIdNumber(idNumber: string, includeDeleted?: boolean): Promise<Customer | null>;
    getList(filters: CustomerFiltersForRepository): Promise<Customer[]>;
    count(filters: CustomerFiltersForCount): Promise<number>;
    softDelete(id: string): Promise<void>;
    restore(id: string): Promise<Customer>;
    getBulkByIds(ids: string[]): Promise<Customer[]>;
}
