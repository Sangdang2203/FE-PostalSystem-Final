import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";

// GET Employee by Code
export async function GET(
	req: Request,
	{ params }: { params: { employeeCode: string } }
) {
	try {
		const code = params.employeeCode;

		const res = await fetch(
			process.env.NEXT_PUBLIC_API_URL + `/Employee/code/${code}`,
			{
				method: "GET",
				cache: "no-cache",
			}
		);

		let data = null;
		if (res.ok) {
			data = await res.json();
		}

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Get employee successfully",
				data,
			});
		}

		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Failed to get employee",
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Failed to get employee",
		});
	}
}

// API employee update employee
export async function PUT(
	req: NextRequest,
	{ params }: { params: { employeeCode: string } }
) {
	const updatedEmployee = await req.json();

	try {
		const res = await fetch(
			process.env.NEXT_PUBLIC_API_URL + `/Employee/${params.employeeCode}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updatedEmployee),
			}
		);

		let data = null;
		if (res.ok) {
			data = await res.json();
		}

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Updated successfully.",
			});
		}

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Failed to update !",
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Oops! Error while trying to update.",
		});
	}
}
