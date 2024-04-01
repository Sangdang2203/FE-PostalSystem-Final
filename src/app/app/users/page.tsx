"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import Loading from "@/app/components/Loading";
import {
	Avatar,
	Box,
	Button,
	Grid,
	Paper,
	Switch,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
} from "@mui/material";
import {
	CloseOutlined,
	DriveFileRenameOutline,
	Update,
	SearchOutlined,
} from "@mui/icons-material";
import { ApiResponse, User, Role, Province } from "@/types/types";
import {
	getProvinces,
	getChildrenLocationsByParentId,
	fetchUsers,
	fetchRolesWithPermission,
	fetchChangeStatus,
} from "@/app/_data/data";
import { useSession } from "next-auth/react";

export default function UserManagement() {
	const [users, setUsers] = React.useState<User[]>([]);
	const [user, setUser] = React.useState<User>();
	const [roles, setRoles] = React.useState<Role[]>([]);
	const [provinces, setProvinces] = React.useState<Province[]>([]);
	const [districts, setDistricts] = React.useState<Province[]>([]);
	const [loading, setLoading] = React.useState(true);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	// const province = watch("province");
	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// fetch data
	React.useEffect(() => {
		Promise.all([
			fetchUsers(),
			fetchRolesWithPermission(),
			getProvinces(),
		]).then(data => {
			const [userRes, roleRes, provinceRes] = data;

			if (userRes.ok) {
				setUsers(userRes.data.reverse());
			}

			if (roleRes.ok) {
				setRoles(roleRes.data);
			}

			if (provinceRes.ok) {
				setProvinces(provinceRes.data);
			}

			setLoading(false);
		});
	}, []);

	// Handle Search
	function handleSearch(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const nameInput = document.getElementById(
			"searchInput"
		) as HTMLInputElement;
		const name = nameInput.value.trim();

		if (name === "") {
			fetchUsers().then(data => {
				if (data.ok) {
					setUsers(data.data.reverse());
				}
			});
		} else {
			const filterUsers = users.filter(
				user =>
					user.fullname.toLowerCase().includes(name.toLowerCase()) ||
					user.email.toLowerCase().includes(name.toLowerCase())
			);

			setUsers(filterUsers);
		}
	}

	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<>
					<Paper
						elevation={6}
						sx={{ borderRadius: "10px", boxSizing: "border-box" }}>
						<Grid container>
							<Grid
								item
								xs={12}
								sm={6}
								className="flex justify-between items-center p-3"></Grid>
							<Grid
								item
								xs={12}
								sm={6}>
								<form
									onSubmit={handleSearch}
									method="post"
									className="flex justify-end items-center my-3 relative">
									<input
										type="text"
										name="search"
										id="searchInput"
										className="mr-3 px-2 text-[14px] rounded-md min-w-[300px] min-h-[40px] cursor-pointer"
										placeholder="Enter name to search"
									/>
									<div className="absolute inset-y-0 right-0 flex items-center">
										<Button
											color="success"
											variant="text"
											size="small"
											className="rounded-full">
											<SearchOutlined fontSize="small" />
										</Button>
									</div>
								</form>
							</Grid>
						</Grid>
					</Paper>

					<Paper
						elevation={6}
						sx={{ my: 3, borderRadius: "10px", boxSizing: "border-box" }}>
						<TableContainer sx={{ width: "100%", overflow: "hidden" }}>
							<Table
								className="mt-3"
								sx={{ minWidth: 650 }}
								size="small"
								aria-label="a dense table">
								<TableHead>
									<TableRow>
										<TableCell
											align="center"
											className="text-white text-sm">
											#
										</TableCell>
										<TableCell
											align="center"
											className="text-white text-sm">
											Fullname
										</TableCell>
										<TableCell
											align="center"
											className="text-white text-sm">
											Email
										</TableCell>
										<TableCell
											align="center"
											className="text-white text-sm">
											Phone Number
										</TableCell>
										<TableCell
											align="center"
											className="text-white text-sm">
											Avatar
										</TableCell>
										<TableCell
											align="center"
											className="text-white text-sm">
											Status
										</TableCell>
										<TableCell
											align="center"
											className="text-white text-sm">
											Create At
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{users.length === 0 && (
										<TableRow>
											<TableCell
												colSpan={7}
												align="center"
												className="text-sm">
												No data ...
											</TableCell>
										</TableRow>
									)}
									{users
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map(user => {
											return (
												<TableRow
													key={user.id}
													sx={{
														"&:last-child td, &:last-child th": { border: 0 },
													}}>
													<TableCell align="center">{user.id}</TableCell>
													<TableCell align="center">{user.fullname}</TableCell>
													<TableCell align="center">{user.email}</TableCell>
													<TableCell align="center">
														{user.phone}
													</TableCell>
													<TableCell align="center">
														<Avatar
															style={{ marginLeft: "2rem" }}
															src={user.avatar}
															alt={user.fullname}
														/>
													</TableCell>

													<TableCell align="center">
														<Switch
															size="small"
															color="success"
															className="cursor-pointer"
															checked={user.status == 1 ? true : false}
														/>
													</TableCell>
													<TableCell align="center">{user.createAt}</TableCell>
												</TableRow>
											);
										})}
								</TableBody>
							</Table>
							<TablePagination
								component="div"
								count={users.length || 0}
								page={page}
								onPageChange={handleChangePage}
								rowsPerPage={rowsPerPage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</TableContainer>
					</Paper>
				</>
			)}
		</>
	);
}
