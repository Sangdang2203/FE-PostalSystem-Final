import { NextRequest, NextResponse } from "next/server";

// API delete role
export async function DELETE(
	req: NextRequest,
	{ params }: { params: { roleId: number } }
) {
	try {
		const res = await fetch(
			process.env.NEXT_PUBLIC_API_URL + `/Role/` + params.roleId,
			{
				method: "DELETE",
				cache: "no-cache",
			}
		);

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Delete role successfully.",
			});
		}

		return NextResponse.json({
			ok: false,
			status: "server error",
			message:
				"Failed to delete ! The role is one of system roles or some employees already have this role.",
		});
	} catch (error) {
		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Oops! Error while trying to delete role !",
		});
	}
}
