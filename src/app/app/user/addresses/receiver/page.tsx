"use client";

import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useSession } from "next-auth/react";
import { Address } from "@/types/types";
import { getReceiverAddressesByUserId, refreshToken } from "@/app/_data/method";

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
];

export default function UserPackagesPage() {
	const [addresses, setAddresses] = React.useState<Address[]>([]);
	const { data: session, update } = useSession();

	React.useEffect(() => {
		if (session) {
			getReceiverAddressesByUserId(session.user.id, session.user.token).then(
				res => {
					if (res.ok) {
						setAddresses(res.data);
					} else if (res.status === "Unauthorized") {
						refreshToken(session.user.token).then(res => {
							if (res.ok) {
								update({
									token: res.data.token,
								});
							}
						});
					}
				}
			);
		}
	}, [session, update]);

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
					row.postalCode
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
