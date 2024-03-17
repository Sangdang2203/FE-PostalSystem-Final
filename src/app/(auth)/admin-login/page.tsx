"use client";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useSession } from "next-auth/react";
import AdminLoginForm from "./AdminLoginForm";
import { Metadata } from "next";
import React from "react";

export default function LoginPage() {
	const [value, setValue] = React.useState(0);
	const { data: session } = useSession();

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		<div className="my-35">
			<Tabs
				value={value}
				onChange={handleChange}
				centered>
				<Tab label="Admin" />
			</Tabs>

			{value === 0 && <AdminLoginForm />}
		</div>
	);
}
