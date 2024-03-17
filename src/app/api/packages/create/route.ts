import { NextResponse } from "next/server";
export async function POST(req: Request) {
	try {
		const data = await req.json();
		const apilink = process.env.API_URL;
		const response = await fetch(`${apilink}/Package/add`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});
		console.log("Response:", response);
		return NextResponse.json({
			data: response,
			ok: true,
			message: "Package created successfully",
		});
	} catch (error) {
		console.log("Error:", error);
		return NextResponse.json({
			status: false,
			message: "Package creation failed",
		});
	}
}
