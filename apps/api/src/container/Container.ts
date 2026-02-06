import { PrismaClient } from '../generated/prisma';

import PrismaCategoryRepository from '../repositories/PrismaCategoryRepository';
import PrismaProductRepository from '../repositories/PrismaProductRepository';
import PrismaServiceRepository from '../repositories/PrismaServiceRepository';
import PrismaPaymentMethodRepository from '../repositories/PrismaPaymentMethodRepository';
import PrismaCustomerRepository from '../repositories/PrismaCustomerRepository';
import PrismaNotificationContactRepository from '../repositories/PrismaNotificationContactRepository';

import CategoryService from '../services/CategoryService';
import ProductService from '../services/ProductService';
import ServiceService from '../services/ServiceService';
import PaymentMethodService from '../services/PaymentMethodService';
import CustomerService from '../services/CustomerService';
import NotificationContactService from '../services/NotificationContactService';

export interface Container {
    prisma: PrismaClient;

    categoryRepository: PrismaCategoryRepository;
    productRepository: PrismaProductRepository;
    serviceRepository: PrismaServiceRepository;
    paymentMethodRepository: PrismaPaymentMethodRepository;
    customerRepository: PrismaCustomerRepository;
    notificationContactRepository: PrismaNotificationContactRepository;
    categoryService: CategoryService;
    productService: ProductService;
    serviceService: ServiceService;
    paymentMethodService: PaymentMethodService;
    customerService: CustomerService;
    notificationContactService: NotificationContactService;
}

export function createContainer(prisma: PrismaClient): Container {
    const categoryRepository = new PrismaCategoryRepository(prisma);
    const productRepository = new PrismaProductRepository(prisma);
    const serviceRepository = new PrismaServiceRepository(prisma);
    const paymentMethodRepository = new PrismaPaymentMethodRepository(prisma);
    const customerRepository = new PrismaCustomerRepository(prisma);
    const notificationContactRepository = new PrismaNotificationContactRepository(prisma);

    const categoryService = new CategoryService(categoryRepository, productRepository);
    const productService = new ProductService(productRepository, categoryRepository);
    const serviceService = new ServiceService(serviceRepository);
    const paymentMethodService = new PaymentMethodService(paymentMethodRepository);
    const customerService = new CustomerService(customerRepository);
    const notificationContactService = new NotificationContactService(notificationContactRepository);

    return {
        prisma,
        categoryRepository,
        productRepository,
        serviceRepository,
        paymentMethodRepository,
        customerRepository,
        notificationContactRepository,
        categoryService,
        productService,
        serviceService,
        paymentMethodService,
        customerService,
        notificationContactService,
    };
}
