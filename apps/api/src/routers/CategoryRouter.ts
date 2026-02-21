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

    router.post('/', validateSchema(CategoryToCreate), controller.create);

    router.patch('/:id', validateSchema(CategoryToUpdate), controller.update);

    router.get('/:id', controller.get);

    router.get('/', validateQueryParams(CategoryFilters), controller.list);

    router.delete('/:id', controller.delete);

    return router;
}
