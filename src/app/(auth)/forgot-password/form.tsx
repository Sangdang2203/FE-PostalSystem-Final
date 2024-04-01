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
import LinkBehaviour from "../../../components/LinkBehaviour";
import AlertTitle from "@mui/material/AlertTitle";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import { ApiResponse } from "@/types/types";
import { Divider } from "@mui/material";

const url = process.env.NEXT_PUBLIC_API_URL + "/Users/Login";

const schema = z.object({
	email: z
		.string({
			required_error: "Email is required!",
		})
		.min(8, "Email must be at least 8 characters!")
		.max(50)
		.email("Invalid email format."),
});

type Schema = z.infer<typeof schema>;

const ForgotPasswordForm = () => {
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

	const onSubmit = async (formData: Schema) => {
		const res = await fetch("/api/forgot-password", {
			method: "POST",
			body: JSON.stringify(formData),
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = (await res.json()) as ApiResponse;

		if (data.ok) {
			console.log("success");
		} else {
			setError(data.message);
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
			<Typography
				variant="body2"
				component="div"
				sx={{ mb: 2 }}
			>
				Enter your email to receive new password
			</Typography>
			<Divider />

			<TextField
				size="small"
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

			<Button
				type="submit"
				variant="contained"
				color="primary"
				fullWidth
				sx={{ mt: 2 }}
			>
				Send
			</Button>
			<Grid
				sx={{ mt: 2 }}
				container
				justifyContent="flex-end"
			>
				<Grid item>
					<Link
						href="/login"
						variant="caption"
						className="text-decoration-none"
						component={LinkBehaviour}
					>
						Remember your password?
					</Link>
				</Grid>
			</Grid>
		</Box>
	);
};

export default ForgotPasswordForm;
