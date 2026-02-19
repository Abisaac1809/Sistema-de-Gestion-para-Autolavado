import 'dotenv/config';
import express from 'express';
import { PrismaClient } from './generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import globalErrorHandler from './middlewares/GlobalErrorHandler';
import createCategoryRouter from './routers/CategoryRouter';
import createProductRouter from './routers/ProductRouter';
import createServiceRouter from './routers/ServiceRouter';
import createPaymentMethodRouter from './routers/PaymentMethodRouter';
import createCustomerRouter from './routers/CustomerRouter';
import createNotificationContactRouter from './routers/NotificationContactRouter';
import createOrderRouter from './routers/OrderRouter';
import createSaleRouter from './routers/SaleRouter';
import { createPaymentsRouter } from './routers/PaymentRouter';
import { createContainer } from './container/Container';
import httpLogger from './middlewares/HttpLogger';
import createExchangeRateRouter from './routers/ExchangeRateRouter';

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.use(httpLogger);
app.use(express.json());

const container = createContainer(prisma);

app.use('/api/categories', createCategoryRouter(container.categoryService));
app.use('/api/products', createProductRouter(container.productService));
app.use('/api/services', createServiceRouter(container.serviceService));
app.use('/api/payment-methods', createPaymentMethodRouter(container.paymentMethodService));
app.use('/api/customers', createCustomerRouter(container.customerService));
app.use('/api/config/notifications', createNotificationContactRouter(container.notificationContactService));
app.use('/api/orders', createOrderRouter(container.orderService, container.saleService, container.paymentService));
app.use('/api/sales', createSaleRouter(container.saleService, container.paymentService));
app.use('/api/payments', createPaymentsRouter(container.paymentService));
app.use('/api/exchange-rates', createExchangeRateRouter(container.exchangeRateService));

app.use(globalErrorHandler);

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    await pool.end();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', async () => {
    await prisma.$disconnect();
    await pool.end();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
