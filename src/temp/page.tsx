"use client";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PasswordIcon from "@mui/icons-material/Password";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import React from "react";
import { DashboardContext } from "@/contexts/DashboardContext";

export default function EmployeeDashboardListPage() {
	const dashboardContext = React.useContext(DashboardContext);

	return (
		<Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
			<nav aria-label="main mailbox folders">
				<List>
					<ListItem
						disablePadding
						onClick={() => dashboardContext?.setSelectedTab("tab1")}>
						<ListItemButton sx={{ height: 56 }}>
							<ListItemIcon>
								<AccountCircleIcon />
							</ListItemIcon>
							<ListItemText primary="Profile" />
						</ListItemButton>
					</ListItem>
					<ListItem
						disablePadding
						onClick={() => dashboardContext?.setSelectedTab("tab2")}>
						<ListItemButton sx={{ height: 56 }}>
							<ListItemIcon>
								<PasswordIcon />
							</ListItemIcon>
							<ListItemText primary="Change Password" />
						</ListItemButton>
					</ListItem>
					<ListItem
						disablePadding
						onClick={() => dashboardContext?.setSelectedTab("tab3")}>
						<ListItemButton sx={{ height: 56 }}>
							<ListItemIcon>
								<LocalShippingIcon />
							</ListItemIcon>
							<ListItemText primary="Packages" />
						</ListItemButton>
					</ListItem>
				</List>
			</nav>
		</Box>
	);
}
