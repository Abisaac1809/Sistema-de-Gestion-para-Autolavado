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