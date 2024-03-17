"use client";

import React from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";

const columns: GridColDef[] = [
	{ field: "id", headerName: "ID", type: "number", width: 70 },
	{ field: "trackingCode", headerName: "TrackingCode", width: 130 },
	{ field: "nameFrom", headerName: "NameFrom", width: 130 },
	{
		field: "addressFrom",
		headerName: "AddressFrom",
		width: 90,
	},
	{
		field: "postalCodeFrom",
		headerName: "PostalCodeFrom",
		width: 90,
	},
	{
		field: "nameTo",
		headerName: "NameTo",
		width: 90,
	},
	{
		field: "addressTo",
		headerName: "AddressTo",
		width: 90,
	},
	{
		field: "postalCodeTo",
		headerName: "PostalCodeTo",
		width: 90,
	},
	{
		field: "packageSize",
		headerName: "PackageSize",
		width: 90,
	},
	{
		field: "packageNote",
		headerName: "PackageNote",
		width: 90,
	},
	{
		field: "totalFee",
		headerName: "TotalFee",
		width: 90,
		type: "number",
	},
	{
		field: "serviceId",
		headerName: "ServiceId",
		width: 90,
		type: "number",
	},
	{
		field: "step",
		headerName: "Step",
		width: 90,
		type: "number",
	},
	{
		field: "status",
		headerName: "Status",
		width: 90,
		type: "number",
	},
];

interface Package {
	id: number;
	trackingCode: string;
	nameFrom: string;
	addressFrom: string;
	postalCodeFrom: string;
	nameTo: string;
	addressTo: string;
	postalCodeTo: string;
	packageSize: number;
	packageNote: string;
	totalFee: number;
	serviceId: number;
	step: number;
	status: number;
}

interface UserWithPackages {
	id: number;
	fullname: string;
	email: string;
	phone: string;
	avatar?: string;
	status: number;
	packages: Package[];
}

export default function UserPackagesPage() {
	const [user, setUser] = React.useState<UserWithPackages | null>(null);
	const { data: session } = useSession();

	React.useEffect(() => {
		if (session?.user.id) {
			fetch(`/api/users/${session.user.id}/packages`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${session.user.token}`,
				},
			})
				.then(response => response.json())
				.then(data => setUser(data.data));
		}
	}, [session?.user.id, session?.user.token]);

	return (
		<div style={{ height: 400, width: "100%" }}>
			<DataGrid
				rows={user?.packages || []}
				columns={columns}
				initialState={{
					pagination: {
						paginationModel: { page: 0, pageSize: 5 },
					},
				}}
				pageSizeOptions={[5, 10]}
			/>
		</div>
	);
}
