"use client";

import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";
import { Address } from "@/types/types";

const columns: GridColDef[] = [
	{ field: "name", headerName: "Name", minWidth: 150 },
	{ field: "phoneNumber", headerName: "PhoneNumber" },
	{ field: "address", headerName: "Address" },
	{
		field: "ward",
		headerName: "Ward",
	},
	{
		field: "district",
		headerName: "District",
	},
	{
		field: "city",
		headerName: "City",
	},
	{
		field: "postalCode",
		headerName: "Postal Code",
	},
	{
		field: "typeInfo",
		headerName: "Type",
	},
];

export default function UserPackagesPage() {
	const [addresses, setAddresses] = React.useState<Address[]>([]);
	const { data: session } = useSession();

	React.useEffect(() => {
		if (session?.user.id) {
			fetch(`/api/users/${session.user.id}/addresses`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${session.user.token}`,
				},
			})
				.then(response => response.json())
				.then(data => setAddresses(data.data));
		}
	}, [session?.user.id, session?.user.token]);

	return (
		<div style={{ height: 400, width: "100%" }}>
			<DataGrid
				getRowId={row =>
					row.name +
					row.phoneNumber +
					row.address +
					row.ward +
					row.district +
					row.city +
					row.postalCode +
					row.type
				}
				rows={addresses}
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
