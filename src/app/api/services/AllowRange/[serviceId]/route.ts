import { NextResponse } from "next/server";
export async function GET(req: Request,{ params }: { params: { serviceId: number } }) {
    const serviceId = params.serviceId;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/AllowRange/${serviceId}`,{
            cache: "no-store",
        })
        const data= await res.json();
        if(res.status == 200){
            return NextResponse.json({
                status: 200,
                Ok: true,
                data: data
            })
        }else{
            return NextResponse.json({ 
                error: "api backend error",
                Ok: false,
                status: 400,
         });
        }
    } catch (error) {
        return NextResponse.json({ error: "api backend error" });
    }

}