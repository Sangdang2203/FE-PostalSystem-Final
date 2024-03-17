import { NextRequest, NextResponse } from "next/server";
// API remove permission from role
export async function DELETE(
	req: NextRequest,
	{
		params,
	}: {
		params: { roleId: number; permissionName: string };
	}
) {
	try {
		const res = await fetch(
			process.env.NEXT_PUBLIC_API_URL +
				"/Role/" +
				params.roleId +
				"/Permission/" +
				params.permissionName,
			{
				method: "DELETE",
				cache: "no-cache",
			}
		);
		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Delete permission to role successfully.",
			});
		}

		return NextResponse.json({
			ok: false,
			status: "server error",
			message:
				"Failed to delete ! The permission is one of system permissions.",
		});
	} catch (error) {
		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Oops! Error while trying to delete permissions.",
		});
	}
}
