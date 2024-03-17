import { NextResponse } from "next/server";
export async function GET(req: Request) {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL +"/ServiceType", {
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
	const serviceType = await req.json();
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/ServiceType`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(serviceType),
		});

        const data = await res.json();

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Add service type successfully",
                data: data,
			});
		}

		return NextResponse.json({
			ok: false,
			status: "server error",
			message: "Fail to add type service",
		});
	} catch (error) {
		return console.log("Error add service type: ", error);
	}
}
// PUT
export async function PUT(req: Request) {
	const serviceType = await req.json();
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/ServiceType`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(serviceType),
		});

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Edit serviceType successfully",
			});
		}

		return NextResponse.json({
			ok: false,
			status: "server error",
			message: "Fail to edit serviceType",
		});
	} catch (error) {
		return console.log("Error edit serviceType: ", error);
	}
}