import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const payload = await req.json();

	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Package/add`, {
			method: req.method,
			headers: req.headers,
			body: JSON.stringify(payload),
		});

		if (res.ok) {
			let data = await res.json();
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Add package successfully",
				data,
			});
		}
		console.log("Unhandled server-side error in add package");
		console.log(await res.text());
		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to add package",
		});
	} catch (error) {
		console.log("Unhandled client-side error in add package", error);

		return NextResponse.json({
			ok: false,
			status: "error",
			message: "Error to add package",
		});
	}
}
