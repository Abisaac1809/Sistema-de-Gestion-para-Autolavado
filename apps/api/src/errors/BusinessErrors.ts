export abstract class BusinessError extends Error {
    public readonly abstract name: string;
    public readonly abstract statusCode: number;

    constructor(message: string) {
        super(message);
    }
}

// Category-specific errors
export class CategoryNotFoundError extends BusinessError {
    public readonly name = 'CategoryNotFoundError';
    public readonly statusCode = 404;
}

export class CategoryAlreadyExistsError extends BusinessError {
    public readonly name = 'CategoryAlreadyExistsError';
    public readonly statusCode = 409;
}

export class CategoryHasProductsError extends BusinessError {
    public readonly name = 'CategoryHasProductsError';
    public readonly statusCode = 409;
}

// Product-specific errors
export class ProductNotFoundError extends BusinessError {
    public readonly name = 'ProductNotFoundError';
    public readonly statusCode = 404;
}

export class ProductAlreadyExistsError extends BusinessError {
    public readonly name = 'ProductAlreadyExistsError';
    public readonly statusCode = 409;
}

// Service-specific errors
export class ServiceNotFoundError extends BusinessError {
    public readonly name = 'ServiceNotFoundError';
    public readonly statusCode = 404;
}

export class ServiceAlreadyExistsError extends BusinessError {
    public readonly name = 'ServiceAlreadyExistsError';
    public readonly statusCode = 409;
}

export class ServiceInactiveError extends BusinessError {
    public readonly name = 'ServiceInactiveError';
    public readonly statusCode = 400;
}

// PaymentMethod-specific errors
export class PaymentMethodNotFoundError extends BusinessError {
    public readonly name = 'PaymentMethodNotFoundError';
    public readonly statusCode = 404;
}

export class PaymentMethodAlreadyExistsError extends BusinessError {

    public readonly name = 'PaymentMethodAlreadyExistsError';

    public readonly statusCode = 409;

}



// Customer-specific errors

export class CustomerNotFoundError extends BusinessError {

    public readonly name = 'CustomerNotFoundError';

    public readonly statusCode = 404;

}



export class CustomerAlreadyExistsError extends BusinessError {

    public readonly name = 'CustomerAlreadyExistsError';

    public readonly statusCode = 409;

}

// NotificationContact-specific errors
export class NotificationContactNotFoundError extends BusinessError {
    public readonly name = 'NotificationContactNotFoundError';
    public readonly statusCode = 404;
}

export class NotificationContactAlreadyExistsError extends BusinessError {
    public readonly name = 'NotificationContactAlreadyExistsError';
    public readonly statusCode = 409;
}

// Order-specific errors
export class OrderNotFoundError extends BusinessError {
    public readonly name = 'OrderNotFoundError';
    public readonly statusCode = 404;
}

export class InvalidOrderStatusTransitionError extends BusinessError {
    public readonly name = 'InvalidOrderStatusTransitionError';
    public readonly statusCode = 400;
}

export class InsufficientStockError extends BusinessError {
    public readonly name = 'InsufficientStockError';
    public readonly statusCode = 400;
}

export class OrderDetailNotFoundError extends BusinessError {
    public readonly name = 'OrderDetailNotFoundError';
    public readonly statusCode = 404;
}

export class InvalidOrderDetailError extends BusinessError {
    public readonly name = 'InvalidOrderDetailError';
    public readonly statusCode = 400;
}

// Sale-specific errors
export class SaleNotFoundError extends BusinessError {
    public readonly name = 'SaleNotFoundError';
    public readonly statusCode = 404;
}

export class InvalidSaleStatusTransitionError extends BusinessError {
    public readonly name = 'InvalidSaleStatusTransitionError';
    public readonly statusCode = 400;
}

export class OrderAlreadyHasSaleError extends BusinessError {
    public readonly name = 'OrderAlreadyHasSaleError';
    public readonly statusCode = 409;
}

export class InvalidOrderForSaleError extends BusinessError {
    public readonly name = 'InvalidOrderForSaleError';
    public readonly statusCode = 400;
}

// Payment-specific errors
export class PaymentNotFoundError extends BusinessError {
    public readonly name = 'PaymentNotFoundError';
    public readonly statusCode = 404;
}

export class PaymentExceedsOrderTotalError extends BusinessError {
    public readonly name = 'PaymentExceedsOrderTotalError';
    public readonly statusCode = 400;
}

export class OrderAlreadyPaidError extends BusinessError {
    public readonly name = 'OrderAlreadyPaidError';
    public readonly statusCode = 400;
}

export class InvalidPaymentAmountError extends BusinessError {
    public readonly name = 'InvalidPaymentAmountError';
    public readonly statusCode = 400;
}

export class PaymentMethodInactiveError extends BusinessError {
    public readonly name = 'PaymentMethodInactiveError';
    public readonly statusCode = 400;
}

export class ReversalRequiresNotesError extends BusinessError {
    public readonly name = 'ReversalRequiresNotesError';
    public readonly statusCode = 400;
}

export class SaleAlreadyPaidError extends BusinessError {
    public readonly name = 'SaleAlreadyPaidError';
    public readonly statusCode = 400;
}

export class PaymentExceedsSaleTotalError extends BusinessError {
    public readonly name = 'PaymentExceedsSaleTotalError';
    public readonly statusCode = 400;
}

// StoreInfo-specific errors
export class StoreInfoNotFoundError extends BusinessError {
    public readonly name = 'StoreInfoNotFoundError';
    public readonly statusCode = 404;
}

// InventoryAdjustment-specific errors
export class InventoryAdjustmentNotFoundError extends BusinessError {
    public readonly name = 'InventoryAdjustmentNotFoundError';
    public readonly statusCode = 404;
}

export class InsufficientAdjustmentStockError extends BusinessError {
    public readonly name = 'InsufficientAdjustmentStockError';
    public readonly statusCode = 422;
}
