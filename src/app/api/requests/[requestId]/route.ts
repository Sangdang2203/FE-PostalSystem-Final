import { ApiResponse } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

// API accept updated request from employee
export async function PUT(
	req: NextRequest,
	{ params }: { params: { requestId: number } }
) {
	try {
		const apiResponse = await fetch(
			process.env.NEXT_PUBLIC_API_URL +
				`/Employee/` +
				params.requestId +
				`/AcceptUpdateInfo`,
			{
				method: "PUT",
				cache: "no-cache",
			}
		);

		const data = await apiResponse.json();

		if (apiResponse.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Updated request was accepted.",
				data,
			});
		}

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Failed to accept updated request.",
		});
	} catch (error) {
		console.log("Error accepting request: ", error);
		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Oops! Error while trying to accept updated request.",
		});
	}
}

// API reject updated request from employee
export async function DELETE(
	req: NextRequest,
	{ params }: { params: { requestId: number } }
) {
	try {
		const res = await fetch(
			process.env.NEXT_PUBLIC_API_URL +
				`/Employee/` +
				params.requestId +
				`/RejectUpdateInfo`,
			{
				method: "DELETE",
				cache: "no-cache",
			}
		);

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Reject request successfully.",
			});
		}

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Failed to reject request !",
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			ok: false,
			status: "server error",
			message: "Server error: Failed to reject request !",
		});
	}
}
