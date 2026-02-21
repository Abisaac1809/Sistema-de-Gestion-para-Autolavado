import { CurrentExchangeRateInfo } from './ExchangeRateConfig.dto';
import {
    RevenueKpis,
    OperationsKpis,
    PaymentMethodBreakdownItem,
    TopServiceItem,
    TopProductItem,
    InventoryAlertItem,
    AdjustmentTypeSummary,
} from './Dashboard.dto';

export type {
    RevenueKpis,
    OperationsKpis,
    PaymentMethodBreakdownItem,
    TopServiceItem,
    TopProductItem,
    InventoryAlertItem,
    AdjustmentTypeSummary,
    CurrentExchangeRateInfo,
};

export type DailyReport = {
    date: string;
    revenue: RevenueKpis;
    operations: OperationsKpis;
    paymentBreakdown: PaymentMethodBreakdownItem[];
    topServices: TopServiceItem[];
    topProducts: TopProductItem[];
    inventoryAlerts: InventoryAlertItem[];
    adjustmentSummary: AdjustmentTypeSummary[];
    exchangeRate: CurrentExchangeRateInfo;
};
