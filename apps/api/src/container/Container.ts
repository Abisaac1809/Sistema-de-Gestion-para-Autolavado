import { PrismaClient } from '../generated/prisma';

import PrismaCategoryRepository from '../repositories/PrismaCategoryRepository';
import PrismaProductRepository from '../repositories/PrismaProductRepository';
import PrismaServiceRepository from '../repositories/PrismaServiceRepository';
import PrismaPaymentMethodRepository from '../repositories/PrismaPaymentMethodRepository';

import CategoryService from '../services/CategoryService';
import ProductService from '../services/ProductService';
import ServiceService from '../services/ServiceService';
import PaymentMethodService from '../services/PaymentMethodService';

export interface Container {
    prisma: PrismaClient;

    categoryRepository: PrismaCategoryRepository;
    productRepository: PrismaProductRepository;
    serviceRepository: PrismaServiceRepository;
    paymentMethodRepository: PrismaPaymentMethodRepository;
    categoryService: CategoryService;
    productService: ProductService;
    serviceService: ServiceService;
    paymentMethodService: PaymentMethodService;
}

export function createContainer(prisma: PrismaClient): Container {
    const categoryRepository = new PrismaCategoryRepository(prisma);
    const productRepository = new PrismaProductRepository(prisma);
    const serviceRepository = new PrismaServiceRepository(prisma);
    const paymentMethodRepository = new PrismaPaymentMethodRepository(prisma);

    const categoryService = new CategoryService(categoryRepository, productRepository);
    const productService = new ProductService(productRepository, categoryRepository);
    const serviceService = new ServiceService(serviceRepository);
    const paymentMethodService = new PaymentMethodService(paymentMethodRepository);

    return {
        prisma,
        categoryRepository,
        productRepository,
        serviceRepository,
        paymentMethodRepository,
        categoryService,
        productService,
        serviceService,
        paymentMethodService,
    };
}
