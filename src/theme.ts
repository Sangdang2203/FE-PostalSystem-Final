"use client";

import { Open_Sans } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const openSan = Open_Sans({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
	display: "swap",
});

const theme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#1877F2",
			light: "#034694",
			dark: "##1877F2",
		},
		secondary: {
			main: "#662d91",
			light: "#720e9e",
			dark: "#720e9e",
		},
		success: {
			main: "#008200",
			light: "#40a829",
			dark: "#40a829",
		},
		error: {
			main: "#D2122E",
			light: "#EF0107",
			dark: "#EF0107",
		},
		warning: {
			main: "#FEBE10",
			light: "#FFD700",
			dark: "#FFD700",
		},
	},

	typography: {
		fontFamily: openSan.style.fontFamily,
	},

	components: {
		MuiAlert: {
			styleOverrides: {
				root: ({ ownerState }) => ({
					...(ownerState.severity === "info" && {
						backgroundColor: "#60a5fa",
					}),
				}),
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					boxShadow: "rgba(76, 78, 100, 0.2) 0px 3px 13px 3px",
				},
			},
		},
	},
});

export default theme;
