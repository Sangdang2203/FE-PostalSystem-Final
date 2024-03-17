import { DataFeeCustomType } from "@/helper/interface";
import { NextResponse } from "next/server";
export async function GET(req: Request,{ params }: { params: { postalCodeFrom: string, postalCodeTo: string } }) {
    const {postalCodeFrom, postalCodeTo} = params;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/FeeCustom/GetFeeByPostalCode/${postalCodeFrom}/${postalCodeTo}`;
    try{
        const res = await fetch(url,{cache: "no-store"});
        const data = await res.json();
        if(res.ok){
            return NextResponse.json({ 
                data: data,
            });
        }else{
            return NextResponse.json({ 
                error: "api backend error",
                status: 400,
            });
        }
    }catch{
        return NextResponse.json({ 
            url: url,
            error: "api backend error",
            status: 400,
        });
    }
    return NextResponse.json({ url: url });
}