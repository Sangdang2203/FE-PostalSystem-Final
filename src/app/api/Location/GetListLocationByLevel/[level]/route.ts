import { NextResponse } from "next/server";
export async function GET(req: Request,{ params }: { params: { level: string } }) {
    const level = params.level;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Location/GetListLocationByLevel/${level}`,{
            cache: "no-store",
        })
        const data = await res.json();
        if(res.status == 200){
            return NextResponse.json({
                status: 200,
                Ok: true,
                data: data,
                messesger: 'GetListLocationByLevel successfull'
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