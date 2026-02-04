import ICategoryService from '../interfaces/IServices/ICategoryService';
import ICategoryRepository from '../interfaces/IRepositories/ICategoryRepository';
import { CategoryToCreateType, CategoryToUpdateType } from '../schemas/Category.schema';
import {
    CategoryFiltersForService,
    ListOfCategories,
    PublicCategory,
} from '../types/dtos/Category.dto';
import {
    CategoryAlreadyExistsError,
    CategoryNotFoundError,
} from '../errors/BusinessErrors';
import CategoryMapper from '../mappers/CategoryMapper';

export default class CategoryService implements ICategoryService {
    constructor(private categoryRepository: ICategoryRepository) {}

    async createCategory(data: CategoryToCreateType): Promise<PublicCategory> {
        const existing = await this.categoryRepository.getCategoryByName(data.name);

        if (existing) {
            if (existing.deletedAt !== null) {
                const restored = await this.categoryRepository.restoreCategory(existing.id);
                const updated = await this.categoryRepository.updateCategory(existing.id, {
                    name: data.name,
                    description: data.description || null,
                    status: data.status !== undefined ? data.status : true,
                });
                return CategoryMapper.toPublicCategory(updated);
            }

            throw new CategoryAlreadyExistsError(
                `Category with name "${data.name}" already exists`
            );
        }

        const newCategory = await this.categoryRepository.createCategory(data);
        return CategoryMapper.toPublicCategory(newCategory);
    }

    async updateCategory(id: string, data: CategoryToUpdateType): Promise<PublicCategory> {
        const category = await this.categoryRepository.getCategoryById(id);
        if (!category) {
            throw new CategoryNotFoundError(`Category with ID ${id} not found`);
        }

        if (data.name && data.name !== category.name) {
            const existing = await this.categoryRepository.getCategoryByName(data.name);
            if (existing && existing.id !== id) {
                throw new CategoryAlreadyExistsError(
                    `Category with name "${data.name}" already exists`
                );
            }
        }

        const updated = await this.categoryRepository.updateCategory(id, data);
        return CategoryMapper.toPublicCategory(updated);
    }

    async deleteCategory(id: string): Promise<void> {
        const category = await this.categoryRepository.getCategoryById(id);
        if (!category) {
            throw new CategoryNotFoundError(`Category with ID ${id} not found`);
        }

        await this.categoryRepository.softDeleteCategory(id);
    }

    async getCategoryById(id: string): Promise<PublicCategory> {
        const category = await this.categoryRepository.getCategoryById(id);
        console.log('Fetched category:', category);
        if (!category) {
            throw new CategoryNotFoundError(`Category with ID ${id} not found`);
        }
        return CategoryMapper.toPublicCategory(category);
    }

    async getListOfCategories(filters: CategoryFiltersForService): Promise<ListOfCategories> {
        const offset = (filters.page - 1) * filters.limit;

        const [categories, totalRecords] = await Promise.all([
            this.categoryRepository.getListOfCategories({
                search: filters.search,
                status: filters.status,
                limit: filters.limit,
                offset,
            }),
            this.categoryRepository.getCountOfCategories({
                search: filters.search,
                status: filters.status,
            }),
        ]);
    
        const totalPages = Math.ceil(totalRecords / filters.limit);

        return {
            data: CategoryMapper.toPublicCategories(categories),
            meta: {
                totalRecords,
                currentPage: filters.page,
                limit: filters.limit,
                totalPages,
            },
        };
    }
}
