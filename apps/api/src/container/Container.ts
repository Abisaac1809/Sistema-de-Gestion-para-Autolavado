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
import PrismaPaymentRepository from '../repositories/PrismaPaymentRepository';

import CategoryService from '../services/CategoryService';
import ProductService from '../services/ProductService';
import ServiceService from '../services/ServiceService';
import PaymentMethodService from '../services/PaymentMethodService';
import CustomerService from '../services/CustomerService';
import NotificationContactService from '../services/NotificationContactService';
import OrderService from '../services/OrderService';
import SaleService from '../services/SaleService';
import PaymentService from '../services/PaymentService';
import { ExchangeRateService } from '../services/ExchangeRateService';
import BCVExchangeRateProviderService from '../services/BCVExchangeRateProviderService';

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
    paymentRepository: PrismaPaymentRepository;

    bcvExchangeRateProviderService: BCVExchangeRateProviderService;
    
    categoryService: CategoryService;
    productService: ProductService;
    serviceService: ServiceService;
    paymentMethodService: PaymentMethodService;
    customerService: CustomerService;
    notificationContactService: NotificationContactService;
    orderService: OrderService;
    exchangeRateService: ExchangeRateService;
    saleService: SaleService;
    paymentService: PaymentService;
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
    const paymentRepository = new PrismaPaymentRepository(prisma);

    const bcvExchangeRateProviderService = new BCVExchangeRateProviderService();

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
    const exchangeRateService = new ExchangeRateService(
        exchangeRateRepository,
        bcvExchangeRateProviderService
    );
    const saleService = new SaleService(
        saleRepository,
        productRepository,
        serviceRepository,
        orderRepository,
        exchangeRateRepository
    );
    const paymentService = new PaymentService(
        paymentRepository,
        orderRepository,
        saleRepository,
        paymentMethodRepository,
        exchangeRateService
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
        paymentRepository,
        bcvExchangeRateProviderService,
        categoryService,
        productService,
        serviceService,
        paymentMethodService,
        customerService,
        notificationContactService,
        orderService,
        exchangeRateService,
        saleService,
        paymentService,
    };
}
