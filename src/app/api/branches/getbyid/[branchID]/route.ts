import { NextResponse } from "next/server";
export async function GET(req: Request, {params}: {params: {branchID: string}}) {
    try {
        let api = process.env.API_URL;
        const response = await fetch(`${api}/Branch/getbyid/${params.branchID}`, {
            cache: "no-cache",
        });
        const data = await response.json();
        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: "api backend error" });
    }
    }