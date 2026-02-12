import { PrismaClient } from '../generated/prisma';

import PrismaCategoryRepository from '../repositories/PrismaCategoryRepository';
import PrismaProductRepository from '../repositories/PrismaProductRepository';
import PrismaServiceRepository from '../repositories/PrismaServiceRepository';
import PrismaPaymentMethodRepository from '../repositories/PrismaPaymentMethodRepository';
import PrismaCustomerRepository from '../repositories/PrismaCustomerRepository';
import PrismaNotificationContactRepository from '../repositories/PrismaNotificationContactRepository';
import PrismaOrderRepository from '../repositories/PrismaOrderRepository';
import PrismaOrderDetailRepository from '../repositories/PrismaOrderDetailRepository';
import PrismaExchangeRateRepository from '../repositories/PrismaExchangeRateRepository';
import PrismaSaleRepository from '../repositories/PrismaSaleRepository';

import CategoryService from '../services/CategoryService';
import ProductService from '../services/ProductService';
import ServiceService from '../services/ServiceService';
import PaymentMethodService from '../services/PaymentMethodService';
import CustomerService from '../services/CustomerService';
import NotificationContactService from '../services/NotificationContactService';
import OrderService from '../services/OrderService';
import SaleService from '../services/SaleService';

export interface Container {
    prisma: PrismaClient;

    categoryRepository: PrismaCategoryRepository;
    productRepository: PrismaProductRepository;
    serviceRepository: PrismaServiceRepository;
    paymentMethodRepository: PrismaPaymentMethodRepository;
    customerRepository: PrismaCustomerRepository;
    notificationContactRepository: PrismaNotificationContactRepository;
    orderRepository: PrismaOrderRepository;
    orderDetailRepository: PrismaOrderDetailRepository;
    exchangeRateRepository: PrismaExchangeRateRepository;
    saleRepository: PrismaSaleRepository;
    categoryService: CategoryService;
    productService: ProductService;
    serviceService: ServiceService;
    paymentMethodService: PaymentMethodService;
    customerService: CustomerService;
    notificationContactService: NotificationContactService;
    orderService: OrderService;
    saleService: SaleService;
}

export function createContainer(prisma: PrismaClient): Container {
    const categoryRepository = new PrismaCategoryRepository(prisma);
    const productRepository = new PrismaProductRepository(prisma);
    const serviceRepository = new PrismaServiceRepository(prisma);
    const paymentMethodRepository = new PrismaPaymentMethodRepository(prisma);
    const customerRepository = new PrismaCustomerRepository(prisma);
    const notificationContactRepository = new PrismaNotificationContactRepository(prisma);
    const orderRepository = new PrismaOrderRepository(prisma);
    const orderDetailRepository = new PrismaOrderDetailRepository(prisma);
    const exchangeRateRepository = new PrismaExchangeRateRepository(prisma);
    const saleRepository = new PrismaSaleRepository(prisma);

    const categoryService = new CategoryService(categoryRepository, productRepository);
    const productService = new ProductService(productRepository, categoryRepository);
    const serviceService = new ServiceService(serviceRepository);
    const paymentMethodService = new PaymentMethodService(paymentMethodRepository);
    const customerService = new CustomerService(customerRepository);
    const notificationContactService = new NotificationContactService(notificationContactRepository);
    const orderService = new OrderService(
        orderRepository,
        orderDetailRepository,
        customerRepository,
        productRepository,
        serviceRepository
    );
    const saleService = new SaleService(
        saleRepository,
        productRepository,
        serviceRepository,
        orderRepository,
        exchangeRateRepository
    );

    return {
        prisma,
        categoryRepository,
        productRepository,
        serviceRepository,
        paymentMethodRepository,
        customerRepository,
        notificationContactRepository,
        orderRepository,
        orderDetailRepository,
        exchangeRateRepository,
        saleRepository,
        categoryService,
        productService,
        serviceService,
        paymentMethodService,
        customerService,
        notificationContactService,
        orderService,
        saleService,
    };
}
