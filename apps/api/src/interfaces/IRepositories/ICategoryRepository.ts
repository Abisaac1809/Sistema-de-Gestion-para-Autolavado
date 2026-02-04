import Category from '../../entities/Category';
import { CategoryToCreateType } from '../../schemas/Category.schema';
import {
    CategoryFiltersForRepository,
    CategoryFiltersForCount,
} from '../../types/dtos/Category.dto';

export default interface ICategoryRepository {
    createCategory(data: CategoryToCreateType): Promise<Category>;
    getCategoryById(id: string): Promise<Category | null>;
    getCategoryByName(name: string): Promise<Category | null>;
    getListOfCategories(filters: CategoryFiltersForRepository): Promise<Category[]>;
    getCountOfCategories(filters: CategoryFiltersForCount): Promise<number>;
    updateCategory(id: string, data: Partial<Category>): Promise<Category>;
    softDeleteCategory(id: string): Promise<void>;
    restoreCategory(id: string): Promise<Category>;
}
