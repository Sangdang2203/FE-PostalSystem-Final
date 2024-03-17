import { NextRequest, NextResponse } from "next/server";

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: number } }
) {
	try {
		const apiResponse = await fetch(
			process.env.NEXT_PUBLIC_API_URL +
				`/Employee/` +
				params.id +
				`/ChangeStatus`,
			{
				method: "PUT",
				cache: "no-cache",
			}
		);

		let data = null;
		if (apiResponse.ok) {
			data = await apiResponse.json();
		}

		if (apiResponse.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Change status successfully.",
				data,
			});
		}

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Failed to change status.",
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
