export abstract class InternalServerError extends Error {
    public readonly abstract name: string;
    public readonly abstract statusCode: number;

    constructor(message: string) {
        super(message);
    }
}

export class InvalidExchangeRateSourceError extends InternalServerError {
    public readonly name = "InvalidExchangeRateSourceError";
    public readonly statusCode = 500;

    constructor(source: string) {
        super(`The exchange rate source '${source}' is invalid or not supported.`);
    }
}