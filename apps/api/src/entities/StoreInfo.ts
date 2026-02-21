import { StoreInfoType } from "../types/dtos/StoreInfo.dto";

export default class StoreInfo {
    public readonly id: string;
    public logoUrl: string | null;
    public name: string;
    public rif: string;
    public address: string;
    public phone: string;
    public updatedAt: Date;

    constructor(data: StoreInfoType) {
        this.id = data.id;
        this.logoUrl = data.logoUrl;
        this.name = data.name;
        this.rif = data.rif;
        this.address = data.address;
        this.phone = data.phone;
        this.updatedAt = data.updatedAt;
    }
}