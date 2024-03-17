import { NextResponse } from "next/server";
export async function GET(req: Request,{ params }: { params: { statusId: number } }) {
    const statusId = params.statusId;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ServiceType/ChangeServiceTypeStatus/${statusId}`,{
            cache: "no-store",
        })
        if(res.status == 200){
            return NextResponse.json({
                statusId:statusId,
                status: 200,
                Ok: true,
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