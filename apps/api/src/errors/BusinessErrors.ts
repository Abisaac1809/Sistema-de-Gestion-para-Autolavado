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
