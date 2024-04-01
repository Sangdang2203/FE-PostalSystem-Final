"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinkBehaviour from "@/components/LinkBehaviour";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import AlertTitle from "@mui/material/AlertTitle";
import Alert from "@mui/material/Alert";
import { toast } from "sonner";
import { Divider } from "@mui/material";

const schema = z.object({
	userId: z
		.string({
			required_error: "Username is required!",
		})
		.min(3, "Username must be at least 3 characters!")
		.max(50),
	password: z
		.string({
			required_error: "Password is required!",
		})
		.min(3, "Password must be at least 3 characters!")
		.max(50),
});

type Schema = z.infer<typeof schema>;

const UserLoginForm = () => {
	const [showPassword, setShowPassword] = React.useState(false);

	const [error, setError] = React.useState("");
	const router = useRouter();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Schema>({
		resolver: zodResolver(schema),
	});

	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";

	const handleClickShowPassword = () => {
		setShowPassword(show => !show);
	};

	const handleMouseEvents = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
	};

	const onSubmit = async (data: Schema) => {
		try {
			toast.promise(
				signIn("credentials", {
					redirect: false,
					username: data.userId,
					password: data.password,
				}),
				{
					success(data) {
						router.push("/app");
						return "Logged in successfully";
					},
					loading: "Logging in...",
					error: "Invalid email or password",
				}
			);
		} catch (error) {
			console.log("An unexpected error happened");
		}
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit(onSubmit)}
			sx={{
				maxWidth: "400px",
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
			<Typography variant="h5" sx={{ textAlign: "center", mb: 2 }}> Login Your Account </Typography>
			<Divider />

			<Box sx={{ mt: 3 }}>
				<TextField
					size="small"
					fullWidth
					label="Username"
					{...register("userId", {
						setValueAs: v => (v === "" ? undefined : v),
					})}
					error={!!errors.userId}
					helperText={errors.userId?.message}
					margin="normal"
				/>
				<FormControl
					size="small"
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
									{showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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
					Login
				</Button>
				<Box sx={{ textAlign: "center" }}>
					<Link
						sx={{ display: "flex", justifyContent: "flex-end", my: 1 }}
						className="text-decoration-none hover:font-semibold"
						component={LinkBehaviour}
						href="/forgot-password"
						variant="caption"
					>
						Forgot Password?
					</Link>
					<Divider />
					<Box mt={1}>
						<Link
							className="text-decoration-none"
							component={LinkBehaviour}
							href="/register"
							variant="body2"
						>
							Don&apos;t have an account? <i className=" hover:font-semibold ">Register now</i>
						</Link>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default UserLoginForm;
