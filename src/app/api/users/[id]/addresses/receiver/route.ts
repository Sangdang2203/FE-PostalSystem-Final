import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: number } }
) {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/Users/${params.id}/Addresses/Receiver`,
		{
			// header must have access token
			headers: req.headers,
			method: req.method,
			credentials: req.credentials,
		}
	);
	try {
		const data = await res.json();

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Success to get user with addresses",
				data,
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

		console.log("Unhandled server-side error in get user with addresses");

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to get user with addresses",
		});
	} catch (error: any) {
		if (res.status === 401) {
			return NextResponse.json({
				ok: false,
				status: "Unauthorized",
				message: "Error to get user with addresses",
			});
		}

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to get user with addresses",
		});
	}
}
