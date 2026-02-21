import { PrismaClient } from '../generated/prisma';

import {
    PrismaCategoryRepository,
    PrismaProductRepository,
    PrismaServiceRepository,
    PrismaPaymentMethodRepository,
    PrismaCustomerRepository,
    PrismaNotificationContactRepository,
    PrismaOrderRepository,
    PrismaOrderDetailRepository,
    PrismaExchangeRateRepository,
    PrismaSaleRepository,
    PrismaPaymentRepository,
    PrismaInventoryAdjustmentRepository,
    PrismaStoreInfoRepository,
    PrismaDashboardRepository,
} from '../repositories';

import {
    CategoryService,
    ProductService,
    ServiceService,
    PaymentMethodService,
    CustomerService,
    NotificationContactService,
    OrderService,
    SaleService,
    PaymentService,
    InventoryAdjustmentService,
    StoreInfoService,
    ExchangeRateService,
    BCVExchangeRateProviderService,
    DashboardService,
    ReportService,
} from '../services';

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
    inventoryAdjustmentRepository: PrismaInventoryAdjustmentRepository;
    storeInfoRepository: PrismaStoreInfoRepository;
    dashboardRepository: PrismaDashboardRepository;

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
    inventoryAdjustmentService: InventoryAdjustmentService;
    storeInfoService: StoreInfoService;
    dashboardService: DashboardService;
    reportService: ReportService;
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
    const inventoryAdjustmentRepository = new PrismaInventoryAdjustmentRepository(prisma);
    const storeInfoRepository = new PrismaStoreInfoRepository(prisma);
    const dashboardRepository = new PrismaDashboardRepository(prisma);

    const bcvExchangeRateProviderService = new BCVExchangeRateProviderService();

    const categoryService = new CategoryService(categoryRepository, productRepository);
    const productService = new ProductService(productRepository, categoryRepository);
    const serviceService = new ServiceService(serviceRepository);
    const paymentMethodService = new PaymentMethodService(paymentMethodRepository);
    const customerService = new CustomerService(customerRepository);
    const notificationContactService = new NotificationContactService(notificationContactRepository);
    const exchangeRateService = new ExchangeRateService(
        exchangeRateRepository,
        bcvExchangeRateProviderService
    );
    const orderService = new OrderService(
        orderRepository,
        orderDetailRepository,
        customerRepository,
        productRepository,
        serviceRepository,
        exchangeRateService
    );
    const saleService = new SaleService(
        saleRepository,
        productRepository,
        serviceRepository,
        orderRepository,
        exchangeRateService,
        paymentMethodRepository,
    );
    const paymentService = new PaymentService(
        paymentRepository,
        orderRepository,
        saleRepository,
        paymentMethodRepository,
        exchangeRateService
    );
    const inventoryAdjustmentService = new InventoryAdjustmentService(
        inventoryAdjustmentRepository,
        productRepository
    );
    const storeInfoService = new StoreInfoService(storeInfoRepository);

    const dashboardService = new DashboardService(dashboardRepository, exchangeRateService);
    const reportService = new ReportService(dashboardService);

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
        inventoryAdjustmentRepository,
        storeInfoRepository,
        dashboardRepository,
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
        inventoryAdjustmentService,
        storeInfoService,
        dashboardService,
        reportService,
    };
}
