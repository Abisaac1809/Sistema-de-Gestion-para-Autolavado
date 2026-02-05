export default class Service {
    public readonly id: string;
    public name: string;
    public description: string | null;
    public price: number;

    public status: boolean;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date | null | undefined;

    constructor(data: {
        id: string;
        name: string;
        description: string | null;
        price: number;

        status: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt?: Date | null;
    }) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.price = data.price;

        this.status = data.status;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
    }
}
