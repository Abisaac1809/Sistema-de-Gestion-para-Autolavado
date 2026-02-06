import { NotificationContactType } from "../types/dtos/NotificationContact.dto";

export default class NotificationContact {
    public readonly id: string;
    public fullName: string | null;
    public email: string;
    public receiveReports: boolean;
    public isActive: boolean;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt: Date | null | undefined;

    constructor(data: NotificationContactType) {
        this.id = data.id;
        this.fullName = data.fullName;
        this.email = data.email;
        this.receiveReports = data.receiveReports;
        this.isActive = data.isActive;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
    }
}
