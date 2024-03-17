import { NextResponse } from "next/server";
export async function GET(req: Request) {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL +"/Location", {
            cache: "no-store",
        });
        const data = await response.json();
        return NextResponse.json({ data: data });
    } catch (error) {
        return NextResponse.json({ error: "api backend error" });
    }
}
// POST
export async function POST(req: Request) {
	const location = await req.json();
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/Location`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(location),
		});

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Add location successfully",
			});
		}

		if(res.status === 400){
			return NextResponse.json({
				ok: false,
				status: 400,
				message: res.text(),
			});
		}
	} catch (error) {
		return console.log("Error add location: ", error);
	}
}
// PUT
export async function PUT(req: Request) {
	const Location = await req.json();
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/Location/`+Location.id, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(Location),
		});

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Edit Location successfully",
			});
		}

		if(res.status === 400){
			return NextResponse.json({
				ok: false,
				status: 400,
				message: res.text(),
			});
		}

		return NextResponse.json({
			ok: false,
			status: "server error",
			message: "Fail to edit Location",
		});
	} catch (error) {
		return console.log("Error edit Location: ", error);
	}
}