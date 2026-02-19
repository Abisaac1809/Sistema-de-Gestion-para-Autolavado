import Product from '../../entities/Product';
import { ProductToCreateType, ProductToUpdateType, StockUpdate } from '../../types/dtos/Product.dto';
import { ProductFiltersForRepository, ProductFiltersForCount } from '../../types/dtos/Product.dto';

export default interface IProductRepository {
    create(data: ProductToCreateType): Promise<Product>;
    get(id: string): Promise<Product | null>;
    getByName(name: string): Promise<Product | null>;
    list(filters: ProductFiltersForRepository): Promise<Product[]>;
    count(filters: ProductFiltersForCount): Promise<number>;
    update(id: string, data: ProductToUpdateType): Promise<Product>;
    softDelete(id: string): Promise<void>;
    restore(id: string): Promise<void>;
    countByCategoryId(categoryId: string): Promise<number>;
    updateStock(id: string, newStock: number): Promise<void>;
    bulkUpdateStock(updates: StockUpdate[]): Promise<void>;
}