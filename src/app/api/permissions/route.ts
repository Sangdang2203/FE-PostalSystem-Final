import { NextResponse } from "next/server";

// Get permissions
export async function GET() {
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/Permission", {
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
				message: "Get permissions successfully.",
				data,
			});
		}

		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Failed to get permissions.",
		});
	} catch (error) {
		console.log(error);
		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Oops! Error while trying to get permissions.",
		});
	}
}
// API add an permission
export async function POST(req: Request) {
	const permission = await req.json();
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/Permission`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(permission),
		});

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Add permission successfully.",
			});
		}
		const data = await res.json();
		console.log(data);

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Failed to add permission ! The permission has already existed.",
		});
	} catch (error) {
		console.log("Error add permission: ", error);
		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Oops! Error while trying to add permission.",
		});
	}
}
