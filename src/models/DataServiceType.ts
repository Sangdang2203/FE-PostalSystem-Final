import {EStatusData} from "@/models/Enum/EStatusData";

export interface DataServiceType {
    id: number;
    serviceName: string;
    serviceDescription: string;
    weighFrom: number;
    weighTo: number;
    createdAt: string;
    updatedAt: string;
    status: EStatusData;
}