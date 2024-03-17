import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const formData = await req.json();

		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/Users/Verify-email`,
			{
				headers: req.headers,
				method: req.method,
				body: JSON.stringify(formData),
			}
		);

		const data = await res.json();

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Success to verify email",
			});
		}

		if (res.status === 401) {
			return NextResponse.json({
				ok: false,
				status: data.code,
				message: data.message,
			});
		}

		if (res.status === 400) {
			return NextResponse.json({
				ok: false,
				status: data.title,
				message: data.errors[0].message,
			});
		}

		console.log("Unhandled server-side error in verify-email");

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to verify email",
		});
	} catch (error: any) {
		console.log("Unhandled client-side error in verify-email", error);

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to verify email",
		});
	}
}
