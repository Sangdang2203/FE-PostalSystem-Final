import {ELocationLevel} from "@/models/Enum/ELocationLevel";
import {EStatusData} from "@/models/Enum/EStatusData";

export interface DataLocationType {
    id: number;
    locationName: string;
    postalCode: string;
    locationLevel: ELocationLevel;
    locationOf: number;
    createdAt: string;
    updatedAt: string;
    status: EStatusData;
}