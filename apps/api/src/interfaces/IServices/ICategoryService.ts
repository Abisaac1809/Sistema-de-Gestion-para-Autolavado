import { CategoryToCreateType, CategoryToUpdateType } from '../../schemas/Category.schema';
import {
    PublicCategory,
    ListOfCategories,
    CategoryFiltersForService,
} from '../../types/dtos/Category.dto';

export default interface ICategoryService {
    createCategory(data: CategoryToCreateType): Promise<PublicCategory>;
    updateCategory(id: string, data: CategoryToUpdateType): Promise<PublicCategory>;
    deleteCategory(id: string): Promise<void>;
    getCategoryById(id: string): Promise<PublicCategory>;
    getListOfCategories(filters: CategoryFiltersForService): Promise<ListOfCategories>;
}
