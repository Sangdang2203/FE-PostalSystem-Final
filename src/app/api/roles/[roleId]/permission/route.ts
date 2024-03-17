import { NextRequest, NextResponse } from "next/server";

// API add permissions into role
export async function POST(
	req: NextRequest,
	{
		params,
	}: {
		params: { roleId: number };
	}
) {
	const payload = await req.json();

	try {
		const res = await fetch(
			process.env.NEXT_PUBLIC_API_URL +
				"/Role/" +
				params.roleId +
				"/Permission",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
				cache: "no-cache",
			}
		);

		let data = null;

		if (res.ok) {
			data = await res.json();
		}

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Add permission successfully",
				data,
			});
		}

		return NextResponse.json({
			ok: false,
			status: "server error",
			message: "Failed to add! The permission has already existed.",
		});
	} catch (error) {
		return NextResponse.json({
			ok: false,
			status: "server error",
			message: "Failed to add permission into role !",
		});
	}
}
