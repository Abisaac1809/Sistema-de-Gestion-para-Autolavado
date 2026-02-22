import type { RevenueKpis, OperationsKpis, PaymentMethodBreakdownItem, TopServiceItem, TopProductItem, InventoryAlertItem, AdjustmentTypeSummary } from './Dashboard.dto.js';
import type { CurrentExchangeRateInfo } from './ExchangeRateConfig.dto.js';

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
