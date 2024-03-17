"use client";

import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisibilityOff, Visibility, Update } from "@mui/icons-material";
import {
	FormControl,
	InputLabel,
	OutlinedInput,
	InputAdornment,
	IconButton,
	FormHelperText,
	Button,
	CircularProgress,
} from "@mui/material";
import React from "react";
import { toast } from "sonner";
import { ApiResponse, Employee } from "@/types/types";

export default function ChangePasswordPage() {
	const [employee, setEmployee] = React.useState<Employee>();
	const [showPassword, setShowPassword] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const { data: session } = useSession();
	const schema = z
		.object({
			oldPassword: z
				.string({
					required_error: "Current password is required!",
				})
				.min(8, "Current password must be at least 8 characters!")
				.max(50),
			newPassword: z
				.string({
					required_error: "New password is required!",
				})
				.min(8, "New password must be at least 8 characters!")
				.max(50),
			confirmPassword: z.string({
				required_error: "Confirm password is required!",
			}),
		})
		.refine(data => data.newPassword === data.confirmPassword, {
			message: "Current password and new password don't match",
			path: ["confirmPassword"],
		})
		.refine(data => data.oldPassword !== data.newPassword, {
			message: "New password must be different from current password.",
			path: ["newPassword"],
		});

	type Schema = z.infer<typeof schema>;

	const {
		register: passwordRegiter,
		handleSubmit: handlePasswordSubmit,
		formState: { errors: passwordErrors },
	} = useForm<Schema>({
		resolver: zodResolver(schema),
	});

	// handle change password
	async function ChangePassword(data: Schema) {
		try {
			const response = await fetch(
				`/api/employees/${session?.user.employeeCode}/changePassword`,
				{
					method: "PUT",
					body: JSON.stringify(data),
				}
			);

			const payload = (await response.json()) as ApiResponse;
			console.log("payload:" + payload.ok);

			if (payload.ok) {
				setEmployee(payload.data);
				toast.success(payload.message);
			} else {
				toast.error(payload.message);
			}
		} catch (error) {
			console.log("Error change password: ", error);
		}
	}

	const handleMouseEvents = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	return (
		<>
			<form
				onSubmit={handlePasswordSubmit(ChangePassword)}
				className="text-xs my-4">
				<div className="mx-3">
					<label className="font-semibold">Current password:</label>
					<FormControl
						fullWidth
						size="small"
						variant="outlined"
						margin="normal"
						error={!!passwordErrors.oldPassword}>
						<InputLabel htmlFor="password">Password</InputLabel>
						<OutlinedInput
							label="Password"
							id="password"
							autoComplete="current-password"
							type={showPassword ? "text" : "password"}
							{...passwordRegiter("oldPassword", {
								setValueAs: v => (v === "" ? undefined : v),
							})}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={() => setShowPassword(!showPassword)}
										onMouseDown={handleMouseEvents}
										onMouseUp={handleMouseEvents}
										edge="end">
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
						/>
						<FormHelperText>
							{passwordErrors.oldPassword?.message}
						</FormHelperText>
					</FormControl>
				</div>

				<div className="mx-3">
					<label className="font-semibold">New password:</label>
					<FormControl
						fullWidth
						size="small"
						variant="outlined"
						margin="normal"
						error={!!passwordErrors.newPassword}>
						<InputLabel htmlFor="New password">New password</InputLabel>
						<OutlinedInput
							label="New password"
							id="New password"
							autoComplete="new-password"
							type={showPassword ? "text" : "password"}
							{...passwordRegiter("newPassword", {
								setValueAs: v => (v === "" ? undefined : v),
							})}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={() => setShowPassword(!showPassword)}
										onMouseDown={handleMouseEvents}
										onMouseUp={handleMouseEvents}
										edge="end">
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
						/>
						<FormHelperText>
							{passwordErrors.newPassword?.message}
						</FormHelperText>
					</FormControl>
				</div>

				<div className="mx-3">
					<label className="font-semibold">Confirm password:</label>
					<FormControl
						fullWidth
						size="small"
						variant="outlined"
						margin="normal"
						error={!!passwordErrors.confirmPassword}>
						<InputLabel htmlFor="confirmPassword">Confirm password</InputLabel>
						<OutlinedInput
							label="Confirm password"
							id="confirmPassword"
							autoComplete="new-password"
							type={showPassword ? "text" : "password"}
							{...passwordRegiter("confirmPassword", {
								setValueAs: v => (v === "" ? undefined : v),
							})}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={() => setShowPassword(!showPassword)}
										onMouseDown={handleMouseEvents}
										onMouseUp={handleMouseEvents}
										edge="end">
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
						/>
						<FormHelperText>
							{passwordErrors.confirmPassword?.message}
						</FormHelperText>
					</FormControl>
				</div>

				<div className="flex justify-around mx-3 mt-10">
					<Button
						variant="contained"
						color="success"
						type="submit"
						className="w-full mr-2 mb-3"
						startIcon={loading ? <CircularProgress size={24} /> : <Update />}>
						Change
					</Button>
					<Button
						variant="contained"
						color="primary"
						type="reset"
						className="w-full mb-3">
						Cancel
					</Button>
				</div>
			</form>
		</>
	);
}
