import { NextRequest, NextResponse } from "next/server";

// API employee change password
export async function PUT(
	req: NextRequest,
	{ params }: { params: { employeeCode: string } }
) {
	const updatedEmployee = await req.json();

	try {
		const res = await fetch(
			process.env.NEXT_PUBLIC_API_URL +
				`/Employee/${params.employeeCode}/ChangePassword`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedEmployee),
			}
		);

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Change password successfully.",
			});
		}

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Failed to change password !",
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Oops! Error while trying to change password !",
		});
	}
}
