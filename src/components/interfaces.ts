export interface Employee {
	id: number;
	employeeCode: string;
	email: string;
	password: string;
	fullname: string;
	address: string;
	avatar: string;
	branch: Branch;
	branchId: number;
	createdAt: string;
	district: string;
	historyLogs: any[]; // Replace with appropriate type
	phoneNumber: string;
	postalCode: string;
	province: string;
	role: any; // Replace with appropriate type
	roleId: number;
	status: number;
	submitedInfo: string;
	updatedAt: string;
}

export interface Branch {
	id: number;
	branchName: string;
	phoneNumber: string;
	address: string;
	createdAt: string;
	district: string;
	employees: any[]; // Replace with appropriate type
	postalCode: string;
	province: string;
	status: number;
	updatedAt: string;
}
export interface HistoryLog {
	id: number;
	packageId: number;
	employeeId: number;
	step: number;
	historyNote: string;
	createdAt: string;
	employee: Employee;
	employeeIdNextStep: number;
	employeeNextStep: any; // Replace with appropriate type
	package: any; // Replace with appropriate type
	photos: string;
	processStep: number;
	status: number;
	updatedAt: string;
}

export interface Item {
	id: number;
	packageId: number;
	itemName: string;
	itemWeight: number;
	itemQuantity: number;
	itemType: number;
	itemValue: number;
	createdAt: string;
	package: any; // Replace with appropriate type
	status: number;
	updatedAt: string;
}

export interface Service {
	id: number;
	serviceType: ServiceType;
	serviceTypeId: number;
	status: number;
	weightFrom: number;
	weightTo: number;
	createdAt: string;
	updatedAt: string;
}

export interface ServiceType {
	id: number;
	serviceName: string;
	serviceDescription: string;
	status: number;
	createdAt: string;
	updatedAt: string;
}

export interface Data {
	id: number;
	trackingCode: string;
	nameFrom: string;
	addressFrom: string;
	addressTo: string;
	createdAt: string;
	historyLogs: HistoryLog[];
	items: Item[];
	nameTo: string;
	packageNote: string;
	packageSize: string | null;
	packageType: number;
	postalCodeFrom: string;
	phoneFrom: string;
	postalCodeTo: string;
	service: Service;

	serviceId: number;
	status: number;
	step: number;
	totalFee: number;
	updatedAt: string;
	user: any;
	userId: number;
}

export interface TrackingDataItem {
	id: number;
	service: Service;
	feeCharge: number;
	timeProcess: number;
	status: number;
	createdAt: string;
	updatedAt: string;
	serviceName: string;
}

export interface TrackingData {
	expiry: number;
	value: Value;
	addressFrom: string;
	addressTo: string;
	createdAt: string;
	historyLogs: HistoryLog[];
	id: number;
	items: Item[];
	nameFrom: string;
	nameTo: string;
	packageNote: string;
	packageSize: any; // Replace with appropriate type
	postalCodeFrom: string;
	postalCodeTo: string;
	service: Service;
	serviceId: number;
	status: number;
	step: number;
	totalFee: number;
	trackingCode: string;
	updatedAt: string;
	user: any; // Replace with appropriate type
	userId: number;
}

export interface Value {
	id: number;
	trackingCode: string;
	nameFrom: string;
	addressFrom: string;
	postalCodeFrom: string;
	nameTo: string;
	addressTo: string;
	postalCodeTo: string;
	packageSize: null;
	packageNote: string;
	totalFee: number;
	serviceId: number;
	userId: number;
	step: number;
	createdAt: string;
	updatedAt: string;
	status: number;
	user: null;
	service: Service;
	items: Item[];
	historyLogs: HistoryLog[];
}
export interface BlogItem {
	id: number;
	title: string;
	slug: string;
	content: string;
	author: string;
	category: number;
	employeeId: number;
	createdAt: string;
	updatedAt: string;
	status: number;
	employee: Employee;
}

export interface SiteSetting {
	id: number;
	settingName: string;
	settingValue: string;
	status: number;
}

export interface SiteContextType {
	siteSetting: SiteSetting[];
}
