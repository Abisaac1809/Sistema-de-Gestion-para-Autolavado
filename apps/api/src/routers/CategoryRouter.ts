import { Router } from 'express';
import CategoryController from '../controllers/CategoryController';
import validateSchema from '../middlewares/ValidateSchema';
import validateQueryParams from '../middlewares/ValidateQueryParams';
import {
    CategoryToCreate,
    CategoryToUpdate,
    CategoryFilters,
} from '../schemas/Category.schema';
import ICategoryService from '../interfaces/IServices/ICategoryService';

export default function createCategoryRouter(categoryService: ICategoryService): Router {
    const router = Router();
    const controller = new CategoryController(categoryService);

    // Create category
    router.post('/', validateSchema(CategoryToCreate), controller.create);

    // Update category
    router.patch('/:id', validateSchema(CategoryToUpdate), controller.update);

    // Get category by ID
    router.get('/:id', controller.getById);

    // List categories with filters
    router.get('/', validateQueryParams(CategoryFilters), controller.getList);

    // Delete category
    router.delete('/:id', controller.delete);

    return router;
}
