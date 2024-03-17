import { NextResponse } from "next/server";

// API get roles
export async function GET() {
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/Role", {
			method: "GET",
			cache: "no-cache",
		});

		const data = await res.json();

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
		console.log(error);
		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Oops! Error while trying to get roles",
		});
	}
}

// API add role
export async function POST(req: Request) {
	const role = await req.json();
	role.status = 1;
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/Role`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(role),
		});

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Add role successfully.",
			});
		}
		const data = await res.json();

		return NextResponse.json({
			ok: false,
			status: "server error",
			message: "Failed to add role ! The role has already existed.",
		});
	} catch (error) {
		console.log("Error add role: ", error);
		return NextResponse.json({
			ok: false,
			status: "Server error",
			message: "Oops! Error while trying to add role.",
		});
	}
}
