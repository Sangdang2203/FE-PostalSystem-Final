import { DataFeeCustomType } from "@/helper/interface";
import { NextResponse } from "next/server";
export async function GET(req: Request,{ params }: { params: { postalCodeFrom: string, postalCodeTo: string, weight:number } }) {
    const {postalCodeFrom, postalCodeTo,weight} = params;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/FeeCustom/GetFeeByPostalCodeWeight/${postalCodeFrom}/${postalCodeTo}/${weight}`;
    try{
        const res = await fetch(url,{cache: "no-store"});
        const data:DataFeeCustomType[] = await res.json();
        if(res.ok){
            return NextResponse.json({ 
                url: url,
                data: data,
            });
        }else{
            return NextResponse.json({ 
                url: url,
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
    // return NextResponse.json({ url: url });
}