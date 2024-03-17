"use client";

import { Employee } from "@/types/types";
import { CloseOutlined, DriveFileRenameOutline } from "@mui/icons-material";
import {
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	TablePagination,
} from "@mui/material";
import Loading from "@/components/Loading";
import { useSession } from "next-auth/react";
import React from "react";

export default function HistoryLogsPage() {
	const [employee, setEmployee] = React.useState<Employee>();
	const [loading, setLoading] = React.useState(true);
	const [changeDialog, setChangeDialog] = React.useState(false);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const { data: session } = useSession();
	const processStepLabels = {
		0: "Waiting For Pickup",
		1: "Created",
		2: "Warehouse From",
		3: "In Transit",
		4: "Warehouse To",
		5: "Shipping",
		6: "Delivered",
		7: "Cancelled",
		8: "Returned",
		9: "Lost",
	};

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

	React.useEffect(() => {
		const fetchData = () => {
			fetch(`/api/employees/${session?.user.employeeCode}`)
				.then(res => {
					res.json().then(payload => {
						if (payload.ok) {
							setEmployee(payload.data);
						} else {
							console.error("Failed to get employee!");
						}
					});

					setLoading(false);
				})
				.catch(error => {
					console.error("Error fetching employee:", error);
					setLoading(false);
				});
		};

		if (session?.user.employeeCode) {
			fetchData();
		} else {
			setLoading(false);
		}
	}, [session?.user.employeeCode]);

	if (session?.user.employeeCode == employee?.employeeCode) {
		return (
			<>
				{loading ? (
					<Loading />
				) : (
					<>
						<TableContainer
							className="mt-4"
							sx={{ width: "100%", overflow: "hidden" }}>
							<Table
								sx={{ minWidth: 650 }}
								size="small"
								aria-label="a dense table">
								<TableHead>
									<TableRow>
										<TableCell
											align="center"
											className="text-white text-sm">
											PackageId
										</TableCell>
										<TableCell
											align="center"
											className="text-white text-sm">
											Package Photo
										</TableCell>
										<TableCell
											align="center"
											className="text-white text-sm">
											Note
										</TableCell>
										<TableCell
											align="center"
											className="text-white text-sm">
											Process Step
										</TableCell>
										<TableCell
											align="center"
											className="text-white text-sm">
											Step
										</TableCell>
										<TableCell
											align="center"
											className="text-white text-sm">
											Updated Date
										</TableCell>
									</TableRow>
								</TableHead>

								<TableBody>
									{employee?.historyLogs?.length === 0 ? (
										<TableRow>
											<TableCell
												colSpan={6}
												align="center"
												className="text-sm">
												No History Log
											</TableCell>
										</TableRow>
									) : (
										employee?.historyLogs
											.slice(
												page * rowsPerPage,
												page * rowsPerPage + rowsPerPage
											)
											.map(h => (
												<TableRow
													key={h.id}
													sx={{
														"&:last-child td, &:last-child th": { border: 0 },
													}}>
													<TableCell align="center">{h.packageId}</TableCell>
													<TableCell align="center">{h.photos}</TableCell>
													<TableCell align="center">{h.historyNote}</TableCell>
													<TableCell align="center">
														{processStepLabels[h.processStep]}
													</TableCell>
													<TableCell align="center">
														{h.step === 0
															? "Processing"
															: h.step === 1
															? "Done"
															: "Hold"}
													</TableCell>
													<TableCell align="center">
														{h.updatedAt.split("T")[0]}
													</TableCell>
												</TableRow>
											))
									)}
								</TableBody>
							</Table>
							<TablePagination
								component="div"
								count={employee?.historyLogs.length || 0}
								page={page}
								onPageChange={handleChangePage}
								rowsPerPage={rowsPerPage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</TableContainer>
					</>
				)}
			</>
		);
	}
}
