import { CategoryType } from "../types/dtos/Category.dto";

export default class Category {
    public readonly id: string;
    public name: string;
    public description: string | null | undefined;
    public status: boolean;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date | null | undefined;

    constructor(data: CategoryType) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.status = data.status;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
    }
}
