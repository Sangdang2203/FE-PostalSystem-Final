import {DataServiceType} from "@/models/DataServiceType";
import {DataLocationType} from "@/models/DataLocationType";
import {EStatusData} from "@/models/Enum/EStatusData";

export interface DataFeeCustomType {
    id: number;
    serviceId: number;
    locationIdFrom: number;
    locationIdTo: number;
    distance: number;
    feeCharge: number;
    timeProcess: number;
    createdAt: string;
    updatedAt: string;
    status: EStatusData;
    service: DataServiceType;
    locationFrom: DataLocationType;
    locationTo: DataLocationType;
}