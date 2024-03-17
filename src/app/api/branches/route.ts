import { NextResponse } from "next/server";
export async function GET(req: Request) {
	try {
		let api = process.env.API_URL;
		const response = await fetch(`${api}/Branch/all`, {
			cache: "no-store",
		});
		const data = await response.json();
		if (data.length === 0) {
			return NextResponse.json({ message: "No data", status: 404 });
		}
		return NextResponse.json({ branchs: data });
	} catch (error) {
		return NextResponse.json({ error: "api backend error" });
	}
}
