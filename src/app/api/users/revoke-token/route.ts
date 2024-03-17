import { NextRequest, NextResponse } from "next/server";

//logout
export async function DELETE(req: NextRequest) {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/Users/Revoke-token`,
			{
				// header must have access token
				headers: req.headers,
				method: req.method,
			}
		);

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Success to revoke token",
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
				status: data.code,
				message: data.errors[0].message,
			});
		}

		console.log("Unhandled server-side error in revoke token");

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to revoke token",
		});
	} catch (error: any) {
		console.log("Unhandled client-side error in revoke token", error);

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to revoke token",
		});
	}
}
