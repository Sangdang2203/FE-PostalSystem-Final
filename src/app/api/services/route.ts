import { DataServiceType } from "@/helper/interface";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL +"/Service", {
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
	const service = await req.json();
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/Service`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(service),
		});

        const data = await res.json();

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Add service successfully",
                data: data,
			});
		}

		return NextResponse.json({
			ok: false,
			status: "server error",
			message: "Fail to add service",
		});
	} catch (error) {
		return console.log("Error add service: ", error);
	}
}
// PUT
export async function PUT(req: Request) {
	const service:DataServiceType = await req.json();
	try {
		const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/Service`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(service),
		});

		if (res.ok) {
			return NextResponse.json({
				ok: true,
				status: "success",
				message: "Edit service successfully",
			});
		}

		return NextResponse.json({
			ok: false,
			status: "server error",
			message: "Fail to edit service",
		});
	} catch (error) {
		return console.log("Error edit service: ", error);
	}
}