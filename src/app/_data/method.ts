import { ApiResponse } from "@/types/types";

export const getProvinces = async () => {
	const res = await fetch("/api/locations/getlistprovince", {
		method: "GET",
	});

	return res.json() as Promise<ApiResponse>;
};

export const getChildrenLocationsByParentId = async (id: number) => {
	const res = await fetch("/api/locations/getchildlocation/" + id, {
		method: "GET",
	});

	return res.json() as Promise<ApiResponse>;
};

export const fetchUsers = async () => {
	const res = await fetch("/api/user", {
		method: "GET",
	});
	return res.json() as Promise<ApiResponse>;
};

export const fetchEmployees = async () => {
	const res = await fetch("/api/employees", {
		method: "GET",
	});
	return res.json() as Promise<ApiResponse>;
};

export const fetchChangeStatus = async (employeeId: number) => {
	const response = await fetch(
		process.env.NEXT_PUBLIC_API_URL + `/Employee/${employeeId}/ChangeStatus`,
		{
			method: "PUT",
			cache: "no-cache",
		}
	);
};

export const fetchPermissions = async () => {
	const res = await fetch("/api/permissions", {
		method: "GET",
	});
	return res.json() as Promise<ApiResponse>;
};

export const fetchAddPermission = async (
	roleId: number,
	permissionId: number
) => {
	const res = await fetch(
		process.env.NEXT_PUBLIC_API_URL +
			`/Role/${roleId}/Permission/${permissionId}`,
		{
			method: "POST",
			cache: "no-cache",
		}
	);
};

export const fetchBranches = async () => {
	const response = await fetch("/api/branches", {
		method: "GET",
	});
	return response.json() as Promise<ApiResponse>;
};

export const fetchLocations = async () => {
	const res = await fetch("/api/locations", {
		method: "GET",
	});
	return res.json() as Promise<ApiResponse>;
};

export const fetchUpdatedRequests = async () => {
	const res = await fetch("/api/requests", {
		method: "GET",
	});
	return res.json() as Promise<ApiResponse>;
};

export const fetchRoles = async () => {
	const res = await fetch("/api/roles", {
		method: "GET",
	});
	return res.json() as Promise<ApiResponse>;
};

export const fetchRolesWithPermission = async () => {
	const res = await fetch("/api/roles/permissions", {
		method: "GET",
	});

	return res.json() as Promise<ApiResponse>;
};

export const fetchProvinces = async () => {
	const res = await fetch("/api/provinces", {
		method: "GET",
	});
	return res.json() as Promise<ApiResponse>;
};

export const getReceiverAddressesByUserId = async (
	id: number,
	token: string
) => {
	const res = await fetch(`/api/users/${id}/addresses/receiver`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		credentials: "include",
	});

	return res.json() as Promise<ApiResponse>;
};

export const getSenderAddressesByUserId = async (id: number, token: string) => {
	const res = await fetch(`/api/users/${id}/addresses/sender`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		credentials: "include",
	});

	return res.json() as Promise<ApiResponse>;
};

export const getUserById = async (id: number, token: string) => {
	const res = await fetch(`/api/users/${id}`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		credentials: "include",
	});

	return res.json() as Promise<ApiResponse>;
};

export const addAddressByUserId = async (
	userId: number,
	token: string,
	data: {
		postalCode: string | undefined;
		name: string;
		phoneNumber: string;
		address: string;
		city: string;
		district: string;
		ward: string;
		typeInfo: number;
	}
) => {
	const res = await fetch(`/api/users/${userId}/addresses`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
		credentials: "include",
	});

	return res.json() as Promise<ApiResponse>;
};

export const updateUserById = async (
	id: number,
	token: string,
	data: {
		fullname: string;
		email: string;
		phone: string;
	}
) => {
	const res = await fetch(`/api/users/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		credentials: "include",
		body: JSON.stringify(data),
	});

	return res.json() as Promise<ApiResponse>;
};

export const refreshToken = async (token: string) => {
	const res = await fetch(`/api/users/refresh-token`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
		},
		credentials: "include",
	});

	return res.json() as Promise<ApiResponse>;
};
