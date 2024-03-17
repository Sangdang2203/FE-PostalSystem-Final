import { NextResponse } from "next/server";
export async function GET(req: Request) {
    try {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL +"/FeeCustom", {
            cache: "no-store",
        });
        const data = await response.json();
        return NextResponse.json({ data: data });
    } catch (error) {
        return NextResponse.json({ error: "api backend error" });
    }
}