"use client";

import Loading from "@/components/Loading";
import { fetchPermissions, fetchRolesWithPermission } from "@/app/_data/method";
import {
	Avatar,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Tooltip,
	Chip,
	Input,
	Autocomplete,
	Checkbox,
	TextField,
	Card,
	Box,
	CardContent,
	CardActions,
	Typography,
} from "@mui/material";
import { CloseOutlined, AddCircle, DeleteOutline, CheckBoxOutlineBlank, CheckBox } from "@mui/icons-material";
import { useForm, SubmitHandler } from "react-hook-form";
import { ApiResponse, CreatePermission, CreatePermissionRequest, CreateRoleRequest, Permission, Role } from "@/types/types";
import { toast } from "sonner";
import React from "react";

export default function RoleManagement() {
	const [loading, setLoading] = React.useState(true);
	const [selectedRoleId, setSelectedRoleId] = React.useState<Number>(0);
	const [roles, setRoles] = React.useState<Role[]>([]);
	const [permissions, setPermissions] = React.useState<Permission[]>([]);

	const [openAddPermisson, setOpenAddPermisson] = React.useState(false);
	const [openAddRole, setOpenAddRole] = React.useState(false);
	const [createPermission, setCreatePermission] = React.useState(false);
	const [openModal, setOpenModal] = React.useState(false);
	const [selectedRole, setSelectedRole] = React.useState<Role | null>(null);

	const {
		register: roleRegister,
		handleSubmit: roleHandleSubmit,
		formState: { errors: roleErrors },
	} = useForm<CreateRoleRequest>();

	const {
		register: permissionRegister,
		handleSubmit: permissionHandleSubmit,
		formState: { errors: permissionErrors },
		setValue,
	} = useForm<CreatePermissionRequest>();

	const {
		register,
		handleSubmit,
		formState: { errors: errors },
	} = useForm<CreatePermission>();

	// fetch data
	React.useEffect(() => {
		Promise.all([fetchRolesWithPermission(), fetchPermissions()]).then(data => {
			const [rolesRes, permissionRes] = data;
			if (rolesRes.ok) {
				setRoles(rolesRes.data);
			}
			if (permissionRes.ok) {
				setPermissions(permissionRes.data);
			}
			setLoading(false);
		});
	}, []);

	const handlePermissionChange = (
		event: any,
		value: { permissionName: any }[]
	) => {
		setValue(
			"permissionNames",
			value.map((v: { permissionName: any }) => v.permissionName)
		);
	};

	// Add new role
	async function AddRole(role: CreateRoleRequest) {
		const loadingId = toast.loading("Loading...");
		try {
			const res = await fetch("/api/roles/", {
				method: "POST",
				body: JSON.stringify(role),
			});

			const payload = (await res.json()) as ApiResponse;

			if (payload.ok) {
				const response = await fetchRolesWithPermission();
				setRoles(await response.data);
				setOpenAddRole(false);
				toast.success(payload.message);
			} else {
				toast.error(payload.message);
			}
		} catch (error) {
			console.log(error);
		}
		toast.dismiss(loadingId);
	}
	// Remove role
	const handleDeleteRole = async (roleId: number) => {
		const loadingId = toast.loading("Loading...");
		const response = await fetch(`/api/roles/${roleId}`, {
			method: "DELETE",
		});

		const payload = (await response.json()) as ApiResponse;

		if (roleId <= 4 && payload.ok) {
			toast.error("Failed to delete! The role is one of system roles.");
		} else if (roleId > 4 && payload.ok) {
			setRoles(pre => pre.filter(role => role.id !== roleId));
			toast.success(payload.message);
		} else {
			toast.error(payload.message);
		}
		toast.dismiss(loadingId);
	};
	//Create permission
	async function createOnePermission(formData: CreatePermission) {
		const loadingId = toast.loading("Loading...");
		const res = await fetch(`/api/permissions`, {
			method: "POST",
			body: JSON.stringify(formData),
		});

		const payload = (await res.json()) as ApiResponse;

		if (payload.ok) {
			const response = await fetchPermissions();
			setPermissions(await response.data);
			setCreatePermission(false);
			toast.success(payload.message);
		} else {
			toast.error(payload.message);
		}
		toast.dismiss(loadingId);
	}
	// Add permissions into role
	async function AddPermission(formData: CreatePermissionRequest) {
		const loadingId = toast.loading("Loading...");
		const res = await fetch(`/api/roles/${selectedRoleId}/permission`, {
			method: "POST",
			body: JSON.stringify(formData),
		});

		const payload = (await res.json()) as ApiResponse;

		if (payload.ok) {
			setRoles(pre => {
				return pre.map(role => {
					if (role.id === payload.data.id) {
						return payload.data;
					}
					return role;
				});
			});
			setOpenAddPermisson(false);
			toast.success(payload.message);
		} else {
			toast.error(payload.message);
		}
		toast.dismiss(loadingId);
	}

	// Remove permission from role
	const handleDelete = async (roleId: number, permissionName: string) => {
		const loadingId = toast.loading("Loading...");
		const res = await fetch(
			`/api/roles/${roleId}/permission/${permissionName}`,
			{
				method: "DELETE",
			}
		);

		const payload = (await res.json()) as ApiResponse;

		if (payload.ok) {
			setRoles(pre =>
				pre.map(role => {
					if (role.id === roleId) {
						const index = role.roleHasPermissions.findIndex(
							rhp => rhp === permissionName
						);
						role.roleHasPermissions.splice(index, 1);
					}
					return role;
				})
			);
			toast.success(payload.message);
		} else {
			toast.error(payload.message);
		}
		toast.dismiss(loadingId);
	};

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<div className="mt-4">
					<Box className="mx-2 flex justify-between items-center">
						<Button color="primary" variant="contained" size="small" sx={{ my: 12 }}
							onClick={() => setOpenAddRole(true)} >
							<Tooltip title="Add Role">
								<Typography>+ Add</Typography>
							</Tooltip>
						</Button>
					</Box>

					{/* Role card */}
					<Box className="grid sm:grid-cols-3 gap-x-0 gap-y-10">
						{roles.map(role => (
							<Card
								key={role.id}
								className="relative mx-2 px-1 rounded-md hover:shadow-lg cursor-pointer"
							>
								<CardContent className="relative mb-3">
									<Box className="w-full h-full flex justify-between items-center">
										<Avatar
											src={role.name.slice(0, 1)}
											alt={role.name}
											className="w-16 h-16"
										/>
										<Box className="">
											<Typography
												className={
													role.name === "Admin"
														? "text-green-700 font-semibold"
														: "text-orange-400"
												}
											>
												{role.name}
											</Typography>
										</Box>
									</Box>

									<Box className="my-2">
										{role.roleHasPermissions.length > 0 && role.roleHasPermissions.slice(0, 4).map(permission => (
											<Chip
												key={permission} label={permission} color="default" variant="outlined" size="small" className="text-xs mr-1"
												onDelete={() => {
													handleDelete(role.id, permission);
												}}
											/>
										))}
										{role.roleHasPermissions.length > 4 ?
											(<div><p className="text-xs">and {(role.roleHasPermissions.length - 4)} others</p>
												<Button variant="text" size="small" onClick={() => setSelectedRole(role)}> ... see all</Button></div>
											)
											: ""
										}
									</Box>

									{selectedRole && (<Dialog
										open
										className="max-w-[500px] mx-auto">
										<Tooltip title="Close">
											<CloseOutlined
												onClick={() => setSelectedRole(null)}
												color="error"
												className="text-md absolute top-1 right-1 rounded-full hover:opacity-80 hover:bg-red-200 cursor-pointer"
											/>
										</Tooltip>
										<DialogContent>
											<Typography
												className={
													selectedRole.name === "Admin"
														? "text-green-700 font-semibold my-1"
														: "text-orange-400 my-1"
												}
											>
												{selectedRole.name} has permissions, include:
											</Typography>
											{selectedRole.roleHasPermissions.map(permission => {
												return (
													<Chip
														key={permission}
														label={permission}
														color="default"
														variant="outlined"
														size="small"
														className="text-xs mr-1"
														onDelete={() => {
															handleDelete(selectedRole.id, permission);
														}}
													/>
												);
											})}
										</DialogContent>
									</Dialog>)}

								</CardContent>

								<CardActions className="absolute inset-x-0 bottom-1 mt-10 flex justify-between items-center">
									<Tooltip title="Add Permission">
										<Button
											onClick={() => {
												setOpenAddPermisson(true);
												setSelectedRoleId(role.id);
											}}
											size="small"
											color="info"
											variant="text"
											className="rounded-full hover:opacity-75"
										>
											<AddCircle fontSize="small" />
										</Button>
									</Tooltip>

									<Tooltip title="Remove Role">
										<Button
											onClick={() => {
												if (
													window.confirm("Are you sure to remove this role?")
												) {
													handleDeleteRole(role.id);
												}
											}}
											size="small"
											color="error"
											variant="text"
											className="rounded-full hover:opacity-75"
										>
											<DeleteOutline fontSize="small" />
										</Button>
									</Tooltip>
								</CardActions>
							</Card>
						))}
					</Box>

					{/* Form add new role */}
					<Dialog
						open={openAddRole}
						onClose={() => setOpenAddRole(false)}
						className="max-w-[500px] mx-auto"
					>
						<Tooltip title="Close">
							<CloseOutlined
								onClick={() => setOpenAddRole(false)}
								color="error"
								className="text-md absolute top-1 right-1 rounded-full hover:opacity-80 hover:bg-red-200 cursor-pointer"
							/>
						</Tooltip>

						<DialogTitle className="text-center mt-2">Add Role</DialogTitle>

						<DialogContent>
							<form
								onSubmit={roleHandleSubmit(AddRole)}
								className="text-xs"
							>
								<div className="my-3">
									<div>
										<label className="font-semibold">Name:</label>
									</div>
									<Input
										autoFocus color="info" style={{ width: 350 }}
										{...roleRegister("name", {
											required: "Role name is required.",
										})}
										placeholder="Enter role name"
									/>
								</div>

								<span className="text-danger">{roleErrors.name?.message}</span>

								<div className="flex justify-around my-3">
									<Button
										color="success"
										variant="contained"
										size="medium"
										type="submit"
										className="w-full"
									>
										+ Add New
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>

					{/* Form add permissions into role */}
					<Dialog
						open={openAddPermisson}
						onClose={() => setOpenAddPermisson(false)}
						className="mx-auto"
					>
						<Tooltip title="Close">
							<CloseOutlined
								onClick={() => setOpenAddPermisson(false)}
								color="error"
								className="text-md absolute top-1 right-1 rounded-full hover:opacity-80 hover:bg-red-200 cursor-pointer"
							/>
						</Tooltip>

						<DialogTitle className="text-center mt-2">
							Add Permissions
						</DialogTitle>

						<DialogContent>
							<form className="text-xs">
								<Autocomplete
									{...permissionRegister("permissionNames")}
									className="my-2"
									color="secondary"
									multiple
									id="checkboxes-tags-demo"
									options={permissions}
									disableCloseOnSelect
									getOptionLabel={option => option.permissionName}
									renderOption={(props, option, { selected }) => (
										<li
											key={option.permissionName}
											{...props}
										>
											<Checkbox
												icon={<CheckBoxOutlineBlank fontSize="small" />}
												checkedIcon={<CheckBox fontSize="small" />}
												style={{ marginRight: 8 }}
												checked={selected}
											/>
											{option.permissionName}
											<Button
												onClick={() => setCreatePermission(true)}
											></Button>
										</li>
									)}
									style={{ width: 350 }}
									renderInput={params => (
										<TextField
											{...params}
											label="Permissions"
											placeholder="Add permission"
										/>
									)}
									onChange={handlePermissionChange}
								/>
								<Button
									color="secondary"
									variant="text"
									onClick={() => setCreatePermission(true)}
								>
									Add other permission
								</Button>

								<div className="flex justify-around mb-2 mt-10">
									<Button
										onClick={permissionHandleSubmit(AddPermission)}
										type="submit"
										color="success"
										variant="contained"
										size="medium"
										className="w-full"
									>
										+ Add permission
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>

					{/* Create one permission */}
					<Dialog
						open={createPermission}
						onClose={() => setCreatePermission(false)}
						className="max-w-[500px] mx-auto"
					>
						<Tooltip title="Close">
							<CloseOutlined
								onClick={() => setCreatePermission(false)}
								color="error"
								className="text-md absolute top-1 right-1 rounded-full hover:opacity-80 hover:bg-red-200 cursor-pointer"
							/>
						</Tooltip>

						<DialogContent>
							<form
								onSubmit={handleSubmit(createOnePermission)}
								className="text-xs"
							>
								<div className="my-3">
									<div>
										<label className="font-semibold">Name:</label>
									</div>
									<Input
										autoFocus
										color="info"
										style={{ width: 350 }}
										{...register("name", {
											required: "Permission name is required.",
										})}
										placeholder="Enter permission name"
									/>
								</div>

								<span className="text-danger">{roleErrors.name?.message}</span>

								<div className="flex justify-around my-3">
									<Button
										color="success"
										variant="contained"
										size="medium"
										type="submit"
										className="w-full"
									>
										+ Add New
									</Button>
								</div>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			)}
		</>
	);
}
