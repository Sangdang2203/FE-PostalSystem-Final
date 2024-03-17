import { CircularProgress } from "@mui/material";
import * as React from "react";

export default function Loading() {
	return (
		<div className="flex justify-center items-center my-10">
			<CircularProgress
				variant="indeterminate"
				color="error"
				size={30}
				className="mb-10"
			/>
		</div>
	);
}
