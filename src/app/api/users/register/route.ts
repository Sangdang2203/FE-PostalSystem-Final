import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const formData = await req.json();

		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/Users/Register`,
			{
				headers: req.headers,
				method: req.method,
				body: JSON.stringify(formData),
			}
		);

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Success to register user",
			});
		}

		const data = await res.json();

		if (res.status === 409) {
			return NextResponse.json({
				ok: false,
				status: data.code,
				message: data.message,
			});
		}

		if (res.status === 400) {
			return NextResponse.json({
				ok: false,
				status: data.code,
				message: data.errors[0].message,
			});
		}

		console.log("Unhandled server-side error in register");

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to register user",
		});
	} catch (error: any) {
		console.log("Unhandled client-side error in register", error);

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to register user",
		});
	}
}
