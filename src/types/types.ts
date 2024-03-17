export interface ApiResponse {
	ok: boolean;
	status: string;
	message: string;
	data?: any;
}

export interface User {
	id: number;
	fullname: string;
	email: string;
	phone: string;
	//@ts-ignore
	avatar?: string;
	status: number;
}

export interface Package {
	id: number;
	trackingCode: string;
	nameFrom: string;
	addressFrom: string;
	postalCodeFrom: string;
	nameTo: string;
	addressTo: string;
	postalCodeTo: string;
	packageSize: number;
	packageNote: string;
	totalFee: number;
	serviceId: number;
	step: number;
	status: number;
}

export interface Address {
	name: string;
	phoneNumber: string;
	address: string;
	ward: string;
	district: string;
	city: string;
	postalCode: string;
	typeInfo: number;
}

export interface UserWithPackages extends User {
	packages: Package[];
}

export interface UserWithAddresses extends User {
	packages: Address[];
}

export interface UserWithAll extends User {
	addresses: Address[];
	packages: Package[];
}

export interface ImageType {
	name: string;
	width: number;
	height: number;
	alt?: string;
}

export interface EmployeeProps {
	params: {
		employeeCode: string;
	};
}

export interface Province {
	id: number;
	locationName: string;
	postalCode: string;
}

export interface User {
	id: number;
	fullname: string;
	//@ts-ignore
	avatar: string;
	email: string;
	phoneNumber: string;
	status: number;
	createAt: string;
}

export interface Employee {
	id: number;
	employeeCode: string;
	fullname: string;
	avatar: string;
	email: string;
	password: string;
	phoneNumber: string;
	postalCode: string;
	address: string;
	province: string;
	district: string;
	roleName: string;
	roleId: number;
	branchName: string;
	branchId: number;
	status: number;
	submitedInfo: string;
	historyLogs: [
		{
			id: number;
			packageId: number;
			employeeId: number;
			photos: string[];
			historyNote: string;
			step: number;
			processStep: number;
			updatedAt: string;
		}
	];
}
export interface Branch {
	id: number;
	branchName: string;
}
export interface Role {
	id: number;
	name: string;
	roleHasPermissions: string[];
	status: number;
}
export interface Permission {
	id: number;
	permissionName: string;
}
export interface Location {
	id: number;
	locationName: string;
	postalCode: string;
	locationLevel: number;
	locationOf: number;
	parentLocation: string;
}
export interface CreateEmployeeRequest {
	employeeCode: string;
	fullname: string;
	avatar: string;
	email: string;
	password: string;
	phoneNumber: string;
	postalCode: string;
	address: string;
	province: string;
	district: string;
	branchId: number;
	roleId: number;
}
export interface CreatePermissionRequest {
	permissionNames: string[];
}
export interface CreateRoleRequest {
	id: number;
	name: string;
	roleHasPermissions: string[];
	status: 1;
}
export interface CreatePermission {
	name: string;
}
export interface UpdateEmployeeRequest {
	branchId: number;
	roleId: number;
}
export interface UpdateInfoRequest {
	email: string;
	phonenumber: string;
	postalcode: string;
	address: string;
	province: string;
	district: string;
	avatar: string;
}
export interface UpdatePasswordRequest {
	password: string;
}
export interface AcceptEmployeeRequest {
	id: number;
	employeeCode: string;
	fullname: string;
	avatar: string;
	email: string;
	password: string;
	phoneNumber: string;
	address: string;
	province: string;
	district: string;
	roleName: string;
	roleId: number;
	branchName: string;
	branchId: number;
	status: number;
	submitedInfo: {
		avatar: string;
		email: string;
		phonenumber: string;
		postalcode: string;
		address: string;
		province: string;
		district: string;
	};
}
