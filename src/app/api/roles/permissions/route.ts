import { NextResponse } from "next/server";

// API get permissions
export async function GET() {
	try {
		const res = await fetch(
			process.env.NEXT_PUBLIC_API_URL + "/Role/Permissions",
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
				message: "Get roles successfully.",
				data,
			});
		}

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Failed to get roles.",
		});
	} catch (error) {
		return NextResponse.json({
			ok: false,
			status: "server error",
			message: "Oops! Error while trying to get roles.",
		});
	}
}
