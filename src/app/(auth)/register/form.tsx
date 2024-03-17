"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { ApiResponse } from "@/types/types";
import Box from "@mui/material/Box";
import LinkBehaviour from "../../../components/LinkBehaviour";
import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import AlertTitle from "@mui/material/AlertTitle";
import Alert from "@mui/material/Alert";
import { toast } from "sonner";

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
		.email("Invalid email format"),
	phone: z
		.string({
			required_error: "Phone is required!",
		})
		.min(3, "Phone must be at least 3 characters!")
		.max(50),
	password: z
		.string({
			required_error: "Password is required!",
		})
		.min(3, "Password must be at least 3 characters!")
		.max(50),
});

type Schema = z.infer<typeof schema>;

const RegisterForm = () => {
	const [showPassword, setShowPassword] = React.useState(false);

	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Schema>({
		resolver: zodResolver(schema),
	});

	const [error, setError] = React.useState("");
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";

	const handleClickShowPassword = () => {
		setShowPassword(show => !show);
	};

	const handleMouseEvents = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const onSubmit = async (formData: Schema) => {
		const loadingId = toast.loading("Registering...");

		const res = await fetch("/api/users/register", {
			method: "POST",
			body: JSON.stringify(formData),
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = (await res.json()) as ApiResponse;

		if (data.ok) {
			// Encode the callbackUrl before appending it to the URL string
			const encodedCallbackUrl = encodeURIComponent(callbackUrl);
			router.push(`/verify-email?callbackUrl=${encodedCallbackUrl}`);
		} else {
			toast.error(data.message);
		}
		toast.dismiss(loadingId);
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			sx={{
				maxWidth: "500px",
				margin: "auto",
				padding: "20px",
				borderRadius: "8px",
				boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
				backgroundColor: "white",
			}}
		>
			{error && (
				<Alert severity="error">
					<AlertTitle>Error</AlertTitle>
					{error}
				</Alert>
			)}
			<Typography
				variant="h5"
				component="div"
				sx={{ mb: 2 }}
			>
				Register Form
			</Typography>
			<TextField
				fullWidth
				label="Fullname"
				{...register("fullname", {
					setValueAs: v => (v === "" ? undefined : v),
				})}
				error={!!errors.fullname}
				helperText={errors.fullname?.message}
				margin="normal"
			/>
			<TextField
				fullWidth
				label="Email"
				type="text"
				autoComplete="email"
				{...register("email", {
					setValueAs: v => (v === "" ? undefined : v),
				})}
				error={!!errors.email}
				helperText={errors.email?.message}
				margin="normal"
			/>
			<TextField
				fullWidth
				label="Phone number"
				type="number"
				autoComplete="tel"
				{...register("phone", {
					setValueAs: v => (v === "" ? undefined : v),
				})}
				error={!!errors.phone}
				helperText={errors.phone?.message}
				margin="normal"
			/>
			<FormControl
				fullWidth
				variant="outlined"
				margin="normal"
				error={!!errors.password}
			>
				<InputLabel htmlFor="password">Password</InputLabel>
				<OutlinedInput
					label="Password"
					id="password"
					autoComplete="current-password"
					type={showPassword ? "text" : "password"}
					{...register("password", {
						setValueAs: v => (v === "" ? undefined : v),
					})}
					endAdornment={
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={handleClickShowPassword}
								onMouseDown={handleMouseEvents}
								onMouseUp={handleMouseEvents}
								edge="end"
							>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					}
				/>
				<FormHelperText>{errors.password?.message}</FormHelperText>
			</FormControl>

			<Button
				type="submit"
				variant="contained"
				color="primary"
				fullWidth
				sx={{ mt: 2 }}
			>
				Sign up
			</Button>
			<Grid
				sx={{ mt: 2 }}
				container
				justifyContent="flex-end"
			>
				<Grid item>
					<Link
						href="/login"
						variant="body2"
						component={LinkBehaviour} className="text-decoration-none hover:font-semibold"
					>
						Already have an account? Sign in
					</Link>
				</Grid>
			</Grid>
		</Box>
	);
};

export default RegisterForm;
