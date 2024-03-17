import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const payload = await req.json();

		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/Users/Forgot-password`,
			{
				headers: req.headers,

				method: req.method,
				body: JSON.stringify(payload),
			}
		);

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Success forgot password",
			});
		}

		const data = await res.json();

		if (res.status === 400) {
			return NextResponse.json({
				ok: false,
				status: data.title,
				message: data.errors[0].message,
			});
		}

		if (res.status === 404) {
			return NextResponse.json({
				ok: false,
				status: data.code,
				message: data.message,
			});
		}

		console.log("Unhandled server-side error in forgot-password");

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to forgot password",
		});
	} catch (error: any) {
		console.log("Unhandled client-side error in forgot-password", error);

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to forgot password",
		});
	}
}
