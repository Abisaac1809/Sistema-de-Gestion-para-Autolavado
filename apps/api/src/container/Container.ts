import { PrismaClient } from '../generated/prisma';

import PrismaCategoryRepository from '../repositories/PrismaCategoryRepository';

import CategoryService from '../services/CategoryService';

export interface Container {
    prisma: PrismaClient;
    

    categoryRepository: PrismaCategoryRepository;
    categoryService: CategoryService;
}


export function createContainer(prisma: PrismaClient): Container {
    const categoryRepository = new PrismaCategoryRepository(prisma);

    const categoryService = new CategoryService(categoryRepository);

    return {
        prisma,
        categoryRepository,
        categoryService,
    };
}
