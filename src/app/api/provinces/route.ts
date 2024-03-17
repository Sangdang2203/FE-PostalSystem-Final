import { NextResponse } from "next/server";

export async function GET() {
	try {
		const res = await fetch(
			process.env.NEXT_PUBLIC_API_URL + "/Location/Province",
			{
				method: "GET",
				cache: "no-cache",
			}
		);

		const data = await res.json();

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Get provinces successfully",
				data,
			});
		}

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Failed to get provinces",
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Oops! Error while trying to get provinces.",
		});
	}
}
