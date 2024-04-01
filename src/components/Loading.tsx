import { Box, CircularProgress } from "@mui/material";
import * as React from "react";

export default function Loading() {
	return (
		<Box sx={{ display: "flex", direction: "revert-layer", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
			<CircularProgress
				variant="indeterminate"
				color="error"
				size={50}
				thickness={2}
				aria-label="Loading ..."
			/>
		</Box>
	);
}
