import React from "react";

interface DashboardContextProps {
	selectedTab: string;
	setSelectedTab: (tab: string) => void;
}

const DashboardContext = React.createContext<DashboardContextProps | null>(
	null
);

export { DashboardContext };
