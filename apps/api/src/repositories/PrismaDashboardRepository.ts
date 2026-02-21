import { PrismaClient } from '../generated/prisma';
import IDashboardRepository from '../interfaces/IRepositories/IDashboardRepository';
import {
    RevenueTotals,
    OrderStatusCount,
    PaymentMethodAggregate,
    NameLookupItem,
    TopServiceItem,
    TopProductItem,
    InventoryAlertItem,
    AdjustmentSummaryItem,
    ActivityFeedItem,
    RevenueChartPoint,
    RevenueBucket,
} from '../types/dtos/Dashboard.dto';
import { OrderStatus, AdjustmentType, AdjustmentReason } from '../types/enums';

type AvgServiceTimeResult = {
    avg_seconds: number | null;
};

type LowStockProduct = {
    id: string;
    name: string;
    stock: string;
    min_stock: string;
};

type RawActivityRow = {
    id: string;
    type: 'order' | 'sale' | 'payment';
    description: string;
    timestamp: Date;
    amount_usd: string | null;
};

type ChartDataPoint = {
    bucket: Date;
    total_usd: string;
    total_ves: string;
};

export default class PrismaDashboardRepository implements IDashboardRepository {
    constructor(private prisma: PrismaClient) {}

    async getRevenueTotals(fromDate: Date, toDate: Date): Promise<RevenueTotals> {
        const result = await this.prisma.sale.aggregate({
            where: {
                deletedAt: null,
                status: 'COMPLETED',
                createdAt: { gte: fromDate, lte: toDate },
            },
            _sum: { totalUsd: true, totalVes: true },
            _count: { id: true },
        });

        return {
            totalRevenueUsd: result._sum.totalUsd?.toNumber() ?? 0,
            totalRevenueVes: result._sum.totalVes?.toNumber() ?? 0,
            salesCount: result._count.id,
        };
    }

    async getOrderCountsByStatus(fromDate: Date, toDate: Date): Promise<OrderStatusCount[]> {
        const groups = await this.prisma.order.groupBy({
            by: ['status'],
            where: {
                deletedAt: null,
                createdAt: { gte: fromDate, lte: toDate },
            },
            _count: { id: true },
        });

        return groups.map((g) => ({
            status: g.status as OrderStatus,
            count: g._count.id,
        }));
    }

    async getAverageServiceTimeMinutes(fromDate: Date, toDate: Date): Promise<number | null> {
        const avgResult = await this.prisma.$queryRaw<AvgServiceTimeResult[]>`
            SELECT AVG(EXTRACT(EPOCH FROM (completed_at - started_at)) / 60) AS avg_seconds
            FROM orders
            WHERE deleted_at IS NULL
              AND status = 'COMPLETED'
              AND started_at IS NOT NULL
              AND completed_at IS NOT NULL
              AND created_at >= ${fromDate}
              AND created_at <= ${toDate}
        `;

        const rawAvg = avgResult[0]?.avg_seconds;
        return rawAvg !== null && rawAvg !== undefined ? Math.round(rawAvg) : null;
    }

    async getPaymentsByMethod(fromDate: Date, toDate: Date): Promise<PaymentMethodAggregate[]> {
        const groups = await this.prisma.payment.groupBy({
            by: ['paymentMethodId'],
            where: {
                deletedAt: null,
                paymentDate: { gte: fromDate, lte: toDate },
            },
            _sum: { amountUsd: true, amountVes: true },
        });

        return groups.map((g) => ({
            paymentMethodId: g.paymentMethodId,
            totalUsd: g._sum.amountUsd?.toNumber() ?? 0,
            totalVes: g._sum.amountVes?.toNumber() ?? 0,
        }));
    }

    async getPaymentMethodNames(ids: string[]): Promise<NameLookupItem[]> {
        const methods = await this.prisma.paymentMethod.findMany({
            where: { id: { in: ids }, deletedAt: null },
            select: { id: true, name: true },
        });

        return methods.map((m) => ({ id: m.id, name: m.name }));
    }

    async getTopServices(fromDate: Date, toDate: Date, limit: number): Promise<TopServiceItem[]> {
        const topServices = await this.prisma.saleDetail.groupBy({
            by: ['serviceId'],
            where: {
                deletedAt: null,
                serviceId: { not: null },
                sale: {
                    deletedAt: null,
                    status: 'COMPLETED',
                    createdAt: { gte: fromDate, lte: toDate },
                },
            },
            _sum: { subtotal: true, quantity: true },
            _count: { id: true },
            orderBy: { _sum: { subtotal: 'desc' } },
            take: limit,
        });

        const serviceIds = topServices
            .map((g) => g.serviceId)
            .filter((id): id is string => id !== null);

        const services = await this.prisma.service.findMany({
            where: { id: { in: serviceIds }, deletedAt: null },
            select: { id: true, name: true },
        });

        const serviceMap = new Map(services.map((s) => [s.id, s.name]));

        return topServices
            .filter((g) => g.serviceId !== null)
            .map((g) => ({
                serviceId: g.serviceId as string,
                serviceName: serviceMap.get(g.serviceId as string) ?? 'Unknown',
                revenueUsd: g._sum.subtotal?.toNumber() ?? 0,
                quantitySold: g._sum.quantity?.toNumber() ?? 0,
            }));
    }

