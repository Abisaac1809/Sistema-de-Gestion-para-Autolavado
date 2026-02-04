import Category from '../entities/Category';
import { PublicCategory } from '../types/dtos/Category.dto';

export default class CategoryMapper {
    static toPublicCategory(category: Category): PublicCategory {
        return {
            id: category.id,
            name: category.name,
            description: category.description,
            status: category.status,
        };
    }

    static toPublicCategories(categories: Category[]): PublicCategory[] {
        return categories.map(CategoryMapper.toPublicCategory);
    }
}
