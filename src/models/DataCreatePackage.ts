import {Item} from "@/models/Item";

export interface DataCreatePackage {

    type_sender: string;
    select_sender: {
    };
    phoneNumber_sender: string;
    fullName_sender: string;
    address_sender: string;
    province_sender: string;
    district_sender: string;
    ward_sender: string;
    postalCode_sender: string;

    type_receiver: string;
    select_receiver: {};
    phoneNumber_receiver: string;
    fullName_receiver: string;
    address_receiver: string;
    province_receiver: string;
    district_receiver: string;
    ward_receiver: string;
    postalCode_receiver: string;

    type_package: string;
    list_items: [Item];
    total_weight: string;
    total_value: string;

    package_size: {
        width: string;
        height: string;
        length: string;
    };
    size_convert: string;

    package_note: string;
}