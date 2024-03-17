import { NextResponse } from "next/server";
export async function GET(req: Request,{ params }: { params: { id: number } }) {
    const id = params.id;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Branch/packages/${id}`,{
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