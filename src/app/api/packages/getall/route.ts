import { NextResponse } from "next/server";
export async function GET(req: Request) {
    try {
        let api = process.env.API_URL;
        const response = await fetch(`${api}/Package/all`,{
            next:{
                revalidate: 60,
            }
        });
        const data = await response.json();
        return NextResponse.json({ packages: data });
    } catch (error) {
        return NextResponse.json({ error: "api backend error" });
    }
}