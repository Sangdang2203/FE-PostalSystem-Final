import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: number } }
) {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/Users/${params.id}/Packages`,
			{
				headers: req.headers,
				method: req.method,
			}
		);

		const data = await res.json();

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Success to get user with packages",
				data,
			});
		}

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

		console.log("Unhandled server-side error in get user with packages");

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to get user with packages",
		});
	} catch (error: any) {
		console.log("Unhandled client-side error in get user with packages", error);

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to get user with packages",
		});
	}
}
