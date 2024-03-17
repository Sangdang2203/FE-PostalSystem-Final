import { NextResponse } from "next/server";
export async function GET(req: Request,{ params }: { params: { serviceTypeId : number, weightFrom : number, weightTo :number,serviceId:number } }) {
    const {serviceTypeId, weightFrom,weightTo,serviceId} = params;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/ValidateServiceWeight/${serviceTypeId}/${weightFrom}/${weightTo}/${serviceId}`;

    const res = await fetch(url,{cache: "no-store"});
    const data = await res.json();
    if(res.status===200){
        return NextResponse.json({ 
            check: true,
            data: data,
        });
    }else{
        return NextResponse.json({ 
            check: false,
            data: data,
        });
    }
}