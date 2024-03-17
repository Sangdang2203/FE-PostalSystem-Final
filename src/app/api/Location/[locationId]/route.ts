import { NextResponse } from "next/server";
export async function GET(req: Request,{ params }: { params: { locationId: number } }) {
    const locationId = params.locationId;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Location/${locationId}`,{
            cache: "no-store",
        })
        const data = await res.json();
        if(res.ok){
            return NextResponse.json({ 
                status: 200,
                data: data 
            });
        }
    } catch (error) {
        return NextResponse.json({ error: "api backend error" });
    }
}