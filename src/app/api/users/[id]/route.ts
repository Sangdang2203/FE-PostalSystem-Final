import { NextRequest, NextResponse } from "next/server";

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: number } }
) {
	const formData = await req.json();

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/Users/${params.id}`,
		{
			headers: req.headers,
			method: req.method,
			credentials: req.credentials,
			body: JSON.stringify(formData),
		}
	);

	try {
		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Success to update user",
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

		console.log("Unhandled server-side error in update user");

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to change password",
		});
	} catch (error: any) {
		console.log("Unhandled client-side error in update user");

		if (res.status === 401) {
			return NextResponse.json({
				ok: false,
				status: "Unauthorized",
				message: "Error to update user",
			});
		}

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to update user",
		});
	}
}

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: number } }
) {
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/Users/${params.id}`,
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
				message: "Success to get user",
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

		console.log("Unhandled server-side error in get user");

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to get user",
		});
	} catch (error: any) {
		//console.log("Unhandled client-side error in get user", error);
		if (res.status === 401) {
			return NextResponse.json({
				ok: false,
				status: "Unauthorized",
				message: "Error to get user",
			});
		}

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to get user",
		});
	}
}
