import { NextResponse } from "next/server";
export async function GET(req: Request,{ params }: { params: { locationId: number } }) {
    const locationId = params.locationId;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Location/GetChildLocation/${locationId}`,{
            cache: "no-store",
        })
        const data = await res.json();
        if(res.status == 200){
            return NextResponse.json({
                status: 200,
                Ok: true,
                data: data,
                messesger: 'GetChildLocation successfull'
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