export enum ExchangeRateSource {
    BCV_USD = 'BCV_USD',
    BCV_EUR = 'BCV_EUR',
    CUSTOM = 'CUSTOM',
}

export enum UnitType {
    LITERS = 'LITERS',
    MILLILITERS = 'MILLILITERS',
    KILOGRAMS = 'KILOGRAMS',
    GRAMS = 'GRAMS',
    UNITS = 'UNITS',
    BOXES = 'BOXES',
    BOTTLES = 'BOTTLES',
}

export enum AdjustmentType {
    IN = 'IN',
    OUT = 'OUT',
}

export enum AdjustmentReason {
    DAMAGED = 'DAMAGED',
    EXPIRED = 'EXPIRED',
    THEFT = 'THEFT',
    AUDIT_CORRECTION = 'AUDIT_CORRECTION',
    SPILLED = 'SPILLED',
    OTHER = 'OTHER',
}

export enum OrderStatus {
    PENDING = 'PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
}

export enum Currency {
    USD = 'USD',
    VES = 'VES',
    EUR = 'EUR',
}

export enum SaleStatus {
    COMPLETED = 'COMPLETED',
    REFUNDED = 'REFUNDED',
    CANCELLED = 'CANCELLED',
}
