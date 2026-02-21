import { Request, Response, NextFunction } from 'express';
import ICategoryService from '../interfaces/IServices/ICategoryService';
import { CategoryToCreateType, CategoryToUpdateType, CategoryFiltersForService } from '../types/dtos/Category.dto';

export default class CategoryController {
    constructor(private categoryService: ICategoryService) { }

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryData: CategoryToCreateType = req.body;
            const newCategory = await this.categoryService.createCategory(categoryData);
            res.status(201).json({
                message: 'Category created successfully',
                category: newCategory,
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Category ID is required' });
                return;
            }
            const categoryData: CategoryToUpdateType = req.body;
            const updatedCategory = await this.categoryService.updateCategory(id, categoryData);
            res.status(200).json({
                message: 'Category updated successfully',
                category: updatedCategory,
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Category ID is required' });
                return;
            }
            await this.categoryService.deleteCategory(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            if (!id || typeof id !== 'string') {
                res.status(400).json({ message: 'Category ID is required' });
                return;
            }
            const category = await this.categoryService.getCategoryById(id);
            res.status(200).json({
                message: 'Category retrieved successfully',
                category,
            });
        } catch (error) {
            console.log('Error in getById:', error);
            next(error);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filters: CategoryFiltersForService = res.locals.validatedQuery;
            const categories = await this.categoryService.getListOfCategories(filters);
            res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    };
}
