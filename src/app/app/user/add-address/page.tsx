"use client";

import { useForm } from "react-hook-form";
import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React from "react";
import TextField from "@mui/material/TextField";
import {
	Box,
	Typography,
	Button,
	Grid,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	FormHelperText,
} from "@mui/material";
import { toast } from "sonner";
import {
	getProvinces,
	getChildrenLocationsByParentId,
	addAddressByUserId,
	refreshToken,
} from "@/app/_data/method";
import { Province } from "@/types/types";

const schema = z.object({
	name: z
		.string({
			required_error: "Name is required!",
		})
		.min(3, "Name must be at least 3 characters!")
		.max(50),
	phoneNumber: z
		.string({
			required_error: "Phone Number is required!",
		})
		.min(3, "Phone Number must be at least 3 characters!")
		.max(50),
	address: z
		.string({
			required_error: "Address is required!",
		})
		.min(3, "Address must be at least 3 characters!")
		.max(50),
	city: z
		.string({
			required_error: "City is required!",
		})
		.min(3, "City must be at least 3 characters!")
		.max(50),
	district: z
		.string({
			required_error: "District is required!",
		})
		.min(3, "District must be at least 3 characters!")
		.max(50),
	ward: z
		.string({
			required_error: "Ward is required!",
		})
		.min(3, "Ward must be at least 3 characters!")
		.max(50),
	typeInfo: z.number({
		required_error: "Type is required!",
	}),
});

type Schema = z.infer<typeof schema>;

const UserAddAddressPage = () => {
	const { data: session, update } = useSession();
	const [provinces, setProvinces] = React.useState<Province[]>([]);
	const [districts, setDistricts] = React.useState<Province[]>([]);
	const [wards, setWards] = React.useState<Province[]>([]);

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<Schema>({
		resolver: zodResolver(schema),
	});

	const province = watch("city");
	const district = watch("district");

	React.useEffect(() => {
		Promise.all([getProvinces()]).then(data => {
			const [provinceRes] = data;
			if (provinceRes.ok) {
				setProvinces(provinceRes.data);
			}
		});
	}, []);

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
		const districtId = districts.find(p => p.locationName === district)?.id;

		if (!districtId) {
			setWards([]);
		} else {
			getChildrenLocationsByParentId(districtId).then(res => {
				if (res.ok) {
					if (res.data.wards) {
						setWards(res.data.wards);
					} else {
						setWards([]);
					}
				} else {
					setWards([]);
				}
			});
		}
	}, [district, districts]);

	const onSubmit = async (data: Schema) => {
		const loadingId = toast.loading("Adding...");
		const ward = data.ward;
		const postalCode = wards.find(w => w.locationName === ward)?.postalCode;
		const newData = { ...data, postalCode };
		if (session) {
			addAddressByUserId(session.user.id, session.user.token, newData).then(
				res => {
					if (res.ok) {
						toast.success(res.message);
					} else if (res.status === "Unauthorized") {
						refreshToken(session.user.token).then(res => {
							if (res.ok) {
								update({
									token: res.data.token,
								});
								addAddressByUserId(
									session.user.id,
									res.data.token,
									newData
								).then(res => {
									if (res.ok) {
										toast.success(res.message);
									} else {
										toast.error(res.message);
									}
								});
							}
						});
					}
				}
			);
		}
		toast.dismiss(loadingId);
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			sx={{
				width: "100%",
				margin: "auto",
				padding: "20px",
				borderRadius: "8px",
				boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
				backgroundColor: "white",
			}}
		>
			<Typography
				variant="h5"
				component="div"
				sx={{ mb: 2 }}
			>
				Add Address
			</Typography>
			<Grid
				container
				spacing={2}
			>
				<Grid
					item
					xs={4}
				>
					<TextField
						variant="outlined"
						fullWidth
						label="Fullname"
						{...register("name", {
							setValueAs: v => (v === "" ? undefined : v),
						})}
						error={!!errors.name}
						helperText={errors.name?.message}
						margin="normal"
					/>
				</Grid>
				<Grid
					item
					xs={4}
				>
					<TextField
						variant="outlined"
						fullWidth
						label="Phone number"
						{...register("phoneNumber", {
							setValueAs: v => (v === "" ? undefined : v),
						})}
						error={!!errors.phoneNumber}
						helperText={errors.phoneNumber?.message}
						margin="normal"
					/>
				</Grid>
				<Grid
					item
					xs={4}
				>
					<FormControl
						fullWidth
						variant="outlined"
						margin="normal"
						error={!!errors.typeInfo}
					>
						<InputLabel id="type">Type</InputLabel>
						<Select
							labelId="type"
							label="Type"
							{...register("typeInfo", {
								setValueAs: v => {
									return v === "" ? undefined : parseInt(v);
								},
							})}
							defaultValue={0}
						>
							<MenuItem value={0}>Sender</MenuItem>
							<MenuItem value={1}>Receiver</MenuItem>
						</Select>
						<FormHelperText>{errors.typeInfo?.message}</FormHelperText>
					</FormControl>
				</Grid>
				<Grid
					item
					xs={6}
				>
					<TextField
						variant="outlined"
						fullWidth
						label="Address"
						{...register("address", {
							setValueAs: v => (v === "" ? undefined : v),
						})}
						error={!!errors.address}
						helperText={errors.address?.message}
						margin="normal"
					/>
				</Grid>
				<Grid
					item
					xs={6}
				>
					<FormControl
						fullWidth
						variant="outlined"
						margin="normal"
						error={!!errors.city}
					>
						<InputLabel id="city">City</InputLabel>
						<Select
							labelId="city"
							label="City"
							{...register("city", {
								setValueAs: v => (v === "" ? undefined : v),
							})}
							defaultValue=""
						>
							{provinces.map(province => (
								<MenuItem
									key={province.id}
									value={province.locationName}
								>
									{province.locationName}
								</MenuItem>
							))}
						</Select>
						<FormHelperText>{errors.city?.message}</FormHelperText>
					</FormControl>
				</Grid>
				<Grid
					item
					xs={6}
				>
					<FormControl
						fullWidth
						variant="outlined"
						margin="normal"
						error={!!errors.district}
					>
						<InputLabel id="district">Dictrict</InputLabel>
						<Select
							labelId="district"
							label="Dictrict"
							{...register("district", {
								setValueAs: v => (v === "" ? undefined : v),
							})}
							defaultValue=""
							disabled={districts.length === 0}
						>
							{districts.map(district => (
								<MenuItem
									key={district.id}
									value={district.locationName}
								>
									{district.locationName}
								</MenuItem>
							))}
						</Select>
						<FormHelperText>{errors.district?.message}</FormHelperText>
					</FormControl>
				</Grid>
				<Grid
					item
					xs={6}
				>
					<FormControl
						fullWidth
						variant="outlined"
						margin="normal"
						error={!!errors.ward}
					>
						<InputLabel id="ward">Ward</InputLabel>
						<Select
							labelId="ward"
							label="Ward"
							{...register("ward", {
								setValueAs: v => (v === "" ? undefined : v),
							})}
							defaultValue=""
							disabled={wards.length === 0}
						>
							{wards.map(ward => (
								<MenuItem
									key={ward.id}
									value={ward.locationName}
								>
									{ward.locationName}
								</MenuItem>
							))}
						</Select>
						<FormHelperText>{errors.ward?.message}</FormHelperText>
					</FormControl>
				</Grid>
			</Grid>

			<Button
				type="submit"
				variant="contained"
				color="error"
				fullWidth
				sx={{ mt: 2 }}
			>
				Save
			</Button>
		</Box>
	);
};

export default UserAddAddressPage;
