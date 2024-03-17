export enum ELocationLevel {
    Province = 0,
    District = 1,
    Ward = 2
}

export enum Status {
    Active = 1,
    Inactive = 0,
}

export interface DataTypeService {
    id: number;
    serviceName: string;
    serviceDescription: string;
    createdAt: string;
    updatedAt: string;
    status: number;
}
export interface DataServiceType {
    id: number;
    serviceTypeId: number;
    weighFrom: number;
    weighTo: number;
    createdAt: string;
    updatedAt: string;
    status: number;
    serviceType: DataTypeService;
}

export interface DataLocationType {
    id: number;
    locationName: string;
    postalCode: string;
    locationLevel: ELocationLevel;
    locationOf: number;
    createdAt: string;
    updatedAt: string;
    status: number;
}

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
    status: number;
    service: DataServiceType;
    locationFrom: DataLocationType;
    locationTo: DataLocationType;
    overWeightCharge: number;
}
