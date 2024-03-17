"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { Box, Typography, TextField, Button } from "@mui/material";
import { toast } from "sonner";

const schema = z.object({
	otp: z
		.string({
			required_error: "Otp is required!",
		})
		.length(6, "Otp must be 6 characters!"),
});

type Schema = z.infer<typeof schema>;

export default function VerifyEmailPage() {
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
		const res = await fetch("/api/users/verify-email", {
			method: "POST",
			body: JSON.stringify(formData),
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = await res.json();

		if (data.ok) {
			signIn(undefined, { callbackUrl });
		} else {
			toast.error(data.message);
		}
	};

	return (
		<>
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
				<Typography
					variant="h5"
					component="div"
					sx={{ mb: 2 }}
				>
					Email Verification
				</Typography>
				<TextField
					fullWidth
					label="Otp"
					{...register("otp", {
						setValueAs: v => (v === "" ? undefined : v),
					})}
					error={!!errors.otp}
					helperText={errors.otp?.message}
					margin="normal"
				/>

				<Button
					type="submit"
					variant="contained"
					color="error"
					fullWidth
					sx={{ mt: 2 }}
				>
					Verify Account
				</Button>
			</Box>
		</>
	);
}
