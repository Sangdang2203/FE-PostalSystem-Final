import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	try {
		const res = await fetch(
			process.env.NEXT_PUBLIC_API_URL +
				"/Location/GetListLocationByLevel/Province",
			{
				method: req.method,
				headers: req.headers,
				cache: "no-cache",
			}
		);

		const data = await res.json();

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Get locations successfully.",
				data,
			});
		}

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Failed to get locations !",
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Oops! Error while trying to get locations !",
		});
	}
}
