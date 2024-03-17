import { NextRequest, NextResponse } from "next/server";

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: number } }
) {
	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/Users/${params.id}/all`,
			{
				// header must have access token
				headers: req.headers,
				method: req.method,
			}
		);

		const data = await res.json();

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Success to get user with all",
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

		console.log("Unhandled server-side error in get user with all");

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to get user with all",
		});
	} catch (error: any) {
		console.log("Unhandled client-side error in get user with all", error);

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to get user with all",
		});
	}
}

export async function POST(
	req: NextRequest,
	{ params }: { params: { id: number } }
) {
	try {
		const payload = await req.json();

		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/Users/${params.id}/all`,
			{
				// header must have access token
				headers: req.headers,
				method: req.method,
				body: JSON.stringify(payload),
			}
		);

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Success to get user all",
			});
		}
		console.log(res);
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

		console.log("Unhandled server-side error in get user all");

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to get user all",
		});
	} catch (error: any) {
		console.log("Unhandled client-side error in get user all", error);

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to get user all",
		});
	}
}
