"use client";

import useS3 from "@/hooks/useS3";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";

import React from "react";
import Image from "next/image";
import {
	ApiResponse,
	Employee,
	Province,
	UpdateInfoRequest,
} from "@/types/types";
import { CloseOutlined, Send } from "@mui/icons-material";
import {
	Dialog,
	Tooltip,
	DialogTitle,
	DialogContent,
	Button,
	InputLabel,
	Typography,
	Box,
} from "@mui/material";
import Loading from "@/components/Loading";
import {
	getChildrenLocationsByParentId,
	getProvinces,
} from "@/app/_data/method";

export default function EmployeeInfoPage() {
	const [employee, setEmployee] = React.useState<Employee>();
	const [loading, setLoading] = React.useState(true);
	const [provinces, setProvinces] = React.useState<Province[]>([]);
	const [districts, setDistricts] = React.useState<Province[]>([]);
	const [modal, setModal] = React.useState(false);

	const { handleFileUpload, ButtonUpload, preview } = useS3();

	const previewUrl = React.useMemo(() => {
		if (preview) {
			return URL.createObjectURL(preview);
		}
	}, [preview]);

	const { data: session } = useSession();

	const {
		register: updatedRegister,
		handleSubmit: handleUpdatedSubmit,
		formState: { errors: updatedErrors },
		setValue,
		watch,
	} = useForm<UpdateInfoRequest>();
	const province = watch("province");

	// handle send updated  request
	async function SendUpdatedRequest(data: UpdateInfoRequest) {
		const loadingId = toast.loading("Loading ...");
		try {
			const response = await fetch(
				`/api/employees/${session?.user.employeeCode}/sendUpdatedRequest`,
				{
					method: "PUT",
					body: JSON.stringify({ ...data, avatar: await handleFileUpload() }),
				}
			);

			const payload = (await response.json()) as ApiResponse;

			if (payload.ok) {
				setModal(false);
				toast.success(payload.message);
			} else {
				toast.error(payload.message);
			}
		} catch (error) {
			console.log("error send updated requset: ", error);
		}

		toast.dismiss(loadingId);
	}

	React.useEffect(() => {
		const provinceId = provinces.find(p => p.locationName === province)?.id;

		if (!provinceId) {
			setDistricts([]);
		} else {
			getChildrenLocationsByParentId(provinceId).then(res => {
				if (res.ok) {
					if (res.data.districs) {
						setDistricts(res.data.districs);
					} else {
						setDistricts([]);
					}
				} else {
					setDistricts([]);
				}
			});
		}
	}, [province, provinces]);

	React.useEffect(() => {
		const fetchData = () => {
			Promise.all([
				fetch(`/api/employees/${session?.user.employeeCode}`),
				getProvinces(),
				,
			]).then(res => {
				const [empRes, provinceRes] = res;

				empRes
					.json()
					.then(
						(payload: {
							ok: any;
							data: React.SetStateAction<Employee | undefined>;
						}) => {
							if (payload.ok) {
								setEmployee(payload.data);
							}
						}
					);

				if (provinceRes.ok) {
					setProvinces(provinceRes.data);
				}

				setLoading(false);
			});
		};

		fetchData();
	}, [session?.user.employeeCode]);
	return (
		<>
			{loading ? (
				<Loading />
			) : (
				<div className="my-4">
					<Box className="flex justify-between mx-3">
						<Box className="flex items-center">
							<Box>
								<InputLabel className="p-2 font-semibold">
									Employee Code:
								</InputLabel>
								<InputLabel className="p-2 font-semibold">
									Full name:
								</InputLabel>
								<InputLabel className="p-2 font-semibold">Email:</InputLabel>
								<InputLabel className="p-2 font-semibold">
									Phone number:
								</InputLabel>
								<InputLabel className="p-2 font-semibold">Address:</InputLabel>
								<InputLabel className="p-2 font-semibold">Branch:</InputLabel>
								<InputLabel className="p-2 font-semibold">Role:</InputLabel>
							</Box>
							<Box>
								<Typography className="p-2 font-semibold">
									{employee?.employeeCode}
								</Typography>
								<Typography className="p-2 uppercase">
									{employee?.fullname}
								</Typography>
								<Typography className="p-2">{employee?.email}</Typography>
								<Typography className="p-2">{employee?.phoneNumber}</Typography>
								<Typography className="p-2">
									{employee?.address}, {employee?.district},{" "}
									{employee?.province}
								</Typography>
								<Typography className="p-2">{employee?.branchName}</Typography>

								<Typography className="p-2">{employee?.roleName}</Typography>
							</Box>
						</Box>

						<Image
							src={
								employee?.avatar
									? "https://project-sem3.s3.ap-southeast-1.amazonaws.com/" +
									  employee?.avatar
									: "https://dummyimage.com/500x500/c3c3c3/FFF.png&text=UploadImage"
							}
							title="employee avatar"
							alt="employee avatar"
							className="rounded-md max-h-[300px] max-w-[300px]"
						/>
					</Box>

					<div className="">
						<Button
							className="mx-3"
							variant="contained"
							color="secondary"
							onClick={() => setModal(true)}>
							Update Information
						</Button>
					</div>
					{/* Dialog send updated info */}
					<Dialog
						open={modal}
						className="max-w-[500px] mx-auto">
						<Tooltip title="Close">
							<CloseOutlined
								onClick={() => setModal(false)}
								color="error"
								className="text-md absolute top-1 right-1 rounded-full hover:opacity-80 hover:bg-red-200 cursor-pointer"
							/>
						</Tooltip>

						<div className="flex justify-center my-3">
							<DialogTitle className="text-center">
								Updated Employee Request
							</DialogTitle>
						</div>

						<DialogContent>
							<form
								onSubmit={handleUpdatedSubmit(SendUpdatedRequest)}
								className="text-xs">
								<div className="my-3">
									<label className="font-semibold">EmployeeCode:</label>
									<input
										readOnly
										disabled
										defaultValue={employee?.employeeCode}
										className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
									/>
								</div>

								<div className="my-3">
									<label className="font-semibold">Fullname:</label>
									<input
										readOnly
										disabled
										defaultValue={employee?.fullname}
										className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
									/>
								</div>

								<div className="my-3">
									<label className="font-semibold">Email:</label>
									<input
										readOnly
										disabled
										defaultValue={employee?.email}
										className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
									/>
								</div>

								<div className="my-3">
									<label className="font-semibold">Phone number:</label>
									<input
										defaultValue={employee?.phoneNumber}
										{...updatedRegister("phonenumber", {
											required: "Phone number is required.",
											pattern: {
												value: /^\d{10}$/,
												message: "Phone number must have 10 digits.",
											},
										})}
										className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
									/>
								</div>

								<div className="my-3">
									<label className="font-semibold">Address:</label>
									<textarea
										defaultValue={
											employee?.address +
											", " +
											employee?.district +
											", " +
											employee?.province
										}
										{...updatedRegister("address", {
											required: "Address is required.",
										})}
										className="min-w-[300px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"></textarea>
								</div>

								<div className="my-3 flex">
									<div className="mr-2">
										<label className="font-semibold">Province:</label>
										<select
											{...updatedRegister("province")}
											className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											id="province">
											<option value="">Select province</option>
											{provinces.map(province => (
												<option
													key={province.id}
													value={province.locationName}>
													{province.locationName}
												</option>
											))}
										</select>
									</div>

									<div>
										<label className="font-semibold">District:</label>
										<select
											{...updatedRegister("district")}
											className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
											id="district"
											disabled={districts.length === 0}>
											<option value="">Select district</option>
											{districts.map(district => (
												<option
													key={district.id}
													value={district.locationName}>
													{district.locationName}
												</option>
											))}
										</select>
									</div>
								</div>

								<div className="my-3 flex">
									<div className="mr-2">
										<label className="font-semibold">Branch:</label>
										<input
											readOnly
											disabled
											defaultValue={employee?.branchName}
											className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
										/>
									</div>

									<div>
										<label className="font-semibold">Role:</label>
										<input
											readOnly
											disabled
											defaultValue={employee?.roleName}
											className="min-w-[150px] border rounded-md p-[10px] cursor-pointer border-slate-500 w-full hover:border-green-700"
										/>
									</div>
								</div>

								<div className="flex justify-between items-center my-3">
									{preview ? (
										<Image
											src={`${previewUrl}`}
											width={0}
											height={0}
											objectFit="contain"
											alt={"preview"}
											title={"preview"}
											style={{
												width: "clamp(100px, 100%, 200px)",
												height: "auto",
												margin: "20px",
											}}
										/>
									) : (
										<Image
											{...updatedRegister("avatar")}
											src={
												"https://dummyimage.com/500x500/c3c3c3/FFF.png&text=UploadImage"
											}
											alt={"preview"}
											title={"preview"}
											width={180}
											height={180}
											className="rounded-md"
										/>
									)}
									<ButtonUpload />
								</div>

								<Button
									startIcon={<Send fontSize="small" />}
									type="submit"
									color="success"
									variant="contained"
									className="w-full mr-2">
									Send
								</Button>
							</form>
						</DialogContent>
					</Dialog>
				</div>
			)}
		</>
	);
}
