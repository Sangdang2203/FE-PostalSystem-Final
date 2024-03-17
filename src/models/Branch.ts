import {EStatusData} from "@/models/Enum/EStatusData";

export interface Branch{
    id?: number;
    branchName: string;
    address: string;
    phoneNumber: string;
    province: string;
    district: string;
    ward?: string;
    postalCode: string;
    status?: EStatusData;
}