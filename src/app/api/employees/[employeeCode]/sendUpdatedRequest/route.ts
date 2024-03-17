import { NextRequest, NextResponse } from "next/server";

// API employee send updated request
export async function PUT(
	req: NextRequest,
	{ params }: { params: { employeeCode: string } }
) {
	const updatedEmployee = await req.json();

	try {
		const res = await fetch(
			process.env.NEXT_PUBLIC_API_URL +
				`/Employee/${params.employeeCode}/UpdateInfoAsync`,
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
				message:
					"Send updated request successfully. Please wait for the admin accept.",
			});
		}

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Failed to send updated request !",
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Oops! Error while trying to send request !",
		});
	}
}
