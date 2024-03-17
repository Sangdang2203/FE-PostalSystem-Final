import { NextRequest, NextResponse } from "next/server";

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: number } }
) {
	try {
		const formData = await req.json();

		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/Users/${params.id}/Change-password`,
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
				message: "Success to change password",
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

		if (res.status === 401) {
			return NextResponse.json({
				ok: false,
				status: data.code,
				message: data.message,
			});
		}

		if (res.status === 404) {
			return NextResponse.json({
				ok: false,
				status: data.code,
				message: data.message,
			});
		}

		console.log("Unhandled server-side error in change-password");

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to change password",
		});
	} catch (error: any) {
		console.log("Unhandled client-side error in change-password", error);

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to change password",
		});
	}
}
