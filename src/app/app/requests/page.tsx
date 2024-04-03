"use client";

import {
	Avatar,
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Grid,
	IconButton,
	InputLabel,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
	Tooltip,
} from "@mui/material";
import {
	CloseOutlined,
	SearchOutlined,
	Visibility,
} from "@mui/icons-material";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

import Loading from "@/app/components/Loading";
import { ApiResponse, AcceptEmployeeRequest, Employee } from "@/types/types";
import { fetchEmployees, fetchUpdatedRequests } from "@/app/_data/method";
import { toast } from "sonner";
import React from "react";

export default function UpdatedRequestManagement() {
	const [loading, seLoading] = React.useState(true);
	const [employees, setEmployees] = React.useState<AcceptEmployeeRequest[]>([]);
	const [selectedEmployee, setSelectedEmployee] =
		React.useState<AcceptEmployeeRequest | null>(null);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
		Promise.all([fetchUpdatedRequests()]).then(data => {
			const [employeeRes] = data;

			if (employeeRes.ok) {
				const employees = employeeRes.data as Employee[];
				const newEmployees = employees.map(employee => {
					//@ts-ignore
					const acceptEmployee: AcceptEmployeeRequest = {
						...employee,
					};
					const infoString = employee.submitedInfo;
					const infoArray = infoString.split(", ");

					const extractedInfo: Record<string, string> = {};
					infoArray.forEach(pair => {
						const [key, value] = pair.split(":");
						extractedInfo[key.toLowerCase()] = value;
					});

					//@ts-ignore
					acceptEmployee.submitedInfo = extractedInfo;

					return acceptEmployee;
				});
				setEmployees(newEmployees);
			}
			seLoading(false);
		});
	}, []);

	function handleSearch(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const nameInput = document.getElementById(
			"searchInput"
		) as HTMLInputElement;
		const name = nameInput.value.trim();

		if (name === "") {
			fetchEmployees().then(data => {
				if (data.ok) {
					setEmployees(data.data.reverse());
				}
			});
		} else {
			const filterEmployees = employees.filter(
				employee =>
					employee.fullname.toLowerCase().includes(name.toLowerCase()) ||
					employee.email.toLowerCase().includes(name.toLowerCase()) ||
					employee.branchName.toLowerCase().includes(name.toLowerCase()) ||
					employee.roleName.toLowerCase().includes(name.toLowerCase()) ||
					employee.phoneNumber.includes(name)
			);

			setEmployees(filterEmployees);
		}
	}

	// Accept Updated Request
	async function AcceptRequest(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (selectedEmployee) {
			const loadingId = toast.loading("Loading ... ");
			try {
				const response = await fetch(`/api/requests/${selectedEmployee.id}`, {
					method: "PUT",
					body: JSON.stringify(selectedEmployee),
				});

				const payload = (await response.json()) as ApiResponse;

				if (payload.ok) {
					setEmployees(pre => pre.filter(emp => emp.id != selectedEmployee.id));
					setSelectedEmployee(null);
					toast.success(payload.message);
				} else {
					toast.error(payload.message);
				}
			} catch (error) {
				console.log(error);
			}
			toast.dismiss(loadingId);
		}
	}
	// Reject Updated Request
	async function handleRejectRequest() {
		if (selectedEmployee) {
			const loadingId = toast.loading("Loading ... ");
			try {
				const res = await fetch(`/api/requests/${selectedEmployee.id}`, {
					method: "DELETE",
				});

				const payload = (await res.json()) as ApiResponse;

				if (payload.ok) {
					setEmployees(pre => pre.filter(emp => emp.id != selectedEmployee.id));
					toast.success(payload.message);
					setSelectedEmployee(null);
				} else {
					toast.error(payload.message);
				}
			} catch (error) {
				console.log(error);
			}
			toast.dismiss(loadingId);
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
							<Grid item xs={12} sm={6}
								className="flex justify-between items-center p-3"></Grid>
							<Grid item xs={12} sm={6}>
								<form
									onSubmit={handleSearch}
									method="post"
									className="flex justify-end items-center my-3 relative">
									<TextField
										size="small" type="text" name="search" id="searchInput"
										sx={{ mr: 3, px: 2, fontSize: "14px", borderRadius: "8px", minWidth: "300px", minHeight: "40px", cursor: "pointer" }}
										placeholder="Enter name to search"
									/>
									<div className="absolute inset-y-0 right-0 flex items-center">
										<IconButton sx={{ position: "relative", mr: 3 }}>
											<SearchOutlined color="success" fontSize="small" />
										</IconButton>
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
										<TableCell align="center" className="text-white text-sm">Employee Code</TableCell>
										<TableCell align="center" className="text-white text-sm">Fullname</TableCell>
										<TableCell align="center" className="text-white text-sm">Email</TableCell>
										<TableCell align="center" className="text-white text-sm">Phone Number</TableCell>
										<TableCell align="center" className="text-white text-sm">Branch</TableCell>
										<TableCell align="center" className="text-white text-sm">Role</TableCell>
										<TableCell align="center" className="text-white text-sm">Action</TableCell>

									</TableRow>
								</TableHead>
								<TableBody>
									{employees.length === 0 && (
										<TableRow>
											<TableCell colSpan={7} align="center" className="text-sm">No Request</TableCell>
										</TableRow>
									)}
									{employees
										.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
										.map(employee => {
											return (
												<TableRow
													key={employee.id}
													sx={{
														"&:last-child td, &:last-child th": { border: 0 },
													}}>
													<TableCell align="center">{employee.employeeCode}</TableCell>
													<TableCell align="center">{employee.fullname}</TableCell>
													<TableCell align="center">{employee.email}</TableCell>
													<TableCell align="center">{employee.phoneNumber}</TableCell>
													<TableCell align="center">{employee.branchName}</TableCell>
													<TableCell align="center">{employee.roleName}</TableCell>
													<TableCell align="center">
														<Tooltip title="Show">
															<IconButton
																onClick={() => {
																	setSelectedEmployee(employee);
																}}>
																<Visibility fontSize="small" /></IconButton>
														</Tooltip>
													</TableCell>
												</TableRow>
											);
										})}
								</TableBody>
							</Table>
							<TablePagination
								component="div"
								count={employees.length || 0}
								page={page}
								onPageChange={handleChangePage}
								rowsPerPage={rowsPerPage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</TableContainer>
					</Paper>

					{selectedEmployee && (
						<Dialog
							open className="max-w-[500px] mx-auto"
						>
							<Tooltip title="Close">
								<CloseOutlined
									color="error"
									className="text-md absolute top-1 right-1 rounded-full hover:opacity-80 hover:bg-red-200 cursor-pointer"
									onClick={() => setSelectedEmployee(null)}
								/>
							</Tooltip>

							<Box sx={{ my: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
								<Avatar src={selectedEmployee?.submitedInfo.avatar} />
								<DialogTitle className="text-center">
									Updated Request
								</DialogTitle>
							</Box>

							<DialogContent>
								<form
									onSubmit={e => AcceptRequest(e)}
									className="text-xs"
								>
									<Box sx={{ my: 1 }}>
										<InputLabel>Email:</InputLabel >
										<TextField
											fullWidth disabled size="small" sx={{ minWidth: 300 }}
											value={selectedEmployee?.submitedInfo.email}
										/>
									</Box>

									<Box sx={{ my: 1 }}>
										<InputLabel>Phone number:</InputLabel>
										<TextField
											fullWidth disabled size="small" sx={{ minWidth: 300 }}
											value={selectedEmployee?.submitedInfo.phonenumber}
										/>
									</Box>

									<Box sx={{ my: 1 }}>
										<InputLabel>Postal Code:</InputLabel>
										<TextField
											fullWidth disabled size="small" sx={{ minWidth: 300 }}
											value={selectedEmployee?.submitedInfo.postalcode} />
									</Box>

									<Box sx={{ my: 1 }}>
										<InputLabel>Address:</InputLabel>
										<TextareaAutosize
											disabled minRows={5} className="min-w-[300px]"
											value={selectedEmployee?.submitedInfo.address + "," + selectedEmployee?.submitedInfo.district + "," + selectedEmployee?.submitedInfo.province} />
									</Box>

									<Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
										<Button fullWidth sx={{ mr: 2 }} type="submit" color="success" variant="contained" size="small">Accept</Button>
										<Button fullWidth color="error" variant="contained" size="small" onClick={() => handleRejectRequest()}>Reject</Button>
									</Box>
								</form>
							</DialogContent>
						</Dialog>
					)}
				</>
			)}
		</>
	);
}