    async getTopProducts(fromDate: Date, toDate: Date, limit: number): Promise<TopProductItem[]> {
        const topProducts = await this.prisma.saleDetail.groupBy({
            by: ['productId'],
            where: {
                deletedAt: null,
                productId: { not: null },
                sale: {
                    deletedAt: null,
                    status: 'COMPLETED',
                    createdAt: { gte: fromDate, lte: toDate },
                },
            },
            _sum: { subtotal: true, quantity: true },
            _count: { id: true },
            orderBy: { _sum: { subtotal: 'desc' } },
            take: limit,
        });

        const productIds = topProducts
            .map((g) => g.productId)
            .filter((id): id is string => id !== null);

        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds }, deletedAt: null },
            select: { id: true, name: true },
        });

        const productMap = new Map(products.map((p) => [p.id, p.name]));

        return topProducts
            .filter((g) => g.productId !== null)
            .map((g) => ({
                productId: g.productId as string,
                productName: productMap.get(g.productId as string) ?? 'Unknown',
                revenueUsd: g._sum.subtotal?.toNumber() ?? 0,
                quantitySold: g._sum.quantity?.toNumber() ?? 0,
            }));
    }

    async getInventoryAlerts(): Promise<InventoryAlertItem[]> {
        const lowStockProducts = await this.prisma.$queryRaw<LowStockProduct[]>`
            SELECT id, name, stock::text, min_stock::text
            FROM products
            WHERE deleted_at IS NULL
              AND status = true
              AND stock < min_stock
            ORDER BY (min_stock - stock) DESC
        `;

        return lowStockProducts.map((p) => ({
            productId: p.id,
            productName: p.name,
            currentStock: parseFloat(p.stock),
            minStock: parseFloat(p.min_stock),
            deficit: parseFloat(p.min_stock) - parseFloat(p.stock),
        }));
    }

    async getAdjustmentGroups(fromDate: Date, toDate: Date): Promise<AdjustmentSummaryItem[]> {
        const groups = await this.prisma.inventoryAdjustment.groupBy({
            by: ['adjustmentType', 'reason'],
            where: {
                deletedAt: null,
                createdAt: { gte: fromDate, lte: toDate },
            },
            _count: { id: true },
            _sum: { quantity: true },
        });

        return groups.map((g) => ({
            adjustmentType: g.adjustmentType as AdjustmentType,
            reason: g.reason as AdjustmentReason,
            count: g._count.id,
            totalQuantity: g._sum.quantity?.toNumber() ?? 0,
        }));
    }

    async getRecentActivity(
        fromDate: Date,
        toDate: Date,
        limit: number,
    ): Promise<ActivityFeedItem[]> {
        const rows = await this.prisma.$queryRaw<RawActivityRow[]>`
            (
                SELECT
                    id,
                    'order' AS type,
                    CONCAT('Order - Status: ', status) AS description,
                    created_at AS timestamp,
                    total_usd::text AS amount_usd
                FROM orders
                WHERE deleted_at IS NULL
                  AND created_at >= ${fromDate}
                  AND created_at <= ${toDate}
            )
            UNION ALL
            (
                SELECT
                    id,
                    'sale' AS type,
                    CONCAT('Sale - $', total_usd::text) AS description,
                    created_at AS timestamp,
                    total_usd::text AS amount_usd
                FROM sales
                WHERE deleted_at IS NULL
                  AND created_at >= ${fromDate}
                  AND created_at <= ${toDate}
            )
            UNION ALL
            (
                SELECT
                    id,
                    'payment' AS type,
                    CONCAT('Payment - $', amount_usd::text) AS description,
                    payment_date AS timestamp,
                    amount_usd::text AS amount_usd
                FROM payments
                WHERE deleted_at IS NULL
                  AND payment_date >= ${fromDate}
                  AND payment_date <= ${toDate}
            )
            ORDER BY timestamp DESC
            LIMIT ${limit}
        `;

        return rows.map((row) => ({
            id: row.id,
            type: row.type,
            description: row.description,
            timestamp: row.timestamp,
            amountUsd: row.amount_usd !== null ? parseFloat(row.amount_usd) : null,
        }));
    }

    async getRevenueByBucket(
        fromDate: Date,
        toDate: Date,
        bucket: RevenueBucket,
    ): Promise<RevenueChartPoint[]> {
        let rows: ChartDataPoint[];

        if (bucket === 'hour') {
            rows = await this.prisma.$queryRaw<ChartDataPoint[]>`
                SELECT
                    date_trunc('hour', created_at) AS bucket,
                    SUM(total_usd)::text AS total_usd,
                    SUM(total_ves)::text AS total_ves
                FROM sales
                WHERE deleted_at IS NULL
                  AND status = 'COMPLETED'
                  AND created_at >= ${fromDate}
                  AND created_at <= ${toDate}
                GROUP BY date_trunc('hour', created_at)
                ORDER BY bucket ASC
            `;
        } else {
            rows = await this.prisma.$queryRaw<ChartDataPoint[]>`
                SELECT
                    date_trunc('day', created_at) AS bucket,
                    SUM(total_usd)::text AS total_usd,
                    SUM(total_ves)::text AS total_ves
                FROM sales
                WHERE deleted_at IS NULL
                  AND status = 'COMPLETED'
                  AND created_at >= ${fromDate}
                  AND created_at <= ${toDate}
                GROUP BY date_trunc('day', created_at)
                ORDER BY bucket ASC
            `;
        }

        return rows.map((row) => ({
            timestamp: row.bucket.toISOString(),
            totalUsd: parseFloat(row.total_usd),
            totalVes: parseFloat(row.total_ves),
        }));
    }
}
