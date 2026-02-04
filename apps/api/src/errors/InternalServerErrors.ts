export abstract class InternalServerError extends Error {
    public readonly abstract name: string;
    public readonly abstract statusCode: number;

    constructor(message: string) {
        super(message);
    }
}