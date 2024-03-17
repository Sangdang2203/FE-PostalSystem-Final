import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: { token: string } }
) {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/Users/Reset-password/${params.token}`,
			{
				headers: req.headers,
				method: req.method,
			}
		);

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Success to go to reset password",
			});
		}

		const data = await res.json();

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

		console.log("Unhandled server-side error in go to reset password");

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to go to reset password",
		});
	} catch (error: any) {
		console.log("Unhandled client-side error in go to reset password", error);

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to go to reset password",
		});
	}
}
