"use client";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import React from "react";
import { useSession } from "next-auth/react";
import EmployeeLoginForm from "./EmployeeLoginForm";
import { Box } from "@mui/material";

export default function LoginPage() {
	const [value, setValue] = React.useState(0);
	const { data: session } = useSession();

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	return (
		// <div className="my-35">
		// 	<Tabs
		// 		value={value}
		// 		onChange={handleChange}
		// 		centered
		// 	>
		// 		<Tab label="Employee" />
		// 	</Tabs>

		// 	{value === 0 && <EmployeeLoginForm />}
		// </div>
		<div className="my-35" >
			<EmployeeLoginForm />
		</div>
	);
}
