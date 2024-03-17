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
import { Address } from "@/types/types";

const schema = z.object({
	addressFrom: z.string({
		required_error: "Address Sender is required!",
	}),
	addressTo: z.string({
		required_error: "Address Receiver is required!",
	}),
	packageNote: z.string().optional(),
});

type Schema = z.infer<typeof schema>;

const UserCreatePackagePage = () => {
	const [addresses, setAddresses] = React.useState<Address[]>([]);
	const { data: session } = useSession();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Schema>({
		resolver: zodResolver(schema),
	});

	React.useEffect(() => {
		if (session?.user.id) {
			fetch(`/api/users/${session.user.id}/addresses`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${session.user.token}`,
				},
			})
				.then(response => response.json())
				.then(data => setAddresses(data.data));
		}
	}, [session?.user.id, session?.user.token]);

	const onSubmit = async (data: Schema) => {
		const loadingId = toast.loading("Creating...");
		const [nameFrom, phoneFrom, postalCodeFrom, ...addressFrom] =
			data.addressFrom.split(", ");

		const [nameTo, phoneTo, postalCodeTo, ...addressTo] =
			data.addressTo.split(", ");

		const newData = {
			nameFrom,
			addressFrom: addressFrom.join(", "),
			nameTo,
			addressTo: addressTo.join(", "),
			postalCodeTo,
			packageNote: data.packageNote,
		};

		const res = await fetch(`/api/packages/add`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${session?.user.token}`,
			},
			body: JSON.stringify(newData),
		});

		const payload = await res.json();

		toast.dismiss(loadingId);
		if (payload.ok) {
			toast.success(payload.message);
		} else {
			toast.error(payload.message);
		}
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
				Add Package
			</Typography>
			<Grid
				container
				spacing={2}
			>
				<Grid
					item
					xs={6}
				>
					<FormControl
						fullWidth
						variant="outlined"
						margin="normal"
						error={!!errors.addressFrom}
					>
						<InputLabel id="addressFrom">Address From</InputLabel>
						<Select
							labelId="addressFrom"
							label="Address From"
							{...register("addressFrom", {
								setValueAs: v => (v === "" ? undefined : v),
							})}
							defaultValue=""
						>
							{addresses
								.filter(address => address.typeInfo === 0)
								.map((address, index) => (
									<MenuItem
										key={index}
										value={`${address.name}, ${address.phoneNumber}, ${address.postalCode}, ${address.address}, ${address.ward}, ${address.district}, ${address.city}, ${address.postalCode}`}
									>
										{`${address.name}, ${address.phoneNumber}, ${address.address}, ${address.ward}, ${address.district}, ${address.city}, ${address.postalCode}`}
									</MenuItem>
								))}
						</Select>
						<FormHelperText>{errors.addressFrom?.message}</FormHelperText>
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
						error={!!errors.addressTo}
					>
						<InputLabel id="addressTo">Address To</InputLabel>
						<Select
							labelId="addressTo"
							label="Address To"
							{...register("addressTo", {
								setValueAs: v => (v === "" ? undefined : v),
							})}
							defaultValue=""
						>
							{addresses
								.filter(address => address.typeInfo === 1)
								.map((address, index) => (
									<MenuItem
										key={index}
										value={`${address.name}, ${address.phoneNumber}, ${address.postalCode}, ${address.address}, ${address.ward}, ${address.district}, ${address.city}`}
									>
										{`${address.name}, ${address.phoneNumber}, ${address.address}, ${address.ward}, ${address.district}, ${address.city}, ${address.postalCode}`}
									</MenuItem>
								))}
						</Select>
						<FormHelperText>{errors.addressTo?.message}</FormHelperText>
					</FormControl>
				</Grid>
				<Grid
					item
					xs={12}
				>
					<TextField
						variant="outlined"
						multiline
						rows={3}
						fullWidth
						label="Package Note"
						{...register("packageNote", {
							setValueAs: v => (v === "" ? undefined : v),
						})}
						error={!!errors.packageNote}
						helperText={errors.packageNote?.message}
						margin="normal"
					/>
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

export default UserCreatePackagePage;
