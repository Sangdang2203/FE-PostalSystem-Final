import { NextResponse } from "next/server";

// GET ALL
export async function GET() {
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/Users", {
			method: "GET",
			cache: "no-cache",
		});

		let data = null;
		if (res.ok) {
			data = await res.json();
		}

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Get users successfully.",
				data,
			});
		}

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Fail to get users.",
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Oops! Error while trying to get users.",
		});
	}
}
