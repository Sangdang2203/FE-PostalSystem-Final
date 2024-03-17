"use client";

import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/types";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import FormHelperText from "@mui/material/FormHelperText";
import Button from "@mui/material/Button";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const schema = z
	.object({
		oldPassword: z
			.string({
				required_error: "Old password is required!",
			})
			.min(3, "Old password must be at least 3 characters!")
			.max(50),
		newPassword: z
			.string({
				required_error: "New password is required!",
			})
			.min(3, "New password must be at least 3 characters!")
			.max(50),
		confirmPassword: z.string({
			required_error: "Confirm password is required!",
		}),
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"], // path of error
	})
	.refine(data => data.oldPassword !== data.newPassword, {
		message: "New password must be different from old password",
		path: ["newPassword"],
	});

type Schema = z.infer<typeof schema>;

export default function UserChangePasswordPage() {
	const { data: session } = useSession();
	const [showOldPassword, setShowOldPassword] = React.useState(false);
	const [showNewPassword, setShowNewPassword] = React.useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<Schema>({
		resolver: zodResolver(schema),
	});

	const onSubmit = async (formData: Schema) => {
		const loadingId = toast.loading("Changing password...");

		const res = await fetch(`/api/users/${session?.user.id}/change-password`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${session?.user.token}`,
			},
			body: JSON.stringify({
				oldPassword: formData.oldPassword,
				newPassword: formData.newPassword,
			}),
		});

		const data = (await res.json()) as ApiResponse;

		toast.dismiss(loadingId);

		if (data.ok) {
			toast.success(data.message);
		} else {
			toast.error(data.message);
		}

		reset();
	};

	const handleClickShowPassword = (
		callback: React.Dispatch<React.SetStateAction<boolean>>
	) => {
		callback(pre => !pre);
	};

	const handleMouseEvents = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
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
				Change Password
			</Typography>

			<FormControl
				fullWidth
				size="small"
				variant="outlined"
				margin="normal"
				error={!!errors.oldPassword}
			>
				<InputLabel htmlFor="current-password">Current Password</InputLabel>
				<OutlinedInput
					label="Current Password"
					id="current-password"
					autoComplete="current-password"
					type={showOldPassword ? "text" : "password"}
					{...register("oldPassword", {
						setValueAs: v => (v === "" ? undefined : v),
					})}
					endAdornment={
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={() => handleClickShowPassword(setShowOldPassword)}
								onMouseDown={handleMouseEvents}
								onMouseUp={handleMouseEvents}
								edge="end"
							>
								{showOldPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					}
				/>
				<FormHelperText>{errors.oldPassword?.message}</FormHelperText>
			</FormControl>

			<FormControl
				fullWidth
				size="small"
				variant="outlined"
				margin="normal"
				error={!!errors.newPassword}
			>
				<InputLabel htmlFor="new-password">New Password</InputLabel>
				<OutlinedInput
					label="New Password"
					id="new-password"
					autoComplete="new-password"
					type={showNewPassword ? "text" : "password"}
					{...register("newPassword", {
						setValueAs: v => (v === "" ? undefined : v),
					})}
					endAdornment={
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={() => handleClickShowPassword(setShowNewPassword)}
								onMouseDown={handleMouseEvents}
								onMouseUp={handleMouseEvents}
								edge="end"
							>
								{showNewPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					}
				/>
				<FormHelperText>{errors.newPassword?.message}</FormHelperText>
			</FormControl>

			<FormControl
				fullWidth
				size="small"
				variant="outlined"
				margin="normal"
				error={!!errors.confirmPassword}
			>
				<InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
				<OutlinedInput
					label="Confirm Password"
					id="confirm-password"
					autoComplete="confirm-password"
					type={showConfirmPassword ? "text" : "password"}
					{...register("confirmPassword", {
						setValueAs: v => (v === "" ? undefined : v),
					})}
					endAdornment={
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={() => handleClickShowPassword(setShowConfirmPassword)}
								onMouseDown={handleMouseEvents}
								onMouseUp={handleMouseEvents}
								edge="end"
							>
								{showConfirmPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					}
				/>
				<FormHelperText>{errors.confirmPassword?.message}</FormHelperText>
			</FormControl>

			<Button
				type="submit"
				variant="contained"
				color="error"
				fullWidth
				sx={{ mt: 2 }}
			>
				Change
			</Button>
		</Box>
	);
}
