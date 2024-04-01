// import { ApiResponse } from "@/types/types";

// export const getProvinces = async () => {
// 	const res = await fetch("/api/locations/getlistprovince", {
// 		method: "GET",
// 	});

// 	return res.json() as Promise<ApiResponse>;
// };

// export const getChildrenLocationsByParentId = async (id: number) => {
// 	const res = await fetch("/api/locations/getchildlocation/" + id, {
// 		method: "GET",
// 	});

// 	return res.json() as Promise<ApiResponse>;
// };

// export const fetchUsers = async () => {
// 	const res = await fetch("/api/user", {
// 		method: "GET",
// 	});
// 	return res.json() as Promise<ApiResponse>;
// };

// export const fetchEmployees = async () => {
// 	const res = await fetch("/api/employees", {
// 		method: "GET",
// 	});
// 	return res.json() as Promise<ApiResponse>;
// };

// export const fetchChangeStatus = async (employeeId: number) => {
// 	const response = await fetch(
// 		process.env.NEXT_PUBLIC_API_URL + `/Employee/${employeeId}/ChangeStatus`,
// 		{
// 			method: "PUT",
// 			cache: "no-cache",
// 		}
// 	);
// };

// export const fetchPermissions = async () => {
// 	const res = await fetch("/api/permissions", {
// 		method: "GET",
// 	});
// 	return res.json() as Promise<ApiResponse>;
// };

// export const fetchAddPermission = async (
// 	roleId: number,
// 	permissionId: number
// ) => {
// 	const res = await fetch(
// 		process.env.NEXT_PUBLIC_API_URL +
// 			`/Role/${roleId}/Permission/${permissionId}`,
// 		{
// 			method: "POST",
// 			cache: "no-cache",
// 		}
// 	);
// };

// export const fetchBranches = async () => {
// 	const res = await fetch("/api/branches-new", {
// 		method: "GET",
// 	});
// 	return res.json() as Promise<ApiResponse>;
// };

// export const fetchLocations = async () => {
// 	const res = await fetch("/api/locations", {
// 		method: "GET",
// 	});
// 	return res.json() as Promise<ApiResponse>;
// };

// export const fetchUpdatedRequests = async () => {
// 	const res = await fetch("/api/requests", {
// 		method: "GET",
// 	});
// 	return res.json() as Promise<ApiResponse>;
// };

// export const fetchProvinces = async () => {
// 	const res = await fetch("/api/provinces", {
// 		method: "GET",
// 	});
// 	return res.json() as Promise<ApiResponse>;
// };

// export const fetchRoles = async () => {
// 	const res = await fetch("/api/roles", {
// 		method: "GET",
// 	});
// 	return res.json() as Promise<ApiResponse>;
// };

// export const fetchRolesWithPermission = async () => {
// 	const res = await fetch("/api/roles/permissions", {
// 		method: "GET",
// 	});

// 	return res.json() as Promise<ApiResponse>;
// };
