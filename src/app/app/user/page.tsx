"use client";

import { useForm } from "react-hook-form";
import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import React from "react";
import TextField from "@mui/material/TextField";
import { Box, Typography, Button } from "@mui/material";
import { toast } from "sonner";
// @ts-ignore
import { getUserById, refreshToken, updateUserById } from "@/app/_data/method";

const schema = z.object({
	fullname: z
		.string({
			required_error: "Fullname is required!",
		})
		.min(3, "Fullname must be at least 3 characters!")
		.max(50),
	email: z
		.string({
			required_error: "Email is required!",
		})
		.min(3, "Email must be at least 3 characters!")
		.max(50)
		.email(),
	phone: z
		.string({
			required_error: "Phone is required!",
		})
		.min(3, "Phone must be at least 3 characters!")
		.max(50),
});

type Schema = z.infer<typeof schema>;

const UserProfile = () => {
	const [user, setUser] = React.useState<Schema | null>(null);
	const { data: session, update } = useSession();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Schema>({
		resolver: zodResolver(schema),
	});

	React.useEffect(() => {
		if (session) {
			getUserById(session.user.id, session.user.token).then(res => {
				if (res.ok) {
					setUser(res.data);
				} else if (res.status === "Unauthorized") {
					refreshToken(session.user.token).then(res => {
						if (res.ok) {
							update({
								token: res.data.token,
							});
						}
					});
				}
			});
		}
	}, [session, update]);

	const onSubmit = async (data: Schema) => {
		const loadingId = toast.loading("Changing...");

		if (session) {
			updateUserById(session.user.id, session.user.token, data).then(res => {
				if (res.ok) {
					setUser(data);
					toast.success(res.message);
				} else if (res.status === "Unauthorized") {
					refreshToken(session.user.token).then(res => {
						if (res.ok) {
							update({
								token: res.data.token,
							});
							updateUserById(session.user.id, res.data.token, data).then(
								res => {
									if (res.ok) {
										setUser(data);
										toast.success(res.message);
									} else {
										toast.error(res.message);
									}
								}
							);
						}
					});
				} else {
					toast.error(res.message);
				}
			});
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
				Profile
			</Typography>
			<TextField
				defaultValue={user?.fullname}
				variant="outlined"
				fullWidth
				label="Fullname"
				{...register("fullname", {
					setValueAs: v => (v === "" ? undefined : v),
				})}
				error={!!errors.fullname}
				helperText={errors.fullname?.message}
				margin="normal"
				InputLabelProps={{ shrink: true }}
			/>
			<TextField
				defaultValue={user?.email}
				variant="outlined"
				fullWidth
				label="Email"
				{...register("email", {
					setValueAs: v => (v === "" ? undefined : v),
				})}
				error={!!errors.email}
				helperText={errors.email?.message}
				margin="normal"
				InputLabelProps={{ shrink: true }}
			/>
			<TextField
				defaultValue={user?.phone}
				variant="outlined"
				fullWidth
				label="Phone"
				{...register("phone", {
					setValueAs: v => (v === "" ? undefined : v),
				})}
				error={!!errors.phone}
				helperText={errors.phone?.message}
				margin="normal"
				InputLabelProps={{ shrink: true }}
			/>

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

export default UserProfile;
